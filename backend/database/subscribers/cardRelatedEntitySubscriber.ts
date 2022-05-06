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
