import dataSource from "./database/dataSource";
import { SiteSetting, SiteSettingName } from "./database/entities";

function createModel(id: SiteSettingName, value: string) {
  const model = new SiteSetting();
  model.id = id;
  model.value = value;
  return model;
}
export default async function() {
  const repository = await dataSource.getRepository(SiteSetting);
  const ids = (await repository.find({ select: ["id"] })).map(({ id }) => id);
  const models = [
    createModel("author", "John Doe"),
    createModel("description", "This is an example site"),
    createModel("favicon", null),
    createModel("sitename", "Example site")
  ].filter(({ id }) => !ids.includes(id));

  await repository.save(models);
}
