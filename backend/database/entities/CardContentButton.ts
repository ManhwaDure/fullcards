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

@Entity()
@Unique("Alwayas_ordered", ["order", "parent"])
export class CardContentButton extends CardRelated {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  content: string;

  @Column()
  order: number;

  @Column({
    type: "enum",
    enum: ["gallery", "anchor"]
  })
  type: CardContentButtonHrefTypes;

  @Column()
  href: string;

  @OneToMany(
    () => CardGalleryImage,
    image => image.parent,
    { eager: true, onDelete: "CASCADE" }
  )
  galleryImages: CardGalleryImage[];

  @ManyToOne(
    () => CardContent,
    content => content.buttons,
    { onDelete: "CASCADE", eager: false }
  )
  @JoinColumn({
    name: "parentId"
  })
  parent: CardContent;

  @Column()
  parentId?: string;
}
