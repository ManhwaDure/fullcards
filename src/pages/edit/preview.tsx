import Head from "next/head";
import { Component } from "react";
import { FullcardsApiClient } from "../../apiClient";
import RestApiCardPage from "../../components/restApiCardPage";
import { getApiClient } from "../../GetApiClient";
import ImageUploader from "../../imageUploader";

export default class Preview extends Component<
  {},
  {
    apiClient: FullcardsApiClient;
    imageUploader: ImageUploader;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      apiClient: getApiClient(),
      imageUploader: new ImageUploader()
    };
  }
  async componentDidMount() {}
  render() {
    return this.state.apiClient === null ? (
      "현재 불러오고 있습니다. 오랜 시간이 지나도 계속 이 문장이 뜨는 경우 인증이 되지 않았거나 권한이 없는 경우입니다."
    ) : (
      <div>
        <Head>
          <title>미리보기</title>
        </Head>
        <RestApiCardPage
          apiClient={this.state.apiClient}
          imageUploader={this.state.imageUploader}
        ></RestApiCardPage>
      </div>
    );
  }
}
