import { PickType } from '@nestjs/mapped-types';
import { CreateBookShelfDto } from './create-book-shelf.dto';

export class ChangeBookShelfStatusDto extends PickType(CreateBookShelfDto, ['status']) {}
