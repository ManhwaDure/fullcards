import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { CardContent } from "./CardContent";
import { CardGalleryImage } from "./CardGalleryImage";
import { CardRelated } from "./CardRelated";

export type CardContentButtonHrefTypes = "gallery" | "anchor";

/**
 * Buttons on bottom of the card content
 */
@Entity()
@Unique("Alwayas_ordered", ["order", "parent"])
export class CardContentButton extends CardRelated {
  /**
   * Unique id in uuid format
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * Button text
   */
  @Column()
  content: string;

  /**
   * Button order
   *
   * @remarks
   * Note that no same order in buttons of the card content is allowed
   */
  @Column()
  order: number;

  /**
   * Card button type, should be anchor(external link) or gallery(opens gallery)
   */
  @Column({
    type: "enum",
    enum: ["gallery", "anchor"]
  })
  type: CardContentButtonHrefTypes;

  /**
   * Button link target, useless when card type is `gallery`
   */
  @Column()
  href: string;

  /**
   * Images of the gallery attached to this button, useless when card type is `anchor`
   */
  @OneToMany(
    () => CardGalleryImage,
    image => image.parent,
    { eager: true, onDelete: "CASCADE" }
  )
  galleryImages: CardGalleryImage[];

  /**
   * Parent card content, not card
   */
  @ManyToOne(
    () => CardContent,
    content => content.buttons,
    { onDelete: "CASCADE", eager: false }
  )
  @JoinColumn({
    name: "parentId"
  })
  parent: CardContent;

  /**
   * Foregin key used for `parent` property
   */
  @Column()
  parentId?: string;
}
