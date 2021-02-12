import cuid from "cuid";
import firebase from "firebase/app";
import "firebase/database";
import { Component } from "react";
import { CardSectionJsonData } from "../CardSectionJsonData";
import ImageUploader from "../imageUploader";
import transformCardPageData, { CardPageDataType } from "../transformData";
import Button from "./button";
import { CardPage, CardSectionData } from "./cardPage";
import CenteredLoading from "./centeredLoadingIcon";
import GalleryModal from "./galleryModal";

type propType = {
  databaseRef: firebase.database.Reference;
  imageUploader: ImageUploader;
  fallbackText?: string;
  loadOnce?: boolean;
};
type stateType = {
  cards: CardSectionData[];
  galleryData: { [key: string]: string[] };
  currentlyActiveGalleryId: string;
  loading: boolean;
};
export default class FirebaseCardPage extends Component<propType, stateType> {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      galleryData: {},
      currentlyActiveGalleryId: null,
      loading: true,
    };
    this.onCardChanged = this.onCardChanged.bind(this);
    if (this.props.loadOnce || false)
      this.props.databaseRef.once("value", this.onCardChanged);
    else this.props.databaseRef.on("value", this.onCardChanged);
  }

  async onCardChanged(snapshot: firebase.database.DataSnapshot) {
    if (!this.state.loading)
      this.setState({
        loading: true,
      });
    const data: CardSectionJsonData[] = transformCardPageData(
      snapshot.val(),
      CardPageDataType.Firebase,
      CardPageDataType.Json
    );

    const galleryData: { [key: string]: string[] } = {};

    const newCards: CardSectionData[] = await Promise.all(
      data.map(
        async (cardData): Promise<CardSectionData> => {
          const backgroundImageCss =
            cardData.background.image !== null
              ? `url("${
                  (
                    await this.props.imageUploader.getInfoById(
                      cardData.background.image
                    )
                  ).url
                }")`
              : 'url("/gray.png")';
          const buttons = await Promise.all(
            cardData.content.buttons.map(async (buttonData) => {
              if (buttonData.hrefType === "anchor")
                return (
                  <Button href={buttonData.href}>{buttonData.content}</Button>
                );
              else {
                const id = cuid();
                galleryData[id] = await Promise.all(
                  buttonData.galleryImages.map(
                    async (i) =>
                      (await this.props.imageUploader.getInfoById(i)).url
                  )
                );
                return (
                  <Button
                    onClick={() => {
                      this.setState({
                        currentlyActiveGalleryId: id,
                      });
                    }}
                  >
                    {buttonData.content}
                  </Button>
                );
              }
            })
          );
          return {
            title: cardData.title,
            background: {
              images: [backgroundImageCss],
              defaultGradient: cardData.background.defaultGradient,
              style: cardData.background.style,
              pseudoParallaxScrollingAnimation:
                cardData.background.pseudoParallaxScrollingAnimation || false,
              pseudoParallaxScrollingAnimationDuration:
                cardData.background.pseudoParallaxScrollingAnimationDuration ||
                240,
            },
            scrollDownText: cardData.content.scrollDownText,
            content: [
              <p
                dangerouslySetInnerHTML={{
                  __html: cardData.content.htmlPargraph.content,
                }}
              ></p>,
            ].concat(buttons),
          };
        }
      )
    );

    this.setState({
      cards: newCards,
      galleryData,
      currentlyActiveGalleryId: null,
      loading: false,
    });
  }

  render() {
    return this.state.loading ? (
      <CenteredLoading />
    ) : this.state.cards.length === 0 && this.props.fallbackText ? (
      <p>{this.props.fallbackText}</p>
    ) : (
      [<CardPage cards={this.state.cards}></CardPage>].concat(
        Object.entries(this.state.galleryData).map(([galleryId, images]) => (
          <GalleryModal
            imageUrls={images}
            active={this.state.currentlyActiveGalleryId === galleryId}
            onClose={() => this.setState({ currentlyActiveGalleryId: null })}
          ></GalleryModal>
        ))
      )
    );
  }
}
