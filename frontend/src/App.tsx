import ImcCalculator from './components/imc/Calculator'
import Welcome from './components/Welcome'
import { Route, Routes } from 'react-router'
import ProtectedRoute from './utils/ProtectedRoute'
import NotFound from './components/NotFound'
import PublicRoute from './utils/PublicRoute'
import ImcLayout from './components/imc/Layout'
import ImcHistorial from './components/imc/historial/Historial'
import ImcEstadisticas from './components/imc/estadisticas/Estadisticas'

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
