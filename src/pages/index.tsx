import * as firebaseAdmin from "firebase-admin";
import Head from "next/head";
import { Component } from "react";
import redis from "redis";
import { CardSectionJsonData } from "../CardSectionJsonData";
import CacheCardPage from "../components/cacheCardPage";
import getConfig from "../getConfigs";
import transformCardPageData, { CardPageDataType } from "../transformData";
export default class Home extends Component<{
  data: CardSectionJsonData[];
  imageUrls: { [id: string]: string };
}> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Head>
          <title key="title">만화두레</title>
          <meta
            key="description"
            name="description"
            content="중앙대학교 만화동아리 만화두레"
          />
          <meta key="author" name="author" content="만화두레" />
          <meta key="og:title" property="og:title" content="만화두레" />
          <meta key="og:type" property="og:type" content="website" />
          <meta
            key="og:image"
            property="og:image"
            content="https://caumd.club/mdlogo.jpg"
          />
          <meta key="og:url" property="og:url" content="https://caumd.club" />
          <meta key="og:locale" property="og:locale" content="ko_KR" />
          <meta
            key="og:description"
            property="og:description"
            content="중앙대학교 서울캠퍼스의 만화동아리"
          />
        </Head>
        <CacheCardPage
          data={this.props.data}
          imageUrls={this.props.imageUrls}
          fallbackText="현재 사이트 공사중입니다"
        />
      </div>
    );
  }
}

export function getStaticProps(): Promise<{
  props: { data: CardSectionJsonData[]; imageUrls: { [key: string]: string } };
}> {
  return new Promise(async (resolve, reject) => {
    const redisClient = redis.createClient(await getConfig("redis"));
    redisClient.get("cached_card_props", async (err, res) => {
      if (err) reject(err);
      if (res !== null) {
        return resolve({
          props: JSON.parse(res),
        });
      }

      const app =
        firebaseAdmin.apps.length !== 0
          ? firebaseAdmin.apps[0]
          : firebaseAdmin.initializeApp(await getConfig("firebaseAdmin"));

      const database = firebaseAdmin.database();
      const ref = database.ref("/cards");
      ref
        .get()
        .then(async (snapshot) => {
          if (!snapshot.exists()) {
            return resolve({
              props: {
                data: [],
                imageUrls: {},
              },
            });
          }

          const data = transformCardPageData(
            snapshot.val(),
            CardPageDataType.Firebase,
            CardPageDataType.Json
          );

          const imageUrls = {};
          const updateImageUrlCache = async (id: string) => {
            if (!imageUrls[id]) {
              const bucket = firebaseAdmin.storage(app).bucket();
              const file = bucket.file("images/" + id);
              imageUrls[id] = await file.getSignedUrl({
                action: "read",
                expires: new Date(Date.now() + 1000 * 60 * 60),
              });
            }
          };

          for (const i of data) {
            if (i.background.image !== null) {
              await updateImageUrlCache(i.background.image);
            }
            for (const button of i.content.buttons)
              for (const galleryImage of button.galleryImages)
                await updateImageUrlCache(galleryImage);
          }

          redisClient.setex(
            "cached_card_props",
            60 * 3,
            JSON.stringify({
              imageUrls,
              data,
            })
          );
          resolve({
            props: {
              imageUrls,
              data,
            },
          });
        })
        .catch(reject);
    });
  });
}
