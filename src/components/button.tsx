import { MouseEvent, ReactNode } from "react";
import styles from "../../styles/Button.module.scss";

type PropType = {
  href?: string;
  onClick?: (evt?: MouseEvent<HTMLAnchorElement>) => void;
  children?: ReactNode;
};
export default function Button(props: PropType) {
  return (
    <a href={props.href || "#"} onClick={props.onClick}>
      <button className={styles.button}>{props.children}</button>
    </a>
  );
}
