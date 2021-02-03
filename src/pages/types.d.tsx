import { CardSectionTitlePosition } from "../components/cardSection";

export type CardSectionJsonData = {
  title: {
    content: string;
    position: CardSectionTitlePosition;
  };
  background: {
    image: string;
    style?: { [key: string]: string };
    defaultGradient?: boolean;
    pseudoParallaxScrollingAnimation?: boolean;
    pseudoParallaxScrollingAnimationDuration?: number;
  };
  content: {
    htmlPargraph: {
      content: string;
    };
    buttons: {
      content: string;
      hrefType: "gallery" | "anchor";
      href: string;
      galleryImages: string[];
    }[];
    scrollDownText?: boolean;
  };
};
