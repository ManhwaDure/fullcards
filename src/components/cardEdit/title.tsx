import { ChangeEvent, Component } from "react";
import { CardSectionJsonData } from "../../pages/types.d";
import { CardSectionTitlePosition } from "../cardSection";

type propsType = {
  title: CardSectionJsonData["title"];
  onChange: (newTitle: propsType["title"]) => void;
};

export default class CardTitleEditor extends Component<propsType> {
  constructor(props) {
    super(props);
    this.handleInputEvent = this.handleInputEvent.bind(this);
  }
  handleInputEvent(evt: ChangeEvent<HTMLInputElement>) {
    const newTitle = this.props.title;
    switch (evt.target.name) {
      case "content":
        newTitle.content = evt.target.value;
        break;
      case "position":
        newTitle.position = evt.target.value as CardSectionTitlePosition;
        break;
      default:
        return;
    }
    this.props.onChange(newTitle);
  }
  render() {
    return (
      <div>
        <div className="field">
          <label htmlFor="" className="label">
            제목
          </label>
          <div className="control">
            <input
              type="text"
              className="input"
              name="content"
              onChange={this.handleInputEvent}
              value={this.props.title.content}
            />
          </div>
        </div>
        <form onSubmit={(evt) => evt.preventDefault()}>
          <div className="field">
            <label htmlFor="" className="label">
              제목 위치
            </label>
            <div className="control">
              <label className="radio">
                <input
                  type="radio"
                  name="position"
                  value="topLeft"
                  onChange={this.handleInputEvent}
                  checked={this.props.title.position === "topLeft"}
                />{" "}
                좌상단
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="position"
                  value="topRight"
                  onChange={this.handleInputEvent}
                  checked={this.props.title.position === "topRight"}
                />{" "}
                우상단
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="position"
                  value="bottomLeft"
                  onChange={this.handleInputEvent}
                  checked={this.props.title.position === "bottomLeft"}
                />{" "}
                좌하단
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="position"
                  value="bottomRight"
                  onChange={this.handleInputEvent}
                  checked={this.props.title.position === "bottomRight"}
                />{" "}
                우하단
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="position"
                  value="center"
                  onChange={this.handleInputEvent}
                  checked={this.props.title.position === "center"}
                />{" "}
                중앙
              </label>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
