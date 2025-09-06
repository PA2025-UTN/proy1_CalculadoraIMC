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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Introduce tus datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-base font-medium">
                  Altura (cm)
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

                <Label htmlFor="weight" className="text-base font-medium">
                  Peso (kg)
                </Label>
                <Input
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  min="1"
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Calculando..." : "Calcular"}
              </Button>
            </CardContent>
          </Card>

          {/* Result Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Resultado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {resultado ? (
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Tu IMC es:</p>
                    <div className="text-4xl font-bold text-primary">
                      {resultado.imc}
                    </div>
                  </div>

                  <Badge>
                    {resultado.categoria}
                  </Badge>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Introducí tu peso y altura para ver el resultado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>

      {/* {resultado && ( */}
      {/*   <div className="mt-4 p-3 border rounded-md"> */}
      {/*     <p> */}
      {/*       <b>IMC:</b> {resultado.imc.toFixed(2)} */}
      {/*     </p> */}
      {/*     <p> */}
      {/*       <b>Categoría:</b> {resultado.categoria} */}
      {/*     </p> */}
      {/*   </div> */}
      {/* )} */}

      {error && (
        <p className="mt-2 text-red-500">{error}</p>
      )}

    </div>
  );
}

export default ImcForm;

