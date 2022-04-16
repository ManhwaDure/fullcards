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

@Entity()
@Unique("Alwayas_ordered", ["order", "parent"])
export class CardGalleryImage extends CardRelated {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  imageId?: string;

  @Column({ nullable: true })
  parentId?: string;

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

  @Column()
  order: number;

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
