import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEventHandler } from "react";

type propsType = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  buttonText: string;
  filename: string;
  accept?: string;
  name?: string;
};
export function FileUploadControl({
  onChange,
  disabled = false,
  buttonText,
  accept = "*/*",
  filename,
  name
}: propsType) {
  return (
    <div className="control">
      <div className="file has-name">
        <label className="file-label">
          <input
            type="file"
            className="file-input"
            name={name}
            onChange={onChange}
            accept={accept}
            disabled={disabled}
          />
          <span className="file-cta">
            <span className="file-icon">
              <FontAwesomeIcon icon={faUpload} />
            </span>
            <span className="file-label">{buttonText}</span>
          </span>
          <span className="file-name">{filename}</span>
        </label>
      </div>
    </div>
  );
}
