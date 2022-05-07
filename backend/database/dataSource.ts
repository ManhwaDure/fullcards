import { readFileSync } from "fs";
import { join } from "path";
import { DataSource } from "typeorm";
import * as entities from "./entities";
import * as subscribers from "./subscribers";

const ormConfig = JSON.parse(
  readFileSync(join(process.cwd(), "configs/ormConfig.json"), {
    encoding: "utf-8"
  })
);

const dataSource = new DataSource({
  ...ormConfig,
  entities: Object.values(entities),
  subscribers: Object.values(subscribers)
});

export default dataSource;
