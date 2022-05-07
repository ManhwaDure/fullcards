import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent
} from "typeorm";
import { SiteSetting } from "../entities";

@EventSubscriber()
export class SiteSettingEntitySubscriber
  implements EntitySubscriberInterface<SiteSetting> {
  static fireEvent: (() => void)[] = [];
  listenTo() {
    return SiteSetting;
  }
  afterInsert(evt: InsertEvent<SiteSetting>) {
    if (SiteSettingEntitySubscriber.fireEvent !== null)
      SiteSettingEntitySubscriber.fireEvent.forEach(i => i());
  }
  afterRemove(evt: RemoveEvent<SiteSetting>) {
    if (SiteSettingEntitySubscriber.fireEvent !== null)
      SiteSettingEntitySubscriber.fireEvent.forEach(i => i());
  }
  afterUpdate(evt: UpdateEvent<SiteSetting>) {
    if (SiteSettingEntitySubscriber.fireEvent !== null)
      SiteSettingEntitySubscriber.fireEvent.forEach(i => i());
  }
}
