import { Editor } from "@tinymce/tinymce-react";
import { Component } from "react";

type propsType = {
  onChange: (value: string) => void;
  value: string;
};
export default class TinymceEditor extends Component<propsType> {
  constructor(props) {
    super(props);
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
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(newValue) {
    this.props.onChange(newValue);
  }
  render() {
    return (
      <Editor
        initialValue={this.props.value}
        init={{
          language: "ko_KR",
          language_url: "/tinymce_ko_KR.js",
          skin: false,
          plugins: ["paste", "link", "table"],
          content_css: false,
        }}
        onEditorChange={this.handleChange}
      />
    );
  }
}
