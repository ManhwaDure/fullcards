import { ChangeEvent, Component } from "react";
import { CardSectionJsonData } from "../../CardSectionJsonData";
import ImageUploader from "../../imageUploader";
import TinymceEditor from "../tinymceEditor";
import CardContentButtonEditor from "./contentButton";

type propType = {
  content: CardSectionJsonData["content"];
  onChange: (newContent: propType["content"]) => void;
  imageUploader: ImageUploader;
};

export default class CardContentEditor extends Component<propType> {
  constructor(props) {
    super(props);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleButtonsChange = this.handleButtonsChange.bind(this);
    this.handleScrollDownChange = this.handleScrollDownChange.bind(this);
  }
  handleContentChange(newHtml: string) {
    const newOne = this.props.content;
    newOne.htmlPargraph.content = newHtml;
    this.props.onChange(newOne);
  }
  handleScrollDownChange(evt: ChangeEvent<HTMLInputElement>) {
    const newOne = this.props.content;
    newOne.scrollDownText = evt.target.checked;
    this.props.onChange(newOne);
  }
  handleButtonsChange(buttons: propType["content"]["buttons"]) {
    const newOne = this.props.content;
    newOne.buttons = buttons;
    this.props.onChange(newOne);
  }
  render() {
    return (
      <div>
        <div className="field">
          <label htmlFor="" className="label">
            내용
          </label>
          <div className="control">
            <TinymceEditor
              value={this.props.content.htmlPargraph.content}
              onChange={this.handleContentChange}
            />
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label htmlFor="" className="checkbox">
              <input
                type="checkbox"
                checked={this.props.content.scrollDownText}
                onChange={this.handleScrollDownChange}
              />
              &nbsp;컨텐츠 하단에 "스크롤을 내려주세요"를 표시
            </label>
          </div>
        </div>
        <label htmlFor="" className="label">
          컨텐츠 하단 버튼
        </label>
        <CardContentButtonEditor
          buttons={this.props.content.buttons}
          onChange={this.handleButtonsChange}
          imageUploader={this.props.imageUploader}
        />
      </div>
    );
  }
}
