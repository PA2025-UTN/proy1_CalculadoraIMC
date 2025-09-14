import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Imc } from './entities/imc.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ImcService {
  constructor(
    @InjectRepository(Imc)
    private readonly imcRepo: Repository<Imc>,
    private readonly usersService: UsersService,
  ) { }

  async calcularIMC(userId: number, peso: number, altura: number) {
    const imc = peso / (altura * altura);
    let categoria: string;
    if (imc < 18.5) {
      categoria = 'Bajo peso';
    } else if (imc < 25) {
      categoria = 'Peso normal';
    } else if (imc < 30) {
      categoria = 'Sobrepeso';
    } else {
      categoria = 'Obesidad';
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new Error(`Usuario ${userId} no encontrado`);
    }

    const resultado = this.imcRepo.create({
      peso,
      altura,
      imc,
      categoria,
      user,
    });

    return this.imcRepo.save(resultado);
  }

  async obtenerHistorial(userId: number) {
    return this.imcRepo.find({
      where: { user: { id: userId } },
      order: { fecha: 'DESC' },
    });
  }
}

