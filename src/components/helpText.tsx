import {
  faQuestionCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component } from "react";
import styles from "../../styles/HelpText.module.scss";

export default class HelpText extends Component<{}, { active: boolean }> {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.toggleThis = this.toggleThis.bind(this);
  }
  toggleThis() {
    this.setState((state) => {
      return {
        active: !state.active,
      };
    });
  }
  render() {
    return (
      <div className={styles.helpText}>
        <a href="#" onClick={this.toggleThis} className={styles.questionIcon}>
          {this.state.active ? (
            <span>
              <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
            </span>
          ) : (
            <span>
              <FontAwesomeIcon icon={faQuestionCircle} /> 이게 뭔가요?
            </span>
          )}
        </a>
        <p style={{ display: this.state.active ? "" : "none" }}>
          {this.props.children}
        </p>
      </div>
    );
  }
}
