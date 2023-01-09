import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStoreModule } from 'src/eventstore/eventstore.module';
import { EventStore } from '../eventstore/eventstore';
import { Item } from '../models/item.model';
import { QueryHandlers } from './queries';
import { QueriesController } from './queries.controller';
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Item]), EventStoreModule],
  controllers: [QueriesController],
  providers: [...QueryHandlers],
})
export class QueriesModule {}
