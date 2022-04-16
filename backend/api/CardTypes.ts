export type CardSectionTitlePosition =
  | "center"
  | "bottomLeft"
  | "bottomRight"
  | "topLeft"
  | "topRight";
import { CardContentButtonHrefTypes } from "../database/entities";

export type Card = {
  id: string;
  order: number;
};

export type CardWithDetails = Card & {
  title: CardTitle;
  background: CardBackground;
  content: CardContent;
};

export type CardTitle = {
  id: string;
  content: string;
  position: CardSectionTitlePosition;
};

export type CardBackground = {
  id: string;
  image: Image | null;
  css: { [key: string]: string };
  defaultGradient: boolean;
  pseudoParallaxScrollingAnimation: boolean;
  pseudoParallaxScrollingAnimationDuration: number;
};

export type CardContent = {
  id: string;
  content: string;
  buttons: CardContentButton[];
  withScrollDownText: boolean;
};

export type CardContentButton = {
  id: string;
  content: string;
  order: number;
  type: CardContentButtonHrefTypes;
  galleryImages?: CardGalleryImage[];
  href?: string;
};

export type CardGalleryImage = {
  id: string;
  image: Image | null;
  order: number;
};

export type Image = {
  id: string;
  filename: string;
  filesize: number;
};
