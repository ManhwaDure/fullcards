import getConfig from "../../getConfigs";

export default async function handler(req, res) {
  res.status(200).json(await getConfig("firebase"));
}
