import firebase from "firebase/app";
import "firebase/database";
import Head from "next/head";
import { Component } from "react";
import firebaseConfig from "../../../data/firebaseConfig";
import FirebaseCardPage from "../../components/firebaseCardPage";
import ImageUploader from "../../imageUploader";

export default class Preview extends Component<
  {},
  {
    draftRef: firebase.database.Reference;
  }
> {
  _imageUploader: ImageUploader = null;
  constructor(props) {
    super(props);
    this.state = {
      draftRef: null,
    };
    if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("refreshed");
        this.setState({ draftRef: firebase.database().ref("cards_draft") });
      }
    });
  }
  render() {
    const imageUploader = new ImageUploader("/images_draft");
    return this.state.draftRef === null ? (
      "현재 불러오는 있습니다. 오랜 시간이 지나도 계속 이 문장이 뜨는 경우 인증이 되지 않았거나 권한이 없는 경우입니다."
    ) : (
      <div>
        <Head>
          <title>미리보기</title>
        </Head>
        <FirebaseCardPage
          databaseRef={this.state.draftRef}
          imageUploader={imageUploader}
        ></FirebaseCardPage>
      </div>
    );
  }
}
