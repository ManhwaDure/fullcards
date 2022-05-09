import { ChangeEvent, Component } from "react";

type CustomizedChangeEventArg = {
  name: string;
  value: string;
};
type propType = {
  name?: string;
  onChange: (arg: CustomizedChangeEventArg) => void;
  value: string;
  small?: boolean;
  disabled?: boolean;
  style?: { [key: string]: string };
};
type stateType = {
  valueState: string;
  modified: boolean;
  pending: boolean;
};
export default class BufferedInput extends Component<propType, stateType> {
  constructor(props) {
    super(props);
    this.state = {
      valueState: props.value,
      modified: false,
      pending: false
    };
    this.updateValueState = this.updateValueState.bind(this);
    this.triggerEventWhenBlur = this.triggerEventWhenBlur.bind(this);
    this.setUndirty = this.setUndirty.bind(this);
  }

  setUndirty(updateValueState = true) {
    const newState: any = {
      modified: false,
      pending: false
    };
    if (updateValueState) {
      newState.valueState = this.props.value;
    }

    this.setState(newState);
  }

  updateValueState(evt: ChangeEvent<HTMLInputElement>) {
    this.setState({
      valueState: evt.target.value,
      modified: evt.target.value != this.props.value
    });
  }

  triggerEventWhenBlur() {
    if (this.state.modified) {
      this.setState({
        pending: true
      });
      this.props.onChange({
        name: this.props.name,
        value: this.state.valueState
      });
    }
  }

  render() {
    const classNames = ["input"];
    if (this.state.modified && !this.state.pending)
      classNames.push("is-warning");
    if (this.props.small) classNames.push("is-small");
    return this.state.pending ? (
      <input
        type="text"
        className={classNames.join(" ")}
        disabled
        readOnly
        value="(서버 저장중)"
        style={this.props.style}
      ></input>
    ) : (
      <input
        type="text"
        className={classNames.join(" ")}
        disabled={this.props.disabled}
        name={this.props.name}
        onChange={this.updateValueState}
        value={this.state.valueState}
        onBlur={this.triggerEventWhenBlur}
        style={this.props.style}
      />
    );
  }
}
