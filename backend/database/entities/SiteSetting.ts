import { Column, Entity, PrimaryColumn } from "typeorm";

export type SiteSettingName = "sitename" | "favicon" | "description" | "author";
@Entity()
export class SiteSetting {
  @PrimaryColumn()
  id: SiteSettingName;

  @Column()
  value: string;
}
