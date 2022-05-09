import { SiteSettingMap } from "../src/apiClient";
import dataSource from "./database/dataSource";
import { SiteSetting, SiteSettingName } from "./database/entities";

/**
 * Creates DataSetting entities from provided SiteSettingMap-type object
 * @param map SiteSettingMap-type object
 */
function createModel(map: SiteSettingMap) {
  // entity array
  const entities = [];

  // loop with keys of map variable
  for (const id in map) {
    // Create entity
    const model = new SiteSetting();
    model.id = id as SiteSettingName;
    model.value = map[id];

    // push created entitiy into entities variable
    entities.push(model);
  }

  //return entitiy
  return entities;
}

/**
 * Adds default SiteSettings into database
 */
export default async function() {
  // Get SiteSetting model repository
  const repository = await dataSource.getRepository(SiteSetting);

  // Get SiteSetting names which alreay exist in database
  const ids = (await repository.find({ select: ["id"] })).map(({ id }) => id);

  // Create default setting and exclude settings which already exist in database
  // so site settings which already exist in database wouldn't be updated.
  const models = createModel({
    author: "John Doe",
    description: "This is an example site",
    favicon: null,
    sitename: "Example site"
  }).filter(({ id }) => !ids.includes(id));

  // Save entities into database
  await repository.save(models);
}
