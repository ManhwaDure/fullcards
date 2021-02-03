import classNames from "classnames";
import { Component, MouseEvent } from "react";
import styles from "../../styles/IllustrationModal.module.scss";

type propType = {
  imageUrls: string[];
  active: boolean;
  onClose: () => void;
};
type stateType = {
  currentlyActiveIndex: number;
};
export default class GalleryModal extends Component<propType, stateType> {
  constructor(props) {
    super(props);
    this.selectAnotherImage = this.selectAnotherImage.bind(this);
    this.state = {
      currentlyActiveIndex: 0,
    };
  }
  selectAnotherImage(difference: number) {
    return (evt: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
      evt.preventDefault();
      let newIndex = this.state.currentlyActiveIndex + difference;
      while (newIndex < 0) newIndex += this.props.imageUrls.length;
      newIndex %= this.props.imageUrls.length;
      this.setState({
        currentlyActiveIndex: newIndex,
      });
    };
  }
  render() {
    return (
      <div
        className={classNames({
          [styles.illustrationModal]: true,
          [styles.isActive]: this.props.active,
        })}
      >
        <div className={styles.modal}>
          {this.props.imageUrls.map((url, index) => (
            <img
              src={url}
              className={classNames({
                [styles.illustration]: true,
                [styles.isActive]: index === this.state.currentlyActiveIndex,
              })}
            ></img>
          ))}
          <nav>
            <a href="#" onClick={this.selectAnotherImage(-1)}>
              &lt; 이전
            </a>
            <a href="#" onClick={this.props.onClose}>
              &times; 닫기
            </a>
            <a href="#" onClick={this.selectAnotherImage(1)}>
              다음 &gt;
            </a>
          </nav>
        </div>
      </div>
    );
  }
}
