import { Body, Controller, Get, Put, Route, Security } from "tsoa";
import dataSource from "../../database/dataSource";
import {
  SiteSetting as SiteSettingModel,
  SiteSettingName
} from "../../database/entities";

type SiteSetting = {
  id: string;
  value: string;
};
type SiteSettingMap = {
  [key in SiteSettingName]: string;
};
@Route("auth")
export class SiteController extends Controller {
  /**
   * Get every site settings
   */
  @Get()
  async getAllSiteSettings(): Promise<SiteSettingMap> {
    const settings = await dataSource.getRepository(SiteSettingModel).find();
    const entries = settings.map(({ id, value }) => [id, value]);
    return Object.fromEntries(entries) as SiteSettingMap;
  }

  /**
   * Get site setting
   * @param id site setting name
   */
  @Get("{id}")
  async getSiteSetting(@Route() id: SiteSettingName): Promise<SiteSetting> {
    return await dataSource.getRepository(SiteSettingModel).findOneBy({
      id
    });
  }

  /**
   * Set site setting
   * @param id site setting name
   */
  @Put("{id}")
  @Security("jwt")
  async setSiteSetting(
    @Route() id: SiteSettingName,
    @Body() body: Omit<SiteSetting, "id">
  ): Promise<SiteSetting> {
    const repository = await dataSource.getRepository(SiteSettingModel);
    let setting = new SiteSettingModel();
    setting.id = id;
    setting.value = body.value;
    setting = await repository.save(setting);
    return setting;
  }
}
