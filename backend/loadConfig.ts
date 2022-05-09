import { readFile } from "fs/promises";
import { join } from "path";

export default async function(path: string): Promise<any> {
  return await JSON.parse(
    await readFile(join(process.cwd(), "configs", path), { encoding: "utf8" })
  );
}
