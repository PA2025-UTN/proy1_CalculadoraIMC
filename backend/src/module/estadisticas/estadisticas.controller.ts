import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { ActiveUser } from "../../common/decorators/active-user.decorator";
import { IUserActive } from "../../common/interfaces/user-active";
import { EstadisticasService } from "./estadisticas.service";

@Controller('estadisticas')
@UseGuards(AuthGuard)
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) { }

  @Get()
  getResumen(@ActiveUser() user: IUserActive) {
    return this.estadisticasService.getResumen(user.id);
  }

  @Get('serie-imc')
  getSerieIMC(@ActiveUser() user: IUserActive) {
    return this.estadisticasService.getSerieIMC(user.id);
  }

  @Get('serie-peso')
  getSeriePeso(@ActiveUser() user: IUserActive) {
    return this.estadisticasService.getSeriePeso(user.id);
  }

  @Get('categorias')
  getDistribucionCategorias(@ActiveUser() user: IUserActive) {
    return this.estadisticasService.getDistribucionCategorias(user.id);
  }
}

