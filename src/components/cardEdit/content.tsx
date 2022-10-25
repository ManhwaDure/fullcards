import dynamic from 'next/dynamic';
import { ChangeEvent, Component } from "react";
import { CardWithDetails } from "../../apiClient";
import ImageUploader from "../../imageUploader";
import CardContentButtonEditor, {
  CardContentButtonEditorEventHandlers
} from "./contentButton";

const ToastUiEditor = dynamic(() => import('../toastUiEditor'), {
  loading: () => <p>편집기를 불러오고있습니다...</p>,
  ssr: false
})

type propType = {
  content: CardWithDetails["content"];
  onChange: (newContent: propType["content"]) => void;
  buttonEventHandlers: CardContentButtonEditorEventHandlers;
  imageUploader: ImageUploader;
};

type stateType = {
  isEditingHTML: boolean
};

export default class CardContentEditor extends Component<propType, stateType> {
  constructor(props) {
    super(props);
    this.state = { isEditingHTML: false };

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
            <ToastUiEditor
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
