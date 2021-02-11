import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "bulma/css/bulma.min.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import Head from "next/head";
import Link from "next/link";
import { Component } from "react";
import CardEditor from "../../components/cardEdit/index";
import firebaseConfig from "../../firebaseConfig";
import ImageUploader, { ImageUploadResult } from "../../imageUploader";
import transformCardPageData, { CardPageDataType } from "../../transformData";
import { CardSectionJsonData } from "../types.d";

export default class Edit extends Component<
  {},
  {
    idToken: firebase.auth.IdTokenResult;
    cards: CardSectionJsonData[];
    publishing: boolean;
  }
> {
  _imageUploader: ImageUploader = null;
  _databaseRef: firebase.database.Reference = null;
  constructor(props) {
    super(props);
    this.state = {
      idToken: null,
      cards: [],
      publishing: false,
    };
    this._imageUploader = new ImageUploader("/images_draft");
    if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then((idToken) => {
          this.setState({
            idToken,
          });
        });

        this._databaseRef = firebase.database().ref("cards_draft");
      } else
        this.setState({
          idToken: null,
        });
      this.attachDatabaseRefListener();
    });

    this.removeCard = this.removeCard.bind(this);
    this.reorderCard = this.reorderCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.createCard = this.createCard.bind(this);
    this.publish = this.publish.bind(this);
  }
  async publish() {
    if (confirm("게시하겠습니까?")) {
      this.setState({ publishing: true });
      const publishImageUploader = new ImageUploader();
      const publishDatabaseRef = firebase.database().ref("cards");

      let imagesToPublish = [];
      for (const card of this.state.cards) {
        if (card.background.image !== null)
          imagesToPublish.push(card.background.image);
        for (const button of card.content.buttons)
          imagesToPublish = imagesToPublish.concat(button.galleryImages);
      }
      imagesToPublish = imagesToPublish.reduce((prev, cur) => {
        if (!prev.includes(cur)) prev.push(cur);
        return prev;
      }, []);

      await publishImageUploader.deleteAll();

      const uploadPromises: Promise<void>[] = [];
      for (const imageId of imagesToPublish) {
        const info = await this._imageUploader.getInfoById(imageId);
        uploadPromises.push(
          (async ({ url, id, filename }: ImageUploadResult): Promise<void> => {
            const file = await axios({
              url,
              responseType: "blob",
            });

            await publishImageUploader.uploadImage(file.data as Blob, {
              id,
              filename,
            });
          })(info)
        );
      }

      await Promise.all(uploadPromises);

      await publishDatabaseRef.set(
        transformCardPageData(
          this.state.cards,
          CardPageDataType.Json,
          CardPageDataType.Firebase
        )
      );
      this.setState({ publishing: false });
    }
  }
  componentDidMount() {
    this.attachDatabaseRefListener();
  }
  attachDatabaseRefListener() {
    if (this._databaseRef !== null)
      this._databaseRef.on("value", (snapshot) => {
        if (!snapshot.exists()) {
          this.setState({
            cards: [],
          });
          return;
        }
        this.setState({
          cards: transformCardPageData(
            snapshot.val(),
            CardPageDataType.Firebase,
            CardPageDataType.Json
          ),
        });
      });
  }
  async createCard() {
    const newCards = this.state.cards;
    newCards.push(this.getTestData());
    this._databaseRef.set(
      transformCardPageData(
        newCards,
        CardPageDataType.Json,
        CardPageDataType.Firebase
      )
    );
  }
  removeCard(index: number) {
    return async () => {
      const newCards = this.state.cards;
      const cardDeleted = newCards.splice(index, 1)[0];
      if (cardDeleted.background.image !== null) {
        await this._imageUploader.deleteImage(cardDeleted.background.image);
      }
      this._databaseRef.set(
        transformCardPageData(
          newCards,
          CardPageDataType.Json,
          CardPageDataType.Firebase
        )
      );
    };
  }
  reorderCard(index: number) {
    return (difference: number) => {
      const newCards = this.state.cards;
      const card = newCards.splice(index, 1)[0];
      newCards.splice(index + difference, 0, card);
      this._databaseRef.set(
        transformCardPageData(
          newCards,
          CardPageDataType.Json,
          CardPageDataType.Firebase
        )
      );
    };
  }
  updateCard(index: number) {
    return (newCard: CardSectionJsonData) => {
      const newCards = this.state.cards;
      newCards[index] = newCard;
      this._databaseRef.set(
        transformCardPageData(
          newCards,
          CardPageDataType.Json,
          CardPageDataType.Firebase
        )
      );
    };
  }
  signIn() {
    const provider = new firebase.auth.OAuthProvider("oidc.caumd_id");
    firebase.auth().signInWithPopup(provider);
  }
  signOut() {
    firebase.auth().signOut();
  }
  getTestData(): CardSectionJsonData {
    return {
      background: {
        image: null,
        style: {},
        defaultGradient: true,
      },
      content: {
        htmlPargraph: {
          content: "블라블라",
        },
        scrollDownText: false,
        buttons: [],
      },
      title: {
        content: "카드 예시",
        position: "center",
      },
    };
  }
  editArea() {
    return (
      <div>
        <p>
          카드가 한 개도 없을시 "사이트 공사중입니다" 문구가 표시됩니다.
          <br />
          현재 이 페이지의 변경사항은 <strong>미리보기</strong>에만 반영되며,
          외부사람들이 실제로 보는 <Link href="/">페이지</Link>
          에는 반영되지 않습니다. 실제로 보는 페이지에 반영하려면 위{" "}
          <strong>게시</strong>버튼을 눌러주세요.
          <br />
          <strong style={{ color: "red" }}>
            볼 일 다 보셨으면 반드시 로그아웃해주세요! 반드시 미리보기로 확인한
            후 게시하기!
          </strong>
        </p>
        {this.state.cards.map((card, index, cards) => (
          <CardEditor
            orderUpButton={index !== 0}
            orderDownButton={index !== cards.length - 1}
            cardIndex={index + 1}
            card={card}
            onChange={this.updateCard(index)}
            onDelete={this.removeCard(index)}
            onReorder={this.reorderCard(index)}
            key={index}
            imageUploader={this._imageUploader}
          />
        ))}
        <p className="buttons">
          <button className="button is-primary" onClick={this.createCard}>
            카드 생성
          </button>
        </p>
      </div>
    );
  }
  render() {
    const hasPermission =
      this.state.idToken?.claims.firebase.sign_in_attributes.permissions
        .homepage === true;
    return (
      <section className="section">
        <Head>
          <title>
            {this.state.idToken !== null ? "(로그아웃 필수!) " : ""}홈페이지
            수정
          </title>
        </Head>
        <div className="container">
          {this.state.idToken === null ? (
            <div className="has-text-centered">
              <p>
                로그인이 필요합니다. 먼저 로그인해주세요. (참고 : 로그인하는 데
                시간 약간 걸림)
              </p>
              <button className="button" type="button" onClick={this.signIn}>
                로그인
              </button>
            </div>
          ) : this.state.publishing ? (
            <p className="has-text-centered">
              게시중입니다. 잠시만 기다려주세요.
              <br />
              <span style={{ fontSize: "4rem" }}>
                <FontAwesomeIcon icon={faSpinner} spin />
              </span>
            </p>
          ) : (
            <div>
              <p className="buttons">
                <button className="button" type="button" onClick={this.signOut}>
                  로그아웃
                </button>
                {hasPermission && [
                  <a href="/edit/preview" target="_blank" className="button">
                    미리보기
                  </a>,
                  <button
                    className="button is-primary"
                    type="button"
                    onClick={this.publish}
                  >
                    게시
                  </button>,
                ]}
              </p>
              <p>
                현재 {this.state.idToken.claims.email}으로 로그인하셨습니다.
                <br />
                <br />
              </p>
              {hasPermission ? (
                this.editArea()
              ) : (
                <p>
                  권한이 없습니다. 권한이 있음에도 불구하고 오류가 발생한다면
                  다시 로그인해보세요.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    );
    //return <CardPage cards={testData}></CardPage>;
  }
}
