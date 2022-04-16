import { Component } from "react";
import { CardContentButtonHrefTypes, CardWithDetails } from "../apiClient";
import ImageUploader from "../imageUploader";
import Button from "./button";
import { CardPage, CardSectionData } from "./cardPage";
import CenteredLoading from "./centeredLoadingIcon";
import GalleryModal from "./galleryModal";

type propType = {
  imageUploader: ImageUploader;
  fallbackText?: string;
  cards: CardWithDetails[];
};
type stateType = {
  cards: CardSectionData[];
  galleryData: { [key: string]: string[] };
  currentlyActiveGalleryId: string;
  loading: boolean;
};

const grayPngDataUri =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAABmCAIAAAAlNcaXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAADxSURBVHhe7dGBAAAADASh+Wu92EC6FLpF0relb0vflr4tfVv6tvRt6dvSt6VvS9+Wvi19W/q29G3p29K3pW9L35a+LX1b+rb0benb0relb0vflr4tfVv6tvRt6dvSt6VvS9+Wvi19W/q29G3p29K3pW9L35a+LX1b+rb0benb0relb0vflr4tfVv6tvRt6dvSt6VvS9+Wvi19W/q29G3p29K3pW9L35a+LX1b+rb0benb0relb0vflr4tfVv6tvRt6dvSt6VvS9+Wvi19W/q29G3p29K3pW9L35a+LX1b+rb0benb0relb0vflr4tfUu2B3jCQ/ngDpmNAAAAAElFTkSuQmCC";

export default class RestApiDataCardPage extends Component<
  propType,
  stateType
> {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      galleryData: {},
      currentlyActiveGalleryId: null,
      loading: true
    };

    this.transformCardData = this.transformCardData.bind(this);
    this.transformCardData();
  }

  async transformCardData() {
    if (!this.state.loading)
      this.setState({
        loading: true
      });

    const galleryData: { [key: string]: string[] } = {};

    const newCards: CardSectionData[] = await Promise.all(
      this.props.cards.map(
        async (cardData): Promise<CardSectionData> => {
          const backgroundImageCss = cardData.background.image
            ? `url("${
                (
                  await this.props.imageUploader.getInfoById(
                    cardData.background.image.id
                  )
                ).url
              }")`
            : `url("${grayPngDataUri}")`;
          const buttons = cardData.content.buttons.map(buttonData => {
            if (buttonData.type === CardContentButtonHrefTypes.ANCHOR)
              return (
                <Button href={buttonData.href}>{buttonData.content}</Button>
              );
            else {
              const id = buttonData.id;
              galleryData[id] = buttonData.galleryImages.map(i =>
                this.props.imageUploader.idToImageUrl(i.image.id)
              );
              return (
                <Button
                  onClick={() => {
                    this.setState({
                      currentlyActiveGalleryId: id
                    });
                  }}
                >
                  {buttonData.content}
                </Button>
              );
            }
          });
          return {
            id: cardData.id,
            title: cardData.title,
            background: {
              images: [backgroundImageCss],
              defaultGradient: cardData.background.defaultGradient,
              style: cardData.background.css,
              pseudoParallaxScrollingAnimation:
                cardData.background.pseudoParallaxScrollingAnimation || false,
              pseudoParallaxScrollingAnimationDuration:
                cardData.background.pseudoParallaxScrollingAnimationDuration ||
                240
            },
            scrollDownText: cardData.content.withScrollDownText,
            content: [
              <p
                dangerouslySetInnerHTML={{
                  __html: cardData.content.content
                }}
              ></p>
            ].concat(buttons)
          };
        }
      )
    );

    this.setState({
      cards: newCards,
      galleryData,
      currentlyActiveGalleryId: null,
      loading: false
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
            key={galleryId}
            imageUrls={images}
            active={this.state.currentlyActiveGalleryId === galleryId}
            onClose={() => this.setState({ currentlyActiveGalleryId: null })}
          ></GalleryModal>
        ))
      )
    );
  }
}
