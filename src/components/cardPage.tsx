import { Component, ReactNode } from "react";
import { CardSectionTitlePosition } from "../CardSectionTitlePosition";
import CardContainer from "./cardContainer";
import CardSection from "./cardSection";

export type CardSectionData = {
  id: string;
  title: {
    content: string;
    position: CardSectionTitlePosition;
  };
  background: {
    images: string[];
    style?: { [key: string]: string };
    defaultGradient?: boolean;
    pseudoParallaxScrollingAnimation?: boolean;
    pseudoParallaxScrollingAnimationDuration?: number;
  };
  content: ReactNode[];
  scrollDownText?: boolean;
};
export type CardPageProps = {
  cards: CardSectionData[];
};

export class CardPage extends Component<CardPageProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CardContainer>
        {this.props.cards.map((i, index, cards) => (
          <CardSection
            key={i.id}
            title={i.title.content}
            titlePosition={i.title.position}
            background={(i.background.defaultGradient !== false
              ? ["linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))"]
              : []
            )
              .concat(i.background.images)
              .join(", ")}
            backgroundStyle={i.background.style || {}}
            scrollDownText={i.scrollDownText || false}
            pseudoParallaxScrolling={
              i.background.pseudoParallaxScrollingAnimation || false
            }
            pseudoParallaxScrollingDuration={
              i.background.pseudoParallaxScrollingAnimationDuration
            }
            scrollDownIcon={index !== cards.length - 1}
          >
            {i.content}
          </CardSection>
        ))}
      </CardContainer>
    );
  }
}
