import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent
} from "typeorm";
import { CardRelated } from "../entities/CardRelated";

@EventSubscriber()
export class CardRelatedEntitySubscriber
  implements EntitySubscriberInterface<CardRelated> {
  static fireEvent: () => void = null;
  listenTo() {
    return CardRelated;
  }
  afterInsert(evt: InsertEvent<CardRelated>) {
    if (CardRelatedEntitySubscriber.fireEvent !== null)
      CardRelatedEntitySubscriber.fireEvent();
  }
  afterRemove(evt: RemoveEvent<CardRelated>) {
    if (CardRelatedEntitySubscriber.fireEvent !== null)
      CardRelatedEntitySubscriber.fireEvent();
  }
  afterUpdate(evt: UpdateEvent<CardRelated>) {
    if (CardRelatedEntitySubscriber.fireEvent !== null)
      CardRelatedEntitySubscriber.fireEvent();
  }
}
