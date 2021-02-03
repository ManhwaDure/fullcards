import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, Component, RefObject } from "react";
import ImageUploader, { ImageUploadResult } from "../../imageUploader";

type propsType = {
  images: string[];
  onChange: (newImages: string[]) => void;
  onClose: () => void;
  active: boolean;
  imageUploader: ImageUploader;
};
type stateType = {
  loading: boolean;
  imageInfos: ImageUploadResult[];
  active: boolean;
  uploading: boolean;
};
export default class GalleryEditorModal extends Component<
  propsType,
  stateType
> {
  _fileRef: RefObject<HTMLInputElement> = null;
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      loading: true,
      uploading: false,
      imageInfos: [],
    };
    this._fileRef = React.createRef();
    this.uploadNewImage = this.uploadNewImage.bind(this);
    this.onImageSelected = this.onImageSelected.bind(this);
    this.reorderImage = this.reorderImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    await this.fetchImageInfos();
  }

  async componentDidUpdate(prevProps) {
    if (
      !this.state.loading &&
      (this.props.images.length !== this.state.imageInfos.length ||
        !this.props.images.every((v, i) => this.state.imageInfos[i].id === v))
    ) {
      await this.fetchImageInfos();
    }
  }

  async fetchImageInfos() {
    this.setState({
      loading: true,
    });
    const imageInfos = [];
    for (const i of this.props.images) {
      imageInfos.push(await this.props.imageUploader.getInfoById(i));
    }
    this.setState({
      imageInfos,
      loading: false,
    });
  }

  uploadNewImage() {
    this._fileRef.current.click();
  }

  async onImageSelected(evt: ChangeEvent<HTMLInputElement>) {
    if (evt.target.files.length === 0) return alert("선택된 파일이 없습니다.");
    const file = evt.target.files[0];
    this.setState({ uploading: true });
    const info = await this.props.imageUploader.uploadImage(file);
    this.setState({ uploading: false });
    const newImages = this.props.images;
    newImages.push(info.id);
    this.props.onChange(newImages);
  }

  reorderImage(index: number, difference: number) {
    return () => {
      const images = this.props.images;
      const image = images.splice(index, 1)[0];
      images.splice(index + difference, 0, image);
      this.props.onChange(images);
    };
  }

  deleteImage(index: number) {
    return async () => {
      const images = this.props.images;
      const deleted = images.splice(index, 1)[0];
      await this.props.imageUploader.deleteImage(deleted);
      this.props.onChange(images);
    };
  }

  render() {
    return (
      <div className={this.props.active ? "modal is-active" : "modal"}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="card">
            <div className="card-content">
              <table className="table is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th>파일 이름</th>
                    <th>미리보기</th>
                    <th>동작</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.loading ? (
                    <tr>
                      <td colSpan={3} className="has-text-centered">
                        이미지 정보를 불러오고 있습니다.
                      </td>
                    </tr>
                  ) : (
                    this.state.imageInfos.map((image, index, imageInfos) => (
                      <tr>
                        <td>{image.filename}</td>
                        <td>
                          <a href={image.url} target="_blank">
                            미리보기(새 창에서 열림)
                          </a>
                        </td>
                        <td>
                          <button
                            className="button is-small"
                            onClick={this.reorderImage(index, -1)}
                            disabled={index === 0}
                          >
                            <FontAwesomeIcon icon={faAngleUp}></FontAwesomeIcon>
                          </button>
                          <button
                            className="button is-small"
                            onClick={this.reorderImage(index, 1)}
                            disabled={index === imageInfos.length - 1}
                          >
                            <FontAwesomeIcon
                              icon={faAngleDown}
                            ></FontAwesomeIcon>
                          </button>
                          <button
                            className="button is-danger is-small"
                            onClick={this.deleteImage(index)}
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <p className="buttons">
                <button
                  className="button"
                  onClick={this.uploadNewImage}
                  disabled={this.state.loading || this.state.uploading}
                >
                  {this.state.uploading ? "업로드중" : "이미지 추가"}
                </button>
              </p>
            </div>
          </div>
        </div>
        <input
          type="file"
          style={{ display: "none" }}
          id="newImage"
          onChange={this.onImageSelected}
          ref={this._fileRef}
        />
        <button
          className="modal-close is-large"
          onClick={this.props.onClose}
        ></button>
      </div>
    );
  }
}
