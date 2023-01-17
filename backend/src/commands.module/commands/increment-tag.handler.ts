import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventStore } from '../../eventstore/eventstore';
import { TagIncrementedEvent } from '../events/tag-incremented.event';
import { IncrementTagCommand } from './increment-tag.command';

@CommandHandler(IncrementTagCommand)
export class IncrementTagHandler
  implements ICommandHandler<IncrementTagCommand>
{
  private readonly logger = new Logger(IncrementTagHandler.name);
  constructor(private readonly eventStore: EventStore) {}

  async execute({ slug }: IncrementTagCommand) {
    try {
      // TODO: Check if Tag can be incremented

      this.eventStore.addEvent(TagIncrementedEvent.name, slug);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Tag could not be inserted');
    }
  }
}
