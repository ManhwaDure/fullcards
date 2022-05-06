import dynamic from "next/dynamic";
import React, { Component } from "react";
import "react-quill/dist/quill.snow.css";

const WrappedReactQuill = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>에디터를 불러오는 중입니다...</p>
});

type propsType = {
  onChange: (value: string) => void;
  value: string;
};
type stateType = {
  value: string;
  saving: boolean;
  dirty: boolean;
};
export default class QuillEditor extends Component<propsType, stateType> {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      saving: false,
      dirty: false
    };

    this.handleDirty = this.handleDirty.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
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
  render() {
    return this.state.saving ? (
      <div className="notification is-info">서버 저장중입니다.</div>
    ) : (
      <div>
        <WrappedReactQuill
          theme="snow"
          value={this.state.value}
          onChange={this.handleDirty}
          onBlur={this.handleBlur}
        ></WrappedReactQuill>
        {this.state.dirty && <p className="is-small">수정사항이 있습니다.</p>}
      </div>
    );
  }
}
