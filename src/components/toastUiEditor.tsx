import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from '@toast-ui/react-editor';
import { Component, createRef, RefObject } from "react";
import 'tui-color-picker/dist/tui-color-picker.css';
import toastUiEditorHtmlRawEditPlugin from './toastUiEditorHtmlRawEditPlugin';

type propsType = {
  onChange: (value: string) => void;
  value: string;
};
type stateType = {
  value: string;
  saving: boolean;
  dirty: boolean;
};

export default class ToastUiEditor extends Component<propsType, stateType> {
  private toastEditorRef: RefObject<Editor>;
  private rawHtmlEditorRef: RefObject<HTMLTextAreaElement>

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      saving: false,
      dirty: false,
    };

    this.toastEditorRef = createRef();
    this.handleDirty = this.handleDirty.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }
  handleDirty() {
    this.setState({
      value: this.toastEditorRef.current.getInstance().getHTML(),
      dirty: true
    });
  }
  handleBlur() {
    if (this.props.value !== this.state.value) {
      this.setState({
        saving: true
      });
      this.props.onChange(this.state.value);
    }
  }
  render() {
    return this.state.saving ? (
      <div className="notification is-info">서버 저장중입니다.</div>
    ) : (
      <div>
        <Editor
          initialValue={this.state.value}
          previewStyle="vertical"
          height="400px"
          initialEditType="wysiwyg"
          hideModeSwitch={true}
          onChange={this.handleDirty}
          onBlur={this.handleBlur}
          customHTMLRenderer={{
            htmlBlock: {
              // allows iframe for youtube embedding
              iframe(node: any) {
                return [
                  {
                    type: 'openTag',
                    tagName: 'iframe',
                    outerNewLine: true,
                    attributes: node.attrs
                  },
                  { type: 'html', content: node.childrenHTML },
                  { type: 'closeTag', tagName: 'iframe', outerNewLine: true }
                ];
              }
            }
          }}
          plugins={[colorSyntax, toastUiEditorHtmlRawEditPlugin(() => this.toastEditorRef.current.getInstance())]}
          language="ko-KR"
          ref={this.toastEditorRef}
        ></Editor>

        {this.state.dirty && <p className="is-small">수정사항이 있습니다.</p>}
      </div>
    );
  }
}
