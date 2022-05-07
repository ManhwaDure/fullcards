import { SiteSettingMap } from "../src/apiClient";
import dataSource from "./database/dataSource";
import { SiteSetting, SiteSettingName } from "./database/entities";

function createModel(map: SiteSettingMap) {
  const models = [];
  for (const id in map) {
    const model = new SiteSetting();
    model.id = id as SiteSettingName;
    model.value = map[id];
    models.push(model);
  }
  return models;
}
export default async function() {
  const repository = await dataSource.getRepository(SiteSetting);
  const ids = (await repository.find({ select: ["id"] })).map(({ id }) => id);
  const models = createModel({
    author: "John Doe",
    description: "This is an example site",
    favicon: null,
    sitename: "Example site"
  }).filter(({ id }) => !ids.includes(id));

  await repository.save(models);
}
