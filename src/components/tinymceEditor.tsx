import { Editor } from "@tinymce/tinymce-react";
import React, { Component } from "react";
import { Editor as TinyMCEEditor } from "tinymce";

type propsType = {
  onChange: (value: string) => void;
  value: string;
};
type stateType = {
  value: string;
  saving: boolean;
  dirty: boolean;
};
export default class TinymceEditor extends Component<propsType, stateType> {
  private _editor: TinyMCEEditor;
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      saving: false,
      dirty: false
    };

    if (process.browser) {
      require("tinymce/tinymce");
      require("tinymce/icons/default");
      require("tinymce/themes/silver");
      require("tinymce/plugins/paste");
      require("tinymce/plugins/link");
      require("tinymce/plugins/table");
      require("tinymce/skins/ui/oxide/skin.min.css");
      require("tinymce/skins/ui/oxide/content.min.css");
      require("tinymce/skins/content/default/content.min.css");
      require("tinymce/");
    }
    this.handleDirty = this.handleDirty.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleInit = this.handleInit.bind(this);
  }
  handleDirty(newValue) {
    this.setState({
      value: newValue,
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
  handleInit(evt, editor: TinyMCEEditor) {
    this._editor = editor;
  }
  render() {
    return this.state.saving ? (
      <div className="notification is-info">서버 저장중입니다.</div>
    ) : (
      <div>
        <Editor
          initialValue={this.state.value}
          init={{
            language: "ko_KR",
            language_url: "/tinymce_ko_KR.js",
            skin: false,
            plugins: ["paste", "link", "table"],
            content_css: false
          }}
          onInit={this.handleInit}
          onBlur={this.handleBlur}
          onEditorChange={this.handleDirty}
        />
        {this.state.dirty && <p className="is-small">수정사항이 있습니다.</p>}
      </div>
    );
  }
}
