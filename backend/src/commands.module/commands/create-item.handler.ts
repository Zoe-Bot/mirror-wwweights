import {
  ConflictException,
  HttpException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { ALLOWED_EVENT_ENTITIES } from 'src/eventstore/enums/allowedEntities.enum';
import { EventStore } from '../../eventstore/eventstore';
import { Item } from '../../models/item.model';
import { CreateItemCommand } from './create-item.command';

@CommandHandler(CreateItemCommand)
export class CreateItemHandler implements ICommandHandler<CreateItemCommand> {
  private readonly logger = new Logger(CreateItemHandler.name);
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStore: EventStore,
  ) {}

  // No returns, just Exceptions in CQRS
  async execute(command: CreateItemCommand) {
    try {
      // Check for normal issues
      this.logger.debug('dto: ', command.createItemDto);
      const newItem = plainToInstance(Item, command.createItemDto);
      this.logger.debug('newItem', newItem);
      const eventItem = this.publisher.mergeObjectContext(newItem);

      if (
        await this.eventStore.doesStreamExist(
          `${ALLOWED_EVENT_ENTITIES.ITEM}-${eventItem.slug}`,
        )
      ) {
        throw new ConflictException('Slug already taken');
      }

      await this.eventStore.addEvent(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${eventItem.slug}`,
        'ItemCreatedEvent',
        eventItem,
      );
      this.logger.log(`Event created on stream: item-${eventItem.slug}`);
    } catch (error) {
      // If thrown error is already a valid HttpException => Throw that one instead
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error);
      throw new UnprocessableEntityException('Item could not be created');
    }
  }
}
