import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CardBackground } from "./CardBackground";
import { CardGalleryImage } from "./CardGalleryImage";

@Entity()
export class Image {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  filename: string;

  @Column()
  filenameOnServer: string;

  @Column()
  filesize: number;

  @Column()
  mimetype: string;

  @OneToMany(
    () => CardBackground,
    background => background.image
  )
  backgrounds: CardBackground[];

  @OneToMany(
    () => CardGalleryImage,
    galleryImage => galleryImage.image
  )
  galleryImages: CardGalleryImage[];
}
