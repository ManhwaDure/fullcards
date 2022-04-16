import { ChangeEvent, Component } from "react";
import { CardWithDetails } from "../../apiClient";
import ImageUploader from "../../imageUploader";
import TinymceEditor from "../tinymceEditor";
import CardContentButtonEditor, {
  CardContentButtonEditorEventHandlers
} from "./contentButton";

type propType = {
  content: CardWithDetails["content"];
  onChange: (newContent: propType["content"]) => void;
  buttonEventHandlers: CardContentButtonEditorEventHandlers;
  imageUploader: ImageUploader;
};

export default class CardContentEditor extends Component<propType> {
  constructor(props) {
    super(props);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleScrollDownChange = this.handleScrollDownChange.bind(this);
  }
  handleContentChange(newHtml: string) {
    const newOne = this.props.content;
    newOne.content = newHtml;
    this.props.onChange(newOne);
  }
  handleScrollDownChange(evt: ChangeEvent<HTMLInputElement>) {
    const newOne = this.props.content;
    newOne.withScrollDownText = evt.target.checked;
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
              value={this.props.content.content}
              onChange={this.handleContentChange}
              key={this.props.content.content}
            />
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label htmlFor="" className="checkbox">
              <input
                type="checkbox"
                checked={this.props.content.withScrollDownText}
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
          imageUploader={this.props.imageUploader}
          {...this.props.buttonEventHandlers}
        />
      </div>
    );
  }
}
