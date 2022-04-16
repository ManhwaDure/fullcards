import {
  Card,
  CardBackground,
  CardContent,
  CardContentButton,
  CardGalleryImage,
  CardTitle,
  CardWithDetails,
  Image
} from "./CardTypes";

export default class CardApiResponseSafetyTransformer {
  static transformCard({ id, order }: Card): Card {
    let result = { id, order };
    for (const i in result)
      if (typeof result[i] === "undefined") delete result[i];
    return result;
  }

  static transformCardWithDetails({
    id,
    order,
    title,
    background,
    content
  }: CardWithDetails): CardWithDetails {
    let result = { id, order, title, background, content };
    for (const i in result)
      if (typeof result[i] === "undefined") delete result[i];
    if (result.title)
      result.title = CardApiResponseSafetyTransformer.transformTitle(
        result.title
      );
    if (result.background)
      result.background = CardApiResponseSafetyTransformer.transformBackground(
        result.background
      );
    if (result.content)
      result.content = CardApiResponseSafetyTransformer.transformCardContent(
        result.content
      );
    return result;
  }

  static transformTitle({ id, content, position }: CardTitle): CardTitle {
    let result = { id, content, position };
    for (const i in result)
      if (typeof result[i] === "undefined") delete result[i];
    return result;
  }

  static transformBackground({
    id,
    image,
    css,
    defaultGradient,
    pseudoParallaxScrollingAnimation,
    pseudoParallaxScrollingAnimationDuration
  }: CardBackground): CardBackground {
    let result = {
      id,
      image,
      css,
      defaultGradient,
      pseudoParallaxScrollingAnimation,
      pseudoParallaxScrollingAnimationDuration
    };
    for (const i in result)
      if (typeof result[i] === "undefined") delete result[i];
    if (result.image)
      result.image = CardApiResponseSafetyTransformer.transformImage(
        result.image
      );
    return result;
  }

  static transformCardContent({
    id,
    content,
    buttons,
    withScrollDownText
  }: CardContent): CardContent {
    let result = { id, content, buttons, withScrollDownText };
    for (const i in result)
      if (typeof result[i] === "undefined") delete result[i];
    if (result.buttons)
      result.buttons = result.buttons
        .map(CardApiResponseSafetyTransformer.transformCardContentButton)
        .sort((a, b) => a.order - b.order);
    return result;
  }

  static transformCardContentButton({
    id,
    content,
    order,
    type,
    galleryImages,
    href
  }: CardContentButton): CardContentButton {
    let result = { id, content, order, type, galleryImages, href };
    for (const i in result)
      if (typeof result[i] === "undefined") delete result[i];
    if (result.galleryImages)
      result.galleryImages = result.galleryImages
        .map(CardApiResponseSafetyTransformer.transformCardGalleryImage)
        .sort((a, b) => a.order - b.order);
    return result;
  }

  static transformCardGalleryImage({
    id,
    image,
    order
  }: CardGalleryImage): CardGalleryImage {
    let result = { id, image, order };
    for (const i in result)
      if (typeof result[i] === "undefined") delete result[i];
    if (result.image)
      result.image = CardApiResponseSafetyTransformer.transformImage(
        result.image
      );
    return result;
  }

  static transformImage({ id, filename, filesize }: Image): Image {
    let result = { id, filename, filesize };
    for (const i in result)
      if (typeof result[i] === "undefined") delete result[i];
    return result;
  }
}
