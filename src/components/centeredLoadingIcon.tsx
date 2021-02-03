import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/CenteredLoadingIcon.module.scss";

export default function CenteredLoading() {
  return (
    <div className={styles.centeredLoading}>
      <p className={styles.loadingIcon}>
        <FontAwesomeIcon icon={faCircleNotch} spin></FontAwesomeIcon>
      </p>
      <p>데이터를 불러오고 있습니다. 잠시만 기다려주세요...</p>
    </div>
  );
}
