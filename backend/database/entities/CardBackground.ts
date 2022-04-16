import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Card } from "./Card";
import { CardRelated } from "./CardRelated";
import { Image } from "./Image";

@Entity()
export class CardBackground extends CardRelated {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  parentId?: string;

  @Column({ nullable: true })
  imageId?: string;

  @OneToOne(
    () => Card,
    card => card.background,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "parentId" })
  parent: Card;

  @ManyToOne(
    () => Image,
    image => image.id,
    { eager: true }
  )
  @JoinColumn({ name: "imageId" })
  image: Image;

  @Column({ default: "{}", type: "simple-json" })
  css: { [key: string]: string };

  @Column()
  defaultGradient: boolean;

  @Column()
  pseudoParallaxScrollingAnimation: boolean;

  @Column({ default: 220 })
  pseudoParallaxScrollingAnimationDuration: number;
}
