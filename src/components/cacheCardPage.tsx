import cuid from "cuid";
import "firebase/database";
import { Component } from "react";
import { CardSectionJsonData } from "../CardSectionJsonData";
import Button from "./button";
import { CardPage, CardSectionData } from "./cardPage";
import CenteredLoading from "./centeredLoadingIcon";
import GalleryModal from "./galleryModal";

type propType = {
  data: CardSectionJsonData[];
  imageUrls: { [key: string]: string };
  fallbackText?: string;
};
type stateType = {
  cards: CardSectionData[];
  galleryData: { [key: string]: string[] };
  currentlyActiveGalleryId: string;
  loading: boolean;
};
export default class CacheCardPage extends Component<propType, stateType> {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      galleryData: {},
      currentlyActiveGalleryId: null,
      loading: true,
    };
  }

  async componentDidMount() {
    if (!this.state.loading)
      this.setState({
        loading: true,
      });

    const galleryData: { [key: string]: string[] } = {};

    const newCards: CardSectionData[] = await Promise.all(
      this.props.data.map(
        async (cardData): Promise<CardSectionData> => {
          const backgroundImageCss =
            cardData.background.image !== null
              ? `url("${this.props.imageUrls[cardData.background.image]}")`
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
                    async (i) => this.props.imageUrls[i]
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
