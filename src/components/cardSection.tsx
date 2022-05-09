import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { Component, CSSProperties, ReactNode } from "react";
import VisibilitySensor from "react-visibility-sensor";
import styles from "../../styles/CardSection.module.scss";
import { CardSectionTitlePosition } from "../CardSectionTitlePosition";

type CardSectionPropType = {
  titlePosition: CardSectionTitlePosition;
  title: string;
  scrollDownText?: boolean;
  children?: ReactNode;
  background: string;
  backgroundStyle?: { [key: string]: string };
  pseudoParallaxScrolling?: boolean;
  pseudoParallaxScrollingDuration?: number;
  scrollDownIcon?: boolean;
};
export default class CardSection extends Component<
  CardSectionPropType,
  { animated: boolean }
> {
  constructor(props: CardSectionPropType) {
    super(props);
    this.state = { animated: false };
    this.animateLineWhenVisible = this.animateLineWhenVisible.bind(this);
  }
  animateLineWhenVisible(isVisible) {
    if (isVisible && this.state.animated === false)
      this.setState({ animated: true });
  }
  getBackgroundStyle(): CSSProperties {
    const result: CSSProperties =
      JSON.parse(JSON.stringify(this.props.backgroundStyle)) || {};
    result.backgroundImage = this.props.background;
    if (this.props.pseudoParallaxScrollingDuration)
      result.animationDuration =
        this.props.pseudoParallaxScrollingDuration.toString() + "s";
    return result;
  }
  render() {
    const isTitleLeft = this.props.titlePosition.endsWith("Left"),
      isTitleTop = this.props.titlePosition.startsWith("top"),
      isTitleCenter = this.props.titlePosition === "center";
    return (
      <section
        className={classNames({
          [styles.fullsizeCard]: true,
          [styles.withTitle]: true,
          [styles.hasTitleCentered]: isTitleCenter,
          [styles.hasTitleLeft]: !isTitleCenter && isTitleLeft,
          [styles.hasTitleRight]: !isTitleCenter && !isTitleLeft,
          [styles.hasTitleTop]: !isTitleCenter && isTitleTop,
          [styles.hasTitleBottom]: !isTitleCenter && !isTitleTop,
          [styles.pseudoParallaxScrolling]: this.props.pseudoParallaxScrolling
        })}
        style={this.getBackgroundStyle()}
      >
        <div className={styles.title}>
          <h1>{this.props.title}</h1>
          <VisibilitySensor
            onChange={this.animateLineWhenVisible}
            intervalDelay={50}
          >
            <div
              className={
                styles.line + (this.state.animated ? " " + styles.animated : "")
              }
            >
              &nbsp;
            </div>
          </VisibilitySensor>
          <div>
            <div className={styles.contentParagraph}>{this.props.children}</div>
            {this.props.scrollDownText && (
              <div className={styles.scrollDownText}>스크롤을 내려보세요!</div>
            )}
          </div>
        </div>
        {this.props.scrollDownIcon !== false && (
          <div className={styles.scrollDownIcon}>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        )}
      </section>
    );
  }
}
