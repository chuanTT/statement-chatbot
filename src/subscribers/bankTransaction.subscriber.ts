import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { BankTransaction } from "../entity/BankTransaction";

@EventSubscriber()
export class PostSubscriber
  implements EntitySubscriberInterface<BankTransaction>
{
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return BankTransaction;
  }

  /**
   * Called before post insertion.
   */
  beforeInsert(event: InsertEvent<BankTransaction>) {
    event.entity.uuid = uuidv4();
  }
}
