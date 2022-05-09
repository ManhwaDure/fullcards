import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Card } from "./Card";
import { CardContentButton } from "./CardContentButton";
import { CardRelated } from "./CardRelated";

/**
 * Content of the {@link Card | card}
 */
@Entity()
export class CardContent extends CardRelated {
  /**
   * Unique entitiy id in uuid format
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * Id of the parent card entity
   */
  @Column({ nullable: true })
  parentId?: string;

  /**
   * Content in HTML
   */
  @Column({
    type: "text"
  })
  content: string;

  /**
   * Whether to display "Scroll down" text on the bottom of the content
   */
  @Column({ default: false })
  withScrollDownText: boolean;

  /**
   * Buttons on bottom of the content
   * This property could be none.
   */
  @OneToMany(
    () => CardContentButton,
    button => button.parent,
    {
      nullable: true,
      eager: true,
      onDelete: "CASCADE"
    }
  )
  buttons: CardContentButton[];

  /**
   * Parent card entitiy
   * This property uses `parentId` as foregin key
   */
  @OneToOne(
    () => Card,
    card => card.content,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({
    name: "parentId"
  })
  parent: Card;
}
