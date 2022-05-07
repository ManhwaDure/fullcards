import { ChangeEvent, Component, createRef, RefObject } from "react";
import { SiteSettingMap } from "../apiClient/models/SiteSettingMap";
import ImageUploader from "../imageUploader";
import BufferedInput from "./bufferedInput";
import { FileUploadControl } from "./fileUploadControl";

type propsType = {
  value: SiteSettingMap;
  onChange: (newSettings: SiteSettingMap) => void;
  imageUploader: ImageUploader;
};
type stateType = {
  faviconFilename: string;
  value: SiteSettingMap;
  uploading: boolean;
};
export default class SiteSettingEditor extends Component<propsType, stateType> {
  private sitenameRef: RefObject<BufferedInput>;
  private descriptionRef: RefObject<BufferedInput>;
  private authorRef: RefObject<BufferedInput>;

  constructor(props) {
    super(props);
    this.state = {
      faviconFilename: null,
      value: props.value,
      uploading: false
    };
    this.handleBufferedInput = this.handleBufferedInput.bind(this);
    this.handleFileInput = this.handleFileInput.bind(this);
    this.getFaviconFilename = this.getFaviconFilename.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    this.sitenameRef = createRef();
    this.descriptionRef = createRef();
    this.authorRef = createRef();
  }
  isEqualJsonObj(a: any, b: any) {
    return (
      Object.keys(a).length === Object.keys(b).length &&
      Object.keys(a).every(i => b[i] === a[i])
    );
  }
  componentDidMount() {
    this.getFaviconFilename();
  }
  async getFaviconFilename() {
    if (this.props.value.favicon) {
      const {
        filename: faviconFilename
      } = await this.props.imageUploader.getInfoById(this.props.value.favicon);
      this.setState({
        faviconFilename
      });
    }
  }
  handleBufferedInput({
    name,
    value
  }: {
    name: "sitename" | "description" | "author";
    value: string;
  }) {
    this.state.value[name] = value;
    this.props.onChange(this.state.value);
  }
  async handleFileInput(evt: ChangeEvent<HTMLInputElement>) {
    if (evt.target.files.length === 1) {
      const file = evt.target.files[0];
      const { id } = await this.props.imageUploader.uploadImage(file);

      this.state.value.favicon = id;
      this.props.onChange(this.state.value);
    }
  }
  render() {
    return (
      <div className="box">
        <h2 className="title is-4">사이트 설정</h2>
        <h3 className="subtitle is-6">
          사이트의 제목이나 설명 등을 설정합니다.
        </h3>
        <div className="field">
          <label htmlFor="" className="label">
            사이트 이름
          </label>
          <div className="control">
            <BufferedInput
              name="sitename"
              value={this.props.value.sitename}
              onChange={this.handleBufferedInput}
              ref={this.sitenameRef}
            ></BufferedInput>
          </div>
        </div>
        <div className="field">
          <label htmlFor="" className="label">
            사이트 설명
          </label>
          <div className="control">
            <BufferedInput
              name="description"
              value={this.props.value.description}
              onChange={this.handleBufferedInput}
              ref={this.descriptionRef}
            ></BufferedInput>
          </div>
        </div>
        <div className="field">
          <label htmlFor="" className="label">
            저자
          </label>
          <div className="control">
            <BufferedInput
              name="author"
              value={this.props.value.author}
              onChange={this.handleBufferedInput}
              ref={this.authorRef}
            ></BufferedInput>
          </div>
        </div>
        <div className="field">
          <label htmlFor="" className="label">
            파비콘(favicon)
          </label>
          <div className="control">
            <FileUploadControl
              accept="image/*"
              disabled={this.state.uploading}
              buttonText={
                this.state.uploading
                  ? "업로드중..."
                  : this.props.value.favicon
                  ? "파비콘 변경"
                  : "파비콘 업로드"
              }
              name="favicon"
              onChange={this.handleFileInput}
              filename={
                this.props.value.favicon
                  ? this.state.faviconFilename
                  : "(파비콘 없음)"
              }
            ></FileUploadControl>
            <p className="help">
              favicon은 주소창에 나타나는 아이콘을 의미합니다.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
