import Head from "next/head";
import { Component } from "react";
import { CardWithDetails } from "../apiClient";
import RestApiDataCardPage from "../components/restApiDataCardPage";
import { getApiClient } from "../GetApiClient";
import ImageUploader from "../imageUploader";

type propsType = {
  fallbackText: string;
  cards: CardWithDetails[];
};
export default class Home extends Component<propsType> {
  private imageUploader: ImageUploader;
  constructor(props) {
    super(props);
    this.imageUploader = new ImageUploader();
  }
  async componentDidMount() {}
  render() {
    return (
      <div>
        <Head>
          <title>미리보기</title>
        </Head>
        <RestApiDataCardPage
          imageUploader={this.imageUploader}
          fallbackText={this.props.fallbackText}
          cards={this.props.cards}
        ></RestApiDataCardPage>
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  const apiClient = getApiClient();
  const cards = await Promise.all(
    (await apiClient.default.getCards()).map(i =>
      apiClient.default.getCard(i.id)
    )
  );

  return {
    props: { cards, fallbackText: "사이트 공사중입니다." }
  };
}
