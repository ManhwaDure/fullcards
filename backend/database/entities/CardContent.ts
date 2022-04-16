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

@Entity()
export class CardContent extends CardRelated {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  parentId?: string;

  @Column({
    type: "varchar",
    length: 10000
  })
  content: string;

  @Column({ default: false })
  withScrollDownText: boolean;

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
