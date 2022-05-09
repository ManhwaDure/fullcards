import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CardBackground } from "./CardBackground";
import { CardGalleryImage } from "./CardGalleryImage";

/**
 * Uploaded image
 */
@Entity()
export class Image {
  /**
   * Unique id in uuid format
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * filename for users on frontend
   */
  @Column()
  filename: string;

  /**
   * filename stored on server
   */
  @Column()
  filenameOnServer: string;

  /**
   * filesize
   */
  @Column()
  filesize: number;

  /**
   * Mime type
   */
  @Column()
  mimetype: string;

  /**
   * Backgrounds which used this image
   */
  @OneToMany(
    () => CardBackground,
    background => background.image
  )
  backgrounds: CardBackground[];

  /**
   * Card button gallery image entities which used this image
   */
  @OneToMany(
    () => CardGalleryImage,
    galleryImage => galleryImage.image
  )
  galleryImages: CardGalleryImage[];
}
