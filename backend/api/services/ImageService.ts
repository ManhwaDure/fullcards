import cuid from "cuid";
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  promises as fs,
  ReadStream
} from "fs";
import mimeTypes from "mime-types";
import path from "path";
import internal from "stream";
import dataSource from "../../database/dataSource";
import * as models from "../../database/entities";
import ApiExposableError from "../ApiExposableError";

const imagesDir = path.join(process.cwd(), "data/images");
if (!existsSync(imagesDir))
  mkdirSync(imagesDir, {
    recursive: true,
    mode: 0o700
  });

export class ImageService {
  /**
   * Gets everys image infos
   */
  async getImages(): Promise<models.Image[]> {
    const { manager } = dataSource;
    const images = await manager.find(models.Image);

    return images;
  }

  getImageDir() {
    return imagesDir;
  }

  /**
   * Gets image file
   * @param id image id
   */
  async getImageFile(
    id: string
  ): Promise<{ mimeType: string; readStream: ReadStream }> {
    const { manager } = dataSource;
    const image = await manager.findOneBy(models.Image, {
      id
    });

    if (image === null) throw new ApiExposableError(404, "Image not found");

    const filestream = createReadStream(
      path.join(imagesDir, image.filenameOnServer)
    );
    return {
      mimeType: image.mimetype,
      readStream: filestream
    };
  }

  /**
   * Gets a image info
   * @param id image id
   */
  async getImageInfo(id): Promise<models.Image> {
    const { manager } = dataSource;
    const image = await manager.findOneBy(models.Image, {
      id
    });

    return image;
  }

  /**
   * Deletes a image info
   * @param id image id
   */
  async deleteImage(id): Promise<void> {
    const { manager } = dataSource;
    const image = await manager.findOneBy(models.Image, {
      id
    });

    if (image === null) throw new ApiExposableError(404, "Image not found");
    await fs.rm(path.join(imagesDir, image.filenameOnServer));
  }

  getMimeType(filename: string): string {
    return mimeTypes.lookup(filename) || "";
  }

  isImage(filename: string): boolean {
    return this.getMimeType(filename).startsWith("image/");
  }

  /**
   * Uploads a image
   * @param file Uploaded image
   */
  async uploadImage(file: {
    originalname: string;
    buffer?: Buffer;
    stream?: internal.Readable;
    path?: string;
    size: number;
  }): Promise<models.Image> {
    // Use mime-type from file extension, not provided one from user
    if (!this.isImage(file.originalname))
      throw new ApiExposableError(400, "Not a image file");

    const filenameOnServer = cuid() + path.extname(file.originalname);
    const filePathOnServer = path.join(imagesDir, filenameOnServer);
    if (file.buffer) await fs.writeFile(filePathOnServer, file.buffer);
    else if (file.path) await fs.copyFile(file.path, filePathOnServer);
    else if (file.stream) {
      const fileStream = createWriteStream(filePathOnServer);
      file.stream.pipe(fileStream);
      await new Promise((resolve, reject) =>
        file.stream.on("end", resolve).on("error", reject)
      );
    }
    let image = new models.Image();
    image.filename = file.originalname;
    image.filenameOnServer = filenameOnServer;
    image.filesize = file.size;
    image.mimetype = this.getMimeType(file.originalname);

    return await dataSource.manager.save(image);
  }
}
