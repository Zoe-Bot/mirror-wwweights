import { Logger, UnprocessableEntityException } from '@nestjs/common';
import {
  CommandBus,
  CommandHandler,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { EventStore } from '../../eventstore/eventstore';
import { Item } from '../../models/item.model';
import { getSlug } from '../../shared/get-slug';
import { ItemInsertedEvent } from '../events/item-inserted.event';
import { InsertItemCommand } from './insert-item.command';

@CommandHandler(InsertItemCommand)
export class InsertItemHandler implements ICommandHandler<InsertItemCommand> {
  private readonly logger = new Logger(InsertItemHandler.name);
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStore: EventStore,
    private commandBus: CommandBus,
  ) {}

  // No returns, just Exceptions in CQRS
  async execute({ insertItemDto }: InsertItemCommand) {
    try {
      const sluggifiedTags = insertItemDto.tags?.map((tag) => ({
        name: tag,
        slug: getSlug(tag),
      }));
      const newItem = new Item({
        ...insertItemDto,
        slug: getSlug(insertItemDto.name),
        tags: sluggifiedTags,
      });

      // TODO: Check if Item can be inserted with EventstoreDB Streams?
      const eventItem = this.publisher.mergeObjectContext(newItem);
      this.eventStore.addEvent(ItemInsertedEvent.name, eventItem);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Item could not be inserted');
    }
  }
}
