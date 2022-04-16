import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component } from "react";
import styles from "../../../styles/CardEditor.module.scss";
import { CardWithDetails } from "../../apiClient";
import ImageUploader from "../../imageUploader";
import CardBackgroundEditor from "./background";
import CardContentEditor from "./content";
import { CardContentButtonEditorEventHandlers } from "./contentButton";
import CardTitleEditor from "./title";

type propsType = {
  cardIndex: number;
  card: CardWithDetails;
  orderUpButton: boolean;
  orderDownButton: boolean;
  onChange: (
    newCard: CardWithDetails,
    changeType: "title" | "background" | "content"
  ) => void;
  onDelete: () => void;
  onReorder: (difference: number) => void;
  buttonEventHandlers: CardContentButtonEditorEventHandlers;
  imageUploader: ImageUploader;
};
type stateType = {
  cardExpanded: boolean;
};

export default class CardEditor extends Component<propsType, stateType> {
  constructor(props) {
    super(props);
    this.state = {
      cardExpanded: false
    };
    this.toggleCardExpansion = this.toggleCardExpansion.bind(this);
    this.handleBackgroundChange = this.handleBackgroundChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleTitlechange = this.handleTitlechange.bind(this);
  }

  toggleCardExpansion() {
    this.setState(state => {
      return {
        cardExpanded: !state.cardExpanded
      };
    });
  }

  handleBackgroundChange(background: CardWithDetails["background"]) {
    const newCard = this.props.card;
    newCard.background = background;
    this.props.onChange(newCard, "background");
  }
  handleContentChange(content: CardWithDetails["content"]) {
    const newCard = this.props.card;
    newCard.content = content;
    this.props.onChange(newCard, "content");
  }
  handleTitlechange(title: CardWithDetails["title"]) {
    const newCard = this.props.card;
    newCard.title = title;
    this.props.onChange(newCard, "title");
  }

  render() {
    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            카드 ({this.props.cardIndex}번째)&nbsp;
            <button
              className="button is-small"
              disabled={!this.props.orderDownButton}
              onClick={() => this.props.onReorder(1)}
            >
              <FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon>
            </button>
            <button
              className="button is-small"
              disabled={!this.props.orderUpButton}
              onClick={() => this.props.onReorder(-1)}
            >
              <FontAwesomeIcon icon={faAngleUp}></FontAwesomeIcon>
            </button>
            <button
              className="button is-danger is-small"
              onClick={this.props.onDelete}
            >
              삭제
            </button>
          </p>
          <a
            className="card-header-icon"
            aria-label="more options"
            onClick={this.toggleCardExpansion}
          >
            <span className="icon">
              <FontAwesomeIcon
                icon={this.state.cardExpanded ? faAngleUp : faAngleDown}
              ></FontAwesomeIcon>
            </span>
          </a>
        </header>
        <div
          className="card-content"
          style={{ display: this.state.cardExpanded ? "" : "none" }}
        >
          <h1 className="title is-5">배경</h1>
          <h2 className="subtitle is-6">카드의 배경</h2>
          <div className={styles.indented}>
            <CardBackgroundEditor
              onChange={this.handleBackgroundChange}
              background={this.props.card.background}
              imageUploader={this.props.imageUploader}
            />
          </div>
          <h1 className="title is-5">타이틀</h1>
          <h2 className="subtitle is-6">오렌지색 선 위의 제목</h2>
          <div className={styles.indented}>
            <CardTitleEditor
              onChange={this.handleTitlechange}
              title={this.props.card.title}
            />
          </div>
          <h2 className="title is-5">컨텐츠</h2>
          <h2 className="subtitle is-6">오렌지색 선 아래의 내용</h2>
          <div className={styles.indented}>
            <CardContentEditor
              onChange={this.handleContentChange}
              content={this.props.card.content}
              imageUploader={this.props.imageUploader}
              buttonEventHandlers={this.props.buttonEventHandlers}
            />
          </div>
        </div>
      </div>
    );
  }
}
