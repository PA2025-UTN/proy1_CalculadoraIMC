import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ImcResultadoProps {
  resultado: { imc: number; categoria: string } | null;
}

export function ImcResultado({ resultado }: ImcResultadoProps) {
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-400" />
          Resultado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center justify-center">
        {resultado ? (
          <>
            <p className="text-md text-muted-foreground">Tu IMC es:</p>
            <div className="text-4xl font-bold">{resultado.imc}</div>

            <Badge
              className={`text-lg px-4 py-2 ${resultado.categoria === "Bajo peso"
                ? "bg-neutral-100 text-neutral-600"
                : resultado.categoria === "Peso normal"
                  ? "bg-green-100 text-green-600"
                  : resultado.categoria === "Sobrepeso"
                    ? "bg-amber-100 text-amber-500"
                    : "bg-red-100 text-red-500"
                }`}
            >
              {resultado.categoria}
            </Badge>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Introduce tu peso y altura para ver el resultado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

