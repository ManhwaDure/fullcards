import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, Component } from "react";
import ImageUploader from "../../imageUploader";
import { CardSectionJsonData } from "../../pages/types.d";
import HelpText from "../helpText";

type propsType = {
  background: CardSectionJsonData["background"];
  onChange: (newBackground: propsType["background"]) => void;
  imageUploader: ImageUploader;
};
type stateType = {
  filename: string;
  uploading: boolean;
  previousImageId: string;
};

export default class CardBackgroundEditor extends Component<
  propsType,
  stateType
> {
  constructor(props) {
    super(props);
    this.handleInputEvent = this.handleInputEvent.bind(this);
    this.fetchBackgroundData = this.fetchBackgroundData.bind(this);
    this.state = {
      filename: null,
      uploading: false,
      previousImageId: null,
    };
  }
  async fetchBackgroundData(imageId) {
    if (imageId)
      this.props.imageUploader.getInfoById(imageId).then((info) => {
        this.setState({
          filename: info.filename,
          previousImageId: imageId,
        });
      });
  }
  async componentDidMount() {
    await this.fetchBackgroundData(this.props.background.image);
  }
  async componentDidUpdate() {
    if (this.state.previousImageId !== this.props.background.image)
      await this.fetchBackgroundData(this.props.background.image);
  }
  async handleInputEvent(evt: ChangeEvent<HTMLInputElement>) {
    const newBackground = this.props.background;
    switch (evt.target.name) {
      case "image": {
        this.setState({
          uploading: true,
        });
        if (evt.target.files.length !== 1) break;
        if (newBackground.image !== null) {
          await this.props.imageUploader.deleteImage(
            this.props.background.image
          );
        }
        const result = await this.props.imageUploader.uploadImage(
          evt.target.files[0]
        );
        newBackground.image = result.id;
        this.setState({
          uploading: false,
        });
        break;
      }
      case "defaultGradient": {
        newBackground.defaultGradient = evt.target.checked;
        break;
      }
      case "backgroundPosition": {
        newBackground.style.backgroundPosition = evt.target.value;
        break;
      }
      case "pseudoParallaxScrollingAnimation": {
        newBackground.pseudoParallaxScrollingAnimation = evt.target.checked;
        break;
      }
      case "pseudoParallaxScrollingAnimationDuration": {
        const duration = Number(evt.target.value);
        if (isFinite(duration) && !isNaN(duration))
          newBackground.pseudoParallaxScrollingAnimationDuration = Number(
            evt.target.value
          );
        break;
      }
      default:
        return;
    }
    this.props.onChange(newBackground);
  }
  render() {
    return (
      <div>
        <div className="field">
          <label className="label">배경 이미지</label>
          <div className="control">
            <div className="file has-name">
              <label className="file-label">
                <input
                  type="file"
                  className="file-input"
                  name="image"
                  onChange={this.handleInputEvent}
                  accept="image/*"
                  disabled={this.state.uploading}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <FontAwesomeIcon icon={faUpload} />
                  </span>
                  <span className="file-label">
                    {this.state.uploading
                      ? "(업로드중)"
                      : this.props.background.image === null
                      ? "배경이미지 업로드"
                      : "배경이미지 변경"}
                  </span>
                </span>
                <span className="file-name">
                  {this.props.background.image !== null
                    ? this.state.filename || "(정보 불러오는 중)"
                    : "(이미지 없음)"}
                </span>
              </label>
            </div>
          </div>
          <p className="help">
            참고 : 모바일을 고려해 낮은 용량의 이미지(보통 640x320 정도의
            해상도면 괜찮음)를 올릴 것을&nbsp;
            <strong>매우 강력하게 권장합니다.</strong>
          </p>
        </div>
        <div className="field">
          <label htmlFor="" className="label">
            배경 위치
          </label>
          <HelpText>
            모바일과 같이 화면 크기가 작은 기기에서는 당연히 배경의 일부분만이
            보일 수 밖에 없습니다. 이때 배경의 어느 부분을 표시할 지를 별도로
            지정하지 않으면, 브라우저에서 자동으로 결정하게 되는데 이로 인해
            배경이 의도한대로 표시되지 않을 수 있습니다.
            <br />
            간단한 예시를 들어, 학교를 배경으로 오른쪽에 있는 사람에 포커스를
            맞춘 사진이 배경이라고 가정합시다. 컴퓨터는 화면이 큼직하기 때문에
            의도한대로 보입니다. 하지만 모바일에서는 너비가 좁아 일부분이 어쩔
            수 없이 잘리게 되는데, 이때 사람이 있는 부분이 잘린다면 배경이
            의도한대로 표시된다고 볼 수 없겠죠?
            <br />
            <code>25% 50%</code>와 같은 식으로 입력 후 창 크기를 조절하며
            확인해보세요.
          </HelpText>
          <div className="control">
            <input
              type="text"
              className="input"
              name="backgroundPosition"
              value={
                (this.props.background.style || {}).backgroundPosition || ""
              }
              onChange={this.handleInputEvent}
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <label htmlFor="" className="checkbox">
              <input
                type="checkbox"
                name="defaultGradient"
                checked={this.props.background.defaultGradient}
                onChange={this.handleInputEvent}
              />
              &nbsp;기본 그라디언트 적용
            </label>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <label htmlFor="" className="checkbox">
              <input
                type="checkbox"
                name="pseudoParallaxScrollingAnimation"
                checked={this.props.background.pseudoParallaxScrollingAnimation}
                onChange={this.handleInputEvent}
              />
              &nbsp;이미지를 좌우로 천천히 흝는 애니메이션 적용 (애니메이션이 한
              번 도는 데 걸리는 시간 :&nbsp;
              <input
                type="number"
                name="pseudoParallaxScrollingAnimationDuration"
                value={
                  this.props.background.pseudoParallaxScrollingAnimationDuration
                }
                placeholder="기본값 : 240"
                onChange={this.handleInputEvent}
              ></input>
              초)
            </label>
          </div>
        </div>
      </div>
    );
  }
}
