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

/**
 * Fullsize card entitiy
 */
@Entity()
export class Card extends CardRelated {
  /**
   * Card id in uuid
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * Card order
   */
  @Column({
    unique: true
  })
  order: number;

  /**
   * Card title
   */
  @OneToOne(() => CardTitle, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  title: CardTitle;

  /**
   * Card content
   */
  @OneToOne(() => CardContent, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  content: CardContent;

  /**
   * Card background
   */
  @OneToOne(() => CardBackground, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  background: CardBackground;
}
