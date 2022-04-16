import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { CardBackground } from "./CardBackground";
import { CardContent } from "./CardContent";
import { CardRelated } from "./CardRelated";
import { CardTitle } from "./CardTitle";

@Entity()
export class Card extends CardRelated {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    unique: true
  })
  order: number;

  @OneToOne(() => CardTitle, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  title: CardTitle;

  @OneToOne(() => CardContent, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  content: CardContent;

  @OneToOne(() => CardBackground, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  background: CardBackground;
}
