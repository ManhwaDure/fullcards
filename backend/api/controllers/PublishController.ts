import { spawn } from "child_process";
import { copyFile } from "fs/promises";
import path, { join } from "path";
import { Controller, Post, Route, Security } from "tsoa";
import { CardService } from "../services/CardService";
import { ImageService } from "../services/ImageService";

@Route("publish")
@Security("jwt")
export class PublishController extends Controller {
  constructor() {
    super();
  }

  /**
   * Publishes website
   */
  @Post("publish")
  async publishWebsite(): Promise<void> {
    const imageService = new ImageService();
    const cardService = new CardService();

    const images = await imageService.getImages();
    for (const image of images) {
      const src = join(imageService.getImageDir(), image.filenameOnServer);
      const dst = join(
        process.cwd(),
        "public/images",
        image.id + path.extname(image.filename)
      );
      await copyFile(src, dst);
    }

    const buildProc = await spawn("yarn build-frontend", {
      shell: true,
      cwd: process.cwd()
    });
    buildProc.stdout.pipe(process.stdout);
    const waitForBuildExit: Promise<number> = new Promise(resolve =>
      buildProc.on("exit", exitCode => resolve(exitCode))
    );
    const buildProcExitCode = await waitForBuildExit;
    console.log(`buildProcExitCode : ${buildProcExitCode}`);

    const genProc = await spawn("yarn generate-website", {
      shell: true,
      cwd: process.cwd()
    });
    genProc.stdout.pipe(process.stdout);
    const waitForGenExit: Promise<number> = new Promise(resolve =>
      genProc.on("exit", exitCode => resolve(exitCode))
    );
    const genProcExitCode = await waitForGenExit;
    console.log(`genProcExitCode : ${genProcExitCode}`);
  }
}
