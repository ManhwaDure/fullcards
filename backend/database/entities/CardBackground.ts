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

/**
 * Background entity of the {@link Card | Card entity}.
 */
@Entity()
export class CardBackground extends CardRelated {
  /**
   * Unqiue entitiy id in uuid
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * Id of the parent {@link Card | card entity}
   */
  @Column({ nullable: true })
  parentId?: string;

  /**
   * Id of the background {@link Image | image entity} if set
   */
  @Column({ nullable: true })
  imageId?: string;

  /**
   * Parent {@link Card | card entity}
   * This ues `parentId` property of the entity as foregin key
   */
  @OneToOne(
    () => Card,
    card => card.background,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "parentId" })
  parent: Card;

  /**
   * Background {@link Image | image} of the background
   * This uses `imageId` property of the entity as foregin key
   */
  @ManyToOne(
    () => Image,
    image => image.id,
    { eager: true }
  )
  @JoinColumn({ name: "imageId" })
  image: Image;

  /**
   * CSS for this background, in object type
   * @default {}
   */
  @Column({ default: "{}", type: "simple-json" })
  css: { [key: string]: string };

  /**
   * Whether simple dark-colored translucent gradient is applied over the background image
   */
  @Column()
  defaultGradient: boolean;

  /**
   * Whether parallax-scrolling animation is applied for the background image
   * This is useful when image is horizontally long
   */
  @Column()
  pseudoParallaxScrollingAnimation: boolean;

  /**
   * Duration of the parallax-scrolling animation
   */
  @Column({ default: 220 })
  pseudoParallaxScrollingAnimationDuration: number;
}
