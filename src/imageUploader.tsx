import { FullcardsApiClient } from "./apiClient";
import { getApiClient } from "./GetApiClient";
import ImageUrlGetterInterface from "./imageUrlGetterInterface";

export interface ImageUploadResult {
  filename: string;
  filesize: number;
  url: string;
  id: string;
}

export default class ImageUploader extends ImageUrlGetterInterface {
  _urlPrefix: string;
  _apiClient: FullcardsApiClient;
  _idToFilenameDictionary: { [key: string]: string };
  _serveStaticFileUrl: boolean;

  constructor({
    imageUrlPrefix = "/api/images",
    serveStaticFileUrl = false
  }: {
    imageUrlPrefix?: string;
    apiBaseUrl?: string;
    serveStaticFileUrl?: boolean;
  } = {}) {
    super();
    this._urlPrefix = imageUrlPrefix;
    this._apiClient = getApiClient();
    this._idToFilenameDictionary = {};
    this._serveStaticFileUrl = serveStaticFileUrl;
  }

  addIdToFilenameDictionary(dictionary: { [key: string]: string }) {
    this._idToFilenameDictionary = dictionary;
  }

  idToImageUrl(id: string) {
    if (this._serveStaticFileUrl)
      if (this._idToFilenameDictionary[id])
        return this._urlPrefix + "/" + this._idToFilenameDictionary[id];
      else
        throw new Error(
          "Filename corresponding to provided image id not found"
        );
    return this._urlPrefix + "/" + id;
  }

  async uploadImage(file: File | Blob): Promise<ImageUploadResult> {
    const result = await this._apiClient.default.uploadImage({ file });
    return {
      ...result,
      url: this.idToImageUrl(result.id)
    };
  }
  async getInfoById(id: string): Promise<ImageUploadResult> {
    const result = await this._apiClient.default.getImageInfo(id);
    return {
      ...result,
      url: this.idToImageUrl(result.id)
    };
  }
  async deleteImage(id: string): Promise<void> {
    await this._apiClient.default.deleteImage(id);
  }
  async deleteAll(): Promise<void> {
    const images = await this._apiClient.default.getImages();
    const promises = images.map(i => {
      return this._apiClient.default.deleteImage(i.id);
    });
    await Promise.all(promises);
  }
}
