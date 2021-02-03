import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, Component } from "react";
import ImageUploader from "../../imageUploader";
import { CardSectionJsonData } from "../../pages/types.d";
import GalleryEditorModal from "./galleryEditorModal";

type propsType = {
  buttons: CardSectionJsonData["content"]["buttons"];
  onChange: (newButtonList: propsType["buttons"]) => void;
  imageUploader: ImageUploader;
};
type stateType = {
  currentlyActiveGallery: number;
};
export default class CardContentButtonEditor extends Component<
  propsType,
  stateType
> {
  constructor(props) {
    super(props);
    this.state = {
      currentlyActiveGallery: null,
    };
    this.createNewButton = this.createNewButton.bind(this);
    this.updateButton = this.updateButton.bind(this);
    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.handleButtonReorder = this.handleButtonReorder.bind(this);
    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.handleGalleryCloseEvent = this.handleGalleryCloseEvent.bind(this);
    this.handleGalleryEvent = this.handleGalleryEvent.bind(this);
    this.openGallery = this.openGallery.bind(this);
  }
  createNewButton() {
    const newButtonList = this.props.buttons;
    newButtonList.push({
      content: "새 버튼",
      href: "https://apply.caumd.club",
      hrefType: "anchor",
      galleryImages: [],
    });
    this.props.onChange(newButtonList);
  }
  updateButton(index: number, newAttrs: Partial<propsType["buttons"][number]>) {
    const newButtons = this.props.buttons;
    Object.assign(newButtons[index], newAttrs);
    this.props.onChange(newButtons);
  }
  handleChangeEvent(index: number) {
    return (evt: ChangeEvent<HTMLInputElement>) => {
      switch (evt.target.name) {
        case "content":
          this.updateButton(index, {
            content: evt.target.value,
          });
          break;
        case "openLink":
          if (evt.target.checked)
            this.updateButton(index, {
              hrefType: "anchor",
            });
          break;
        case "openGallery":
          if (evt.target.checked)
            this.updateButton(index, {
              hrefType: "gallery",
            });
          break;
        case "href":
          this.updateButton(index, {
            href: evt.target.value,
          });
          break;
      }
    };
  }
  async handleDeleteButton(index: number) {
    const newButtons = this.props.buttons;
    const buttonDeleted = newButtons.splice(index, 1)[0];
    const imageDeletePromises = buttonDeleted.galleryImages.map((i) =>
      this.props.imageUploader.deleteImage(i)
    );
    await Promise.all(imageDeletePromises);
    this.props.onChange(newButtons);
  }
  handleButtonReorder(index: number, difference: number) {
    const newButtons = this.props.buttons;
    const button = newButtons.splice(index, 1)[0];
    newButtons.splice(index + difference, 0, button);
    this.props.onChange(newButtons);
  }
  handleGalleryEvent(index: number) {
    return (newImageList: string[]) => {
      const newButtons = this.props.buttons;
      newButtons[index].galleryImages = newImageList;
      this.props.onChange(newButtons);
    };
  }
  handleGalleryCloseEvent(index: number) {
    return () => {
      this.setState({
        currentlyActiveGallery: null,
      });
    };
  }
  openGallery(index: number) {
    this.setState({
      currentlyActiveGallery: index,
    });
  }
  render() {
    return (
      <div>
        {this.props.buttons.length === 0 ? (
          <p>
            버튼이 없습니다. 아래 "버튼 생성" 버튼을 눌러 버튼을 만들 수
            있습니다.
          </p>
        ) : (
          this.props.buttons.map((button, index, buttons) => (
            <div className="card">
              <div className="card-content">
                <div className="field">
                  <label htmlFor="" className="label">
                    하단 버튼 텍스트
                  </label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      name="content"
                      value={button.content}
                      onChange={this.handleChangeEvent(index)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="" className="label">
                    하단 버튼 클릭시 행동
                  </label>
                  <div className="control">
                    <form
                      onSubmit={(evt) => {
                        evt.preventDefault();
                      }}
                    >
                      <label className="radio">
                        <input
                          type="radio"
                          name="openGallery"
                          checked={button.hrefType === "gallery"}
                          onChange={this.handleChangeEvent(index)}
                        />
                        &nbsp; 갤러리 표시 (
                        <a href="#" onClick={() => this.openGallery(index)}>
                          여기
                        </a>
                        를 눌러 갤러리 수정)
                      </label>
                      <label className="radio">
                        <input
                          type="radio"
                          name="openLink"
                          checked={button.hrefType === "anchor"}
                          onChange={this.handleChangeEvent(index)}
                        />
                        &nbsp; 링크 열기 (링크 대상 :&nbsp;
                        <input
                          type="text"
                          name="href"
                          value={button.href}
                          disabled={button.hrefType !== "anchor"}
                          onChange={this.handleChangeEvent(index)}
                        />
                        )
                      </label>
                    </form>
                  </div>
                </div>
                <div className="field is-grouped">
                  <div className="control">
                    <div className="field has-addons">
                      <div className="control">
                        <button
                          className="button"
                          disabled={index === 0}
                          onClick={() => this.handleButtonReorder(index, -1)}
                        >
                          <FontAwesomeIcon icon={faAngleUp}></FontAwesomeIcon>
                        </button>
                      </div>
                      <div className="control">
                        <button
                          className="button"
                          disabled={index === buttons.length - 1}
                          onClick={() => this.handleButtonReorder(index, 1)}
                        >
                          <FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="control">
                    <button
                      className="button is-danger"
                      onClick={() => this.handleDeleteButton(index)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <GalleryEditorModal
                  images={button.galleryImages}
                  active={this.state.currentlyActiveGallery === index}
                  onClose={this.handleGalleryCloseEvent(index)}
                  onChange={this.handleGalleryEvent(index)}
                  imageUploader={this.props.imageUploader}
                />
              </div>
            </div>
          ))
        )}
        <div className="field">
          <div className="control">
            <button className="button" onClick={this.createNewButton}>
              버튼 생성
            </button>
          </div>
        </div>
      </div>
    );
  }
}
