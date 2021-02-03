import cuid from "cuid";
import firebase from "firebase/app";
import "firebase/storage";
import mime from "mime-types";

export interface ImageUploadResult {
  filename: string;
  url: string;
  id: string;
}

export default class ImageUploader {
  _prefix: string;

  constructor(prefix: string = "/images") {
    this._prefix = prefix;
  }
  async uploadImage(
    file: File | Blob,
    options: Partial<{ filename: string; id: string }> = {}
  ): Promise<ImageUploadResult> {
    const id = options.id || cuid();
    const filename = file instanceof File ? file.name : options.filename;
    const refPath = this._prefix + "/" + id;
    const ref = firebase.storage().ref(refPath);
    await ref.put(file);
    await ref.updateMetadata({
      contentType: mime.lookup(filename) || "application/octet-stream",
      customMetadata: {
        filename,
      },
    });
    return await this.getInfoById(id);
  }
  async getInfoById(id: string): Promise<ImageUploadResult> {
    const refPath = this._prefix + "/" + id;
    const ref = firebase.storage().ref(refPath);
    const metadata = await ref.getMetadata();
    return {
      filename: metadata.customMetadata.filename,
      url: await ref.getDownloadURL(),
      id,
    };
  }
  async deleteImage(id: string): Promise<void> {
    const refPath = this._prefix + "/" + id;
    const ref = firebase.storage().ref(refPath);
    await ref.delete();
  }
  async deleteAll(): Promise<void> {
    const ref = firebase.storage().ref(this._prefix);
    const images = await ref.listAll();
    const promises = images.items.map((i) => {
      return i.delete();
    });
    await Promise.all(promises);
  }
}
