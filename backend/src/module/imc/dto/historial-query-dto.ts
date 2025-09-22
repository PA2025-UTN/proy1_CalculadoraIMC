import { Transform } from "class-transformer";
import { IsArray, IsIn, IsOptional, IsString } from "class-validator";

export class HistorialQueryDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsIn(["fecha", "imc"])
  orderBy?: "fecha" | "imc";

  @IsOptional()
  @IsIn(["asc", "desc"])
  direction?: "asc" | "desc";

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (value === "all") return ["all"];
    return (value as string)
      .split(",")
      .map(v => v.trim().toLowerCase())
      .filter(Boolean);
  })
  @IsArray()
  @IsIn(["bajo", "normal", "sobrepeso", "obesidad", "all"], { each: true })
  categoria?: ("bajo" | "normal" | "sobrepeso" | "obesidad" | "all")[];
}

