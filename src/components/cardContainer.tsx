import styles from "../../styles/CardContainer.module.scss";

export default function CardContainer(props) {
  return <div className={styles.container}>{props.children}</div>;
}
