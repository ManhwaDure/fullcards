import { readFile } from "fs/promises";
import { join } from "path";

export default async function getConfig(
  type: "firebase" | "firebaseAdmin" | "redis"
): Promise<any> {
  let filepath;
  switch (type) {
    case "firebase":
      filepath = "data/firebaseConfig.json";
      break;
    case "firebaseAdmin":
      filepath = "data/firebaseAdminConfig.json";
      break;
    case "redis":
      filepath = "data/redisConfig.json";
      break;
  }
  filepath = join(process.cwd(), filepath);
  return JSON.parse(await readFile(filepath, { encoding: "utf8" }));
}
