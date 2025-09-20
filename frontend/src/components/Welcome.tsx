import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, Activity } from "lucide-react";
import Login from "./auth/Login";
import Register from "./auth/Register";

const Welcome = () => {
  return (
    <div className="min-h-screen flex justify-center p-4 pt-32 bg-slate-50">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Activity className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-6xl font-bold">
            Calculadora de IMC
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitoreá tu salud de manera inteligente. Calculá tu Índice de Masa Corporal,
            visualizá tendencias y mantené un registro completo de tu progreso.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <Calculator className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <CardTitle className="text-lg">Cálculo Preciso</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Calculá tu IMC basado en tu peso y altura
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-red-400" />
              <CardTitle className="text-lg">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Visualizá la evolución de tu IMC con gráficos interactivos
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <Activity className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <CardTitle className="text-lg">Historial</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Mantené un registro completo de todos tus cálculos anteriores
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 justify-center">
          <Login />
          <Register />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
