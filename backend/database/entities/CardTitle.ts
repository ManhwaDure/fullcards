import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { CardSectionTitlePosition } from "../../../src/CardSectionTitlePosition";
import { Card } from "./Card";
import { CardRelated } from "./CardRelated";

@Entity()
export class CardTitle extends CardRelated {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  parentId?: string;

  @OneToOne(
    () => Card,
    section => section.title,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({
    name: "parentId"
  })
  parent: Card;

  @Column({
    type: "varchar",
    length: 10000
  })
  content: string;

  @Column({
    type: "enum",
    enum: ["center", "bottomLeft", "bottomRight", "topLeft", "topRight"],
    default: "topRight"
  })
  position: CardSectionTitlePosition;
}
