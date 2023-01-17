import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Tag } from '../../models/tag.model';
import { TagIncrementedEvent } from './tag-incremented.event';

@EventsHandler(TagIncrementedEvent)
export class TagIncrementedHandler
  implements IEventHandler<TagIncrementedEvent>
{
  private readonly logger = new Logger(TagIncrementedHandler.name);
  constructor(
    @InjectModel(Tag)
    private readonly tagModel: ReturnModelType<typeof Tag>,
  ) {}
  async handle({ slug }: TagIncrementedEvent) {
    try {
      const tag = await this.tagModel.findOneAndUpdate(
        { slug },
        { $inc: { count: 1 } },
        { new: true },
      );

      this.logger.log(`Tag incremented: ${JSON.stringify(tag, null, 2)}`);
      // TODO: Also save alterations itemsByTag
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Tag could not be incremented');
    }
  }
}
