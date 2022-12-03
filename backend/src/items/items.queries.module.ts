import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsQueriesController } from './items.queries.controller';
import { Item } from './models/item.model';
import { QueryHandlers } from './queries';
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Item])],
  controllers: [ItemsQueriesController],
  providers: [...QueryHandlers],
})
export class ItemsQueriesModule {}
