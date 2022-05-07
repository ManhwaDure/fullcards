import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bulma/css/bulma.min.css";
import Head from "next/head";
import { Component } from "react";
import socket from "socket.io-client";
import {
  CardWithDetails,
  FullcardsApiClient,
  SiteSettingMap,
  SiteSettingName
} from "../../apiClient";
import { CardContentButtonEditorEventHandlers } from "../../components/cardEdit/contentButton";
import CardEditor from "../../components/cardEdit/index";
import SiteSettingEditor from "../../components/siteSettingEditor";
import {
  apiClientLogout,
  getApiClient,
  getApiClientLoginToken,
  isApiClientLoggedIn
} from "../../GetApiClient";
import ImageUploader from "../../imageUploader";

export default class Edit extends Component<
  {},
  {
    cards: CardWithDetails[];
    siteSettings: SiteSettingMap;
    publishing: boolean;
    edited: boolean;
    userId: string;
    siteSettingEditorKey: number;
  }
> {
  _imageUploader: ImageUploader = null;
  _apiClient: FullcardsApiClient;
  constructor(props) {
    super(props);
    this.state = {
      edited: false,
      cards: [],
      siteSettings: {},
      publishing: false,
      userId: null,
      siteSettingEditorKey: Date.now()
    };
    this._imageUploader = new ImageUploader();
    this._apiClient = getApiClient();

    this.removeCard = this.removeCard.bind(this);
    this.reorderCard = this.reorderCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.createCard = this.createCard.bind(this);
    this.publish = this.publish.bind(this);
    this.fetchCardData = this.fetchCardData.bind(this);
    this.fetchSiteSettingsData = this.fetchSiteSettingsData.bind(this);
    this.updateSiteSetting = this.updateSiteSetting.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }
  async publish() {
    if (confirm("게시하겠습니까?")) {
      this.setState({ publishing: true });

      await this._apiClient.default.publishWebsite();

      this.setState({ publishing: false });
    }
  }
  async componentDidMount() {
    this.fetchCardData();
    this.fetchSiteSettingsData();
    if (process.browser) {
      const io = socket({
        auth: {
          jwt: getApiClientLoginToken()
        }
      });
      io.on("cards_changed", this.fetchCardData);
      io.on("site_settings_changed", this.fetchSiteSettingsData);
    }

    if (isApiClientLoggedIn() && this.state.userId === null)
      this._apiClient.default
        .me()
        .then(({ id }) => {
          this.setState({ userId: id });
        })
        .catch(_err => {
          apiClientLogout();
        });
  }
  async fetchCardData() {
    const cards = await Promise.all(
      (await this._apiClient.default.getCards()).map(
        async i => await this._apiClient.default.getCard(i.id)
      )
    );
    this.setState({
      cards
    });
  }
  async fetchSiteSettingsData() {
    const siteSettings = await this._apiClient.default.getAllSiteSettings();
    this.setState({
      siteSettings,
      siteSettingEditorKey: Date.now()
    });
  }
  async createCard() {
    await this._apiClient.default.createCard();
  }
  removeCard(cardId: string) {
    return async () => {
      await this._apiClient.default.deleteCard(cardId);
    };
  }
  reorderCard(index: number) {
    return async (difference: number) => {
      const card = this.state.cards[index];
      const anotherCard = this.state.cards[index + difference];

      if (typeof anotherCard !== "undefined")
        await this._apiClient.default.swapCardOrder(card.id, anotherCard.id);
    };
  }
  async updateSiteSetting(settings: SiteSettingMap) {
    for (const i in settings) {
      await this._apiClient.default.setSiteSetting(i as SiteSettingName, {
        value: settings[i]
      });
    }
  }
  updateCard(cardId: string) {
    return async (
      newCard: CardWithDetails & { background: { imageId?: string } },
      changeType: "title" | "background" | "content"
    ) => {
      switch (changeType) {
        case "background":
          if (newCard.background.image)
            newCard.background.imageId = newCard.background.image.id;
          await this._apiClient.default.updateBackground(
            cardId,
            newCard.background
          );
          break;
        case "title":
          await this._apiClient.default.updateTitle(cardId, newCard.title);
          break;
        case "content":
          await this._apiClient.default.updateContent(cardId, newCard.content);
          break;
      }
    };
  }
  contentButtonEventHandlers(
    cardId: string
  ): CardContentButtonEditorEventHandlers {
    return {
      onChange: async btn => {
        await this._apiClient.default.updateButton(cardId, btn.id, btn);
      },
      onCreate: async () => {
        await this._apiClient.default.createButton(cardId);
      },
      onDelete: async btnId => {
        await this._apiClient.default.deleteButton(cardId, btnId);
      },
      onGalleryChange: async (btnId, imageIds) => {
        await this._apiClient.default.updateButtonGalleryImages(
          cardId,
          btnId,
          imageIds
        );
      },
      onSwap: async (id, secondId) => {
        await this._apiClient.default.swapButtonOrder(cardId, id, secondId);
      }
    };
  }
  async signIn() {
    const loginUrl = await this._apiClient.default.getOidcAuthorizationUrl();
    location.href = loginUrl;
  }
  async signOut() {
    apiClientLogout();
    location.reload();
  }
  editArea() {
    return (
      <div>
        <p>
          카드가 한 개도 없을시 "사이트 공사중입니다" 문구가 표시됩니다.
          <br />
          <br />
          현재 이 페이지에서 수정하는 즉시 미리보기와 외부인들이 보는 실제
          홈페이지에 바로 반영됩니다. 다만{" "}
          <span style={{ textDecoration: "underline" }}>
            배경 위치, 제목, 컨텐츠 내용, 컨텐츠 하단 버튼 텍스트, 컨텐츠 하단
            버튼 링크대상, 사이트 설정
          </span>
          은 포커스를 잃을때(즉 Tab키나 마우스 등을 이용해 다른 곳을 선택하게
          될때) 서버에 자동으로 저장되어 반영됩니다.
          <br />
          <strong style={{ color: "red" }}>
            볼 일 다 보셨으면 반드시 로그아웃해주세요! 반드시 미리보기로 확인한
            후 게시하기!
          </strong>
        </p>
        <SiteSettingEditor
          imageUploader={this._imageUploader}
          onChange={this.updateSiteSetting}
          value={this.state.siteSettings}
          key={this.state.siteSettingEditorKey}
        ></SiteSettingEditor>
        {this.state.cards.map((card, index, cards) => (
          <CardEditor
            orderUpButton={index !== 0}
            orderDownButton={index !== cards.length - 1}
            cardIndex={index + 1}
            card={card}
            onChange={this.updateCard(card.id)}
            onDelete={this.removeCard(card.id)}
            onReorder={this.reorderCard(index)}
            key={card.id}
            imageUploader={this._imageUploader}
            buttonEventHandlers={this.contentButtonEventHandlers(card.id)}
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
    const hasPermission = isApiClientLoggedIn();

    return (
      <section className="section">
        <Head>
          <title>{hasPermission ? "(로그아웃 필수!) " : ""}홈페이지 수정</title>
        </Head>
        <div className="container">
          {!hasPermission ? (
            <div>
              <p>
                로그인이 필요합니다. 먼저 로그인해주세요. (참고 : 로그인하는 데
                시간 약간 걸림)
              </p>
              <button className="button" type="button" onClick={this.signIn}>
                로그인
              </button>
            </div>
          ) : this.state.publishing ? (
            <p>
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
                  </button>
                ]}
              </p>
              <p>
                현재 {this.state.userId}으로 로그인하셨습니다.
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
  }
}
