import { readFileSync } from "fs";
import { join } from "path";
import { DataSource } from "typeorm";
import * as entities from "./entities";
import { CardRelatedEntitySubscriber } from "./subscribers/cardRelatedEntitySubscriber";

const ormConfig = JSON.parse(
  readFileSync(join(process.cwd(), "configs/ormConfig.json"), {
    encoding: "utf-8"
  })
);

const dataSource = new DataSource({
  ...ormConfig,
  entities: Object.values(entities),
  subscribers: [CardRelatedEntitySubscriber]
});

export default dataSource;
