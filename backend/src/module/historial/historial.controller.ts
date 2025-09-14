import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';

@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Post()
  create(@Body() createHistorialDto: CreateHistorialDto) {
    return this.historialService.create(createHistorialDto);
  }

  @Get()
  findAll() {
    return this.historialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorialDto: UpdateHistorialDto) {
    return this.historialService.update(+id, updateHistorialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historialService.remove(+id);
  }
}
