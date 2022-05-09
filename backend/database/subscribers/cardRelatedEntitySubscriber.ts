import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent
} from "typeorm";
import { CardRelated } from "../entities/CardRelated";

/**
 * EntitySubscriber for every events of Card-Related entities
 * This class will call every functions in static fireEvent variable on the event
 */
@EventSubscriber()
export class CardRelatedEntitySubscriber
  implements EntitySubscriberInterface<CardRelated> {
  /**
   * Functions that would be called on the event
   */
  static fireEvent: (() => void)[] = [];
  listenTo() {
    return CardRelated;
  }
  afterInsert(evt: InsertEvent<CardRelated>) {
    if (CardRelatedEntitySubscriber.fireEvent !== null)
      CardRelatedEntitySubscriber.fireEvent.forEach(i => i());
  }
  afterRemove(evt: RemoveEvent<CardRelated>) {
    if (CardRelatedEntitySubscriber.fireEvent !== null)
      CardRelatedEntitySubscriber.fireEvent.forEach(i => i());
  }
  afterUpdate(evt: UpdateEvent<CardRelated>) {
    if (CardRelatedEntitySubscriber.fireEvent !== null)
      CardRelatedEntitySubscriber.fireEvent.forEach(i => i());
  }
}
