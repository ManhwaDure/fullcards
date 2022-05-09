import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { CardContentButton } from "./CardContentButton";
import { CardRelated } from "./CardRelated";
import { Image } from "./Image";

/**
 * Image in the gallery of the {@link CardContentButton | button on bottom of the card content}
 */
@Entity()
@Unique("Alwayas_ordered", ["order", "parent"])
export class CardGalleryImage extends CardRelated {
  /**
   * Unique id in uuid format
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * Forgein key used for `image` property
   */
  @Column({ nullable: true })
  imageId?: string;

  /**
   * Forgein key used for `parent` property
   */
  @Column({ nullable: true })
  parentId?: string;

  /**
   * Uploaded image for this entity
   */
  @ManyToOne(
    () => Image,
    image => image.id,
    {
      eager: true
    }
  )
  @JoinColumn({
    name: "imageId"
  })
  image: Image;

  /**
   * Image order in the gallery
   *
   * @remarks
   * Note that no same order in the gallery is allowed
   */
  @Column()
  order: number;

  /**
   * Parent card button
   */
  @ManyToOne(
    () => CardContentButton,
    button => button.galleryImages,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({
    name: "parentId"
  })
  parent: CardContentButton;
}
