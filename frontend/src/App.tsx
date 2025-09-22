import { Route, Routes } from 'react-router'
import ImcCalculator from './components/imc/calculadora/Calculator'
import ImcEstadisticas from './components/imc/estadisticas/Estadisticas'
import ImcHistorial from './components/imc/historial/Historial'
import ImcLayout from './components/imc/Layout'
import NotFound from './components/NotFound'
import Welcome from './components/Welcome'
import ProtectedRoute from './utils/ProtectedRoute'
import PublicRoute from './utils/PublicRoute'

function App() {

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Welcome />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<ImcLayout />}>
          <Route path="/calculadora" element={<ImcCalculator />} />
          <Route path="/historial" element={<ImcHistorial />} />
          <Route path="/estadisticas" element={<ImcEstadisticas />} />
        </Route>
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
