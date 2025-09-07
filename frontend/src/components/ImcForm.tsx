import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCalculator } from "@/hooks/useCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calculator, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

function ImcForm() {
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const { resultado, error, loading, calcularImc } = useCalculator();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const alturaNum = parseFloat(altura);
    const pesoNum = parseFloat(peso);

    if (isNaN(alturaNum) || isNaN(pesoNum)) return;

    calcularImc(alturaNum, pesoNum);
  };

  return (
    <div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Calculator Card */}
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Introduce tus datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-base font-medium">
                  Altura (m)
                </Label>
                <Input
                  type="number"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  step="0.01"
                  min="0.1"
                />
              </div>

              <div className="space-y-2">

                <Label htmlFor="weight" className="font-medium">
                  Peso (kg)
                </Label>
                <Input
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  min="1"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full cursor-pointer">
                {loading ? "Calculando..." : "Calcular"}
              </Button>
            </CardContent>
          </Card>

          {/* Result Card */}
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
                  <div className="text-4xl font-bold">
                    {resultado.imc}
                  </div>

                  <Badge
                    className={`text-lg px-4 py-2 ${resultado.categoria === "Bajo peso" ? "bg-neutral-100 text-neutral-600" :
                      resultado.categoria === "Peso normal" ? "bg-green-100 text-green-600" :
                        resultado.categoria === "Sobrepeso" ? "bg-amber-100 text-amber-500" : "bg-red-100 text-red-500"
                      }
                    `}
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
        </div>
      </form>



      {error && (
        <Card className="border-none shadow-none bg-red-100">
          <CardContent>
            <p className="mt-2 text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

    </div>
  );
}

export default ImcForm;

