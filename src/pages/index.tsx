import Head from "next/head";
import { Component } from "react";
import { CardWithDetails } from "../apiClient";
import { SiteSettingMap } from "../apiClient/models/SiteSettingMap";
import RestApiDataCardPage from "../components/restApiDataCardPage";
import { getApiClient } from "../GetApiClient";
import ImageUploader from "../imageUploader";
import siteSettingsToMetaTags from "../siteSettingsToMetaTags";

type propsType = {
  fallbackText: string;
  cards: CardWithDetails[];
  siteSettings: SiteSettingMap;
};
export default class Home extends Component<propsType> {
  private imageUploader: ImageUploader;
  constructor(props) {
    super(props);
    this.imageUploader = new ImageUploader();
  }
  render() {
    return (
      <div>
        <Head>
          {siteSettingsToMetaTags(this.props.siteSettings, this.imageUploader)}
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

export async function getServerSideProps(
  context
): Promise<{ props: propsType }> {
  const apiClient = getApiClient();
  const apiBase = (await import("../../configs/endpoints/serverSide.json"))
    .default;
  apiClient.request.config.BASE = apiBase;
  const cards = await Promise.all(
    (await apiClient.default.getCards()).map(i =>
      apiClient.default.getCard(i.id)
    )
  );

  const siteSettings = await apiClient.default.getAllSiteSettings();

  return {
    props: { cards, fallbackText: "사이트 공사중입니다.", siteSettings }
  };
}
