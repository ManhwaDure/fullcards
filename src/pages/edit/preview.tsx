import Head from "next/head";
import { Component } from "react";
import socketIo from "socket.io-client";
import { FullcardsApiClient, SiteSettingMap } from "../../apiClient";
import RestApiCardPage from "../../components/restApiCardPage";
import { getApiClient, getApiClientLoginToken } from "../../GetApiClient";
import ImageUploader from "../../imageUploader";
import siteSettingsToMetaTags from "../../siteSettingsToMetaTags";

export default class Preview extends Component<
  {},
  {
    apiClient: FullcardsApiClient;
    imageUploader: ImageUploader;
    siteSettings: SiteSettingMap;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      apiClient: getApiClient(),
      imageUploader: new ImageUploader(),
      siteSettings: {}
    };

    this.onSiteSettingsReceived = this.onSiteSettingsReceived.bind(this);
    this.fetchSiteSettings = this.fetchSiteSettings.bind(this);
  }
  async componentDidMount() {
    this.fetchSiteSettings();
    if (process.browser) {
      const io = socketIo({
        auth: {
          jwt: getApiClientLoginToken()
        }
      });
      io.on("site_settings_changed", this.fetchSiteSettings);
    }
  }
  fetchSiteSettings() {
    this.state.apiClient.default
      .getAllSiteSettings()
      .then(this.onSiteSettingsReceived);
  }
  onSiteSettingsReceived(siteSettings: SiteSettingMap) {
    this.setState({ siteSettings });
  }
  render() {
    return this.state.apiClient === null ? (
      "현재 불러오고 있습니다. 오랜 시간이 지나도 계속 이 문장이 뜨는 경우 인증이 되지 않았거나 권한이 없는 경우입니다."
    ) : (
      <div>
        <Head>
          {siteSettingsToMetaTags(
            this.state.siteSettings,
            this.state.imageUploader,
            { titlePrefix: "(미리보기) " }
          )}
        </Head>
        <RestApiCardPage
          apiClient={this.state.apiClient}
          imageUploader={this.state.imageUploader}
        ></RestApiCardPage>
      </div>
    );
  }
}
