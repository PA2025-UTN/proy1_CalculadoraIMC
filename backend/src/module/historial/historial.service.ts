import { Injectable } from '@nestjs/common';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';

@Injectable()
export class HistorialService {
  create(createHistorialDto: CreateHistorialDto) {
    return 'This action adds a new historial';
  }

  findAll() {
    return `This action returns all historial`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historial`;
  }

  update(id: number, updateHistorialDto: UpdateHistorialDto) {
    return `This action updates a #${id} historial`;
  }

  remove(id: number) {
    return `This action removes a #${id} historial`;
  }
}
