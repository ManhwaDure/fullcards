import express from "express";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import {
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Request,
  Route,
  Security,
  SuccessResponse,
  UploadedFile
} from "tsoa";
import ApiExposableError from "../ApiExposableError";
import apiResponseTransformer from "../CardApiResponseSafetyTransformer";
import { Image } from "../CardTypes";
import { ImageService } from "../services/ImageService";

const imagesDir = path.join(process.cwd(), "data/images");
if (!existsSync(imagesDir))
  mkdirSync(imagesDir, {
    recursive: true,
    mode: 0o700
  });

@Route("images")
export class ImageController extends Controller {
  private imageService: ImageService;

  constructor() {
    super();
    this.imageService = new ImageService();
  }

  /**
   * Gets everys image infos
   */
  @Get()
  async getImages(): Promise<Image[]> {
    const images = await this.imageService.getImages();

    return images.map(apiResponseTransformer.transformImage);
  }

  /**
   * Gets image file
   * @param id image id
   */
  @Get("{id}")
  async getImageFile(
    @Path() id: string,
    @Request() req: express.Request
  ): Promise<void> {
    const { mimeType, readStream } = await this.imageService.getImageFile(id);

    req.res.type(mimeType);
    return new Promise((resolve, reject) => {
      readStream.on("error", err => {
        reject(err);
      });
      readStream.on("end", () => {
        readStream.close();
        req.res.status(200);
        req.res.end();
        resolve();
      });
      readStream.pipe(req.res);
    });
  }

  /**
   * Gets a image info
   * @param id image id
   */
  @Get("{id}/info")
  async getImageInfo(@Path() id): Promise<Image> {
    const info = await this.imageService.getImageInfo(id);

    if (info === null) throw new ApiExposableError(404, "Image not found");
    return apiResponseTransformer.transformImage(info);
  }

  /**
   * Deletes a image info
   * @param id image id
   */
  @Delete("{id}")
  @Security("jwt")
  @SuccessResponse(204, "No Content")
  async deleteImage(@Path() id): Promise<void> {
    await this.imageService.deleteImage(id);

    this.setStatus(204);
  }

  /**
   * Uploads a image
   * @param file Uploaded image
   */
  @Post()
  @Security("jwt")
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<Image> {
    const image = await this.imageService.uploadImage(file);

    return apiResponseTransformer.transformImage(image);
  }
}
