import { ChangeEvent, Component } from "react";
import { CardSectionTitlePosition, CardWithDetails } from "../../apiClient";
import BufferedInput from "../bufferedInput";

type propsType = {
  title: CardWithDetails["title"];
  onChange: (newTitle: propsType["title"]) => void;
};

export default class CardTitleEditor extends Component<propsType> {
  constructor(props) {
    super(props);
    this.handleRadioInputEvent = this.handleRadioInputEvent.bind(this);
    this.handleBufferedInputEvent = this.handleBufferedInputEvent.bind(this);
  }
  handleRadioInputEvent(evt: ChangeEvent<HTMLInputElement>) {
    const newTitle = this.props.title;
    newTitle.position = evt.target.value as CardSectionTitlePosition;
    this.props.onChange(newTitle);
  }
  handleBufferedInputEvent(evt: { name: string; value: string }) {
    const newTitle = this.props.title;
    newTitle.content = evt.value;
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
            <BufferedInput
              name="content"
              onChange={this.handleBufferedInputEvent}
              value={this.props.title.content}
              key={this.props.title.content}
            />
          </div>
        </div>
        <form onSubmit={evt => evt.preventDefault()}>
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
                  onChange={this.handleRadioInputEvent}
                  checked={this.props.title.position === "topLeft"}
                />{" "}
                좌상단
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="position"
                  value="topRight"
                  onChange={this.handleRadioInputEvent}
                  checked={this.props.title.position === "topRight"}
                />{" "}
                우상단
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="position"
                  value="bottomLeft"
                  onChange={this.handleRadioInputEvent}
                  checked={this.props.title.position === "bottomLeft"}
                />{" "}
                좌하단
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="position"
                  value="bottomRight"
                  onChange={this.handleRadioInputEvent}
                  checked={this.props.title.position === "bottomRight"}
                />{" "}
                우하단
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="position"
                  value="center"
                  onChange={this.handleRadioInputEvent}
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
