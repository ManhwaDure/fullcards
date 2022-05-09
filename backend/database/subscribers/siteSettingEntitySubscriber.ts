import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent
} from "typeorm";
import { SiteSetting } from "../entities";

/**
 * EntitySubscriber for every events of SiteSetting entities
 * This class will call every functions in static fireEvent variable on the event
 */
@EventSubscriber()
export class SiteSettingEntitySubscriber
  implements EntitySubscriberInterface<SiteSetting> {
  /**
   * Functions that would be called on the event
   */
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
