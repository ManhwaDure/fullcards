import { Column, Entity, PrimaryColumn } from "typeorm";

/**
 * Name of site settings
 */
export type SiteSettingName = "sitename" | "favicon" | "description" | "author";

/**
 * Site setting entitiy, such as site name
 */
@Entity()
export class SiteSetting {
  /**
   * name
   */
  @PrimaryColumn()
  id: SiteSettingName;

  /**
   * Value
   */
  @Column({
    nullable: true
  })
  value: string;
}
