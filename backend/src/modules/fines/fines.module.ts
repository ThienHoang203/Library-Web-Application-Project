import { Module } from '@nestjs/common';
import { FinesService } from './fines.service';
import { FinesController } from './fines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fine } from 'src/entities/fine.entity';

@Module({
  controllers: [FinesController],
  providers: [FinesService],
  imports: [TypeOrmModule.forFeature([Fine])],
  exports: [TypeOrmModule],
})
export class FinesModule {}
