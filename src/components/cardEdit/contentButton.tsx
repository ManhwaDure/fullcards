import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, Component } from "react";
import {
  CardContentButton,
  CardContentButtonHrefTypes,
  CardWithDetails
} from "../../apiClient";
import ImageUploader from "../../imageUploader";
import BufferedInput from "../bufferedInput";
import GalleryEditorModal from "./galleryEditorModal";

type propsType = {
  buttons: CardWithDetails["content"]["buttons"];
  imageUploader: ImageUploader;
} & CardContentButtonEditorEventHandlers;
type stateType = {
  currentlyActiveGallery: number;
};
export type CardContentButtonEditorEventHandlers = {
  onChange: (newButton: CardContentButton) => void;
  onDelete: (buttonId: string) => void;
  onCreate: () => void;
  onSwap: (firstId: string, secondId: string) => void;
  onGalleryChange: (buttonId: string, newImageIds: string[]) => void;
};
export default class CardContentButtonEditor extends Component<
  propsType,
  stateType
> {
  constructor(props) {
    super(props);
    this.state = {
      currentlyActiveGallery: null
    };
    this.createNewButton = this.createNewButton.bind(this);
    this.updateButton = this.updateButton.bind(this);
    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.handleBufferedInputEvent = this.handleBufferedInputEvent.bind(this);
    this.handleButtonReorder = this.handleButtonReorder.bind(this);
    this.handleGalleryCloseEvent = this.handleGalleryCloseEvent.bind(this);
    this.handleGalleryEvent = this.handleGalleryEvent.bind(this);
    this.openGallery = this.openGallery.bind(this);
  }
  createNewButton() {
    this.props.onCreate();
  }
  updateButton(index: number, newAttrs: Partial<CardContentButton>) {
    const newButton = this.props.buttons[index];
    Object.assign(newButton, newAttrs);
    this.props.onChange(newButton);
  }
  handleChangeEvent(index: number) {
    return (evt: ChangeEvent<HTMLInputElement>) => {
      switch (evt.target.name) {
        case "openLink":
          if (evt.target.checked)
            this.updateButton(index, {
              type: CardContentButtonHrefTypes.ANCHOR
            });
          break;
        case "openGallery":
          if (evt.target.checked)
            this.updateButton(index, {
              type: CardContentButtonHrefTypes.GALLERY
            });
          break;
      }
    };
  }
  handleBufferedInputEvent(index: number) {
    return ({ value, name }: { value: string; name: string }) => {
      switch (name) {
        case "content":
          this.updateButton(index, {
            content: value
          });
          break;
        case "href":
          this.updateButton(index, {
            href: value
          });
          break;
      }
    };
  }
  async handleDeleteButton(index: number) {
    this.props.onDelete(this.props.buttons[index].id);
  }
  handleButtonReorder(index: number, difference: number) {
    const id = this.props.buttons[index].id,
      secondId = this.props.buttons[index + difference].id;
    this.props.onSwap(id, secondId);
  }
  handleGalleryEvent(index: number) {
    return (newImageList: string[]) => {
      const { id } = this.props.buttons[index];
      this.props.onGalleryChange(id, newImageList);
    };
  }
  handleGalleryCloseEvent(index: number) {
    return () => {
      this.setState({
        currentlyActiveGallery: null
      });
    };
  }
  openGallery(index: number) {
    this.setState({
      currentlyActiveGallery: index
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
            <div className="card" key={button.id}>
              <div className="card-content">
                <div className="field">
                  <label htmlFor="" className="label">
                    하단 버튼 텍스트
                  </label>
                  <div className="control">
                    <BufferedInput
                      name="content"
                      value={button.content}
                      onChange={this.handleBufferedInputEvent(index)}
                      key={button.content}
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="" className="label">
                    하단 버튼 클릭시 행동
                  </label>
                  <div className="control">
                    <form
                      onSubmit={evt => {
                        evt.preventDefault();
                      }}
                    >
                      <label className="radio">
                        <input
                          type="radio"
                          name="openGallery"
                          checked={
                            button.type === CardContentButtonHrefTypes.GALLERY
                          }
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
                          checked={
                            button.type === CardContentButtonHrefTypes.ANCHOR
                          }
                          onChange={this.handleChangeEvent(index)}
                        />
                        &nbsp; 링크 열기 (링크 대상 :&nbsp;
                        <BufferedInput
                          name="href"
                          value={button.href}
                          small
                          style={{ width: "230px" }}
                          disabled={
                            button.type !== CardContentButtonHrefTypes.ANCHOR
                          }
                          onChange={this.handleBufferedInputEvent(index)}
                          key={button.href}
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
                  images={button.galleryImages.map(i => i.image.id)}
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
