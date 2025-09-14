import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialDto } from './create-historial.dto';

export class UpdateHistorialDto extends PartialType(CreateHistorialDto) {}
