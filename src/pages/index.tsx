import firebase from "firebase/app";
import "firebase/database";
import Head from "next/head";
import { Component } from "react";
import firebaseConfig from "../../data/firebaseConfig";
import CenteredLoading from "../components/centeredLoadingIcon";
import FirebaseCardPage from "../components/firebaseCardPage";
import ImageUploader from "../imageUploader";
export default class Home extends Component<
  {},
  {
    databaseRef: firebase.database.Reference;
    imageUploader: ImageUploader;
    loading: boolean;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      databaseRef: null,
      imageUploader: null,
      loading: true,
    };
    if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);
  }
  async componentDidMount() {
    this.setState({
      databaseRef: firebase.database().ref("/cards"),
      imageUploader: new ImageUploader(),
    });
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
        {this.state.databaseRef === null ? (
          <CenteredLoading />
        ) : (
          <FirebaseCardPage
            databaseRef={this.state.databaseRef}
            imageUploader={this.state.imageUploader}
            fallbackText="현재 사이트 공사중입니다"
            loadOnce
          />
        )}
      </div>
    );
  }
}
