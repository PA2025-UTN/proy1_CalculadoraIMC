import ImcCalculator from './components/ImcCalculator'
import Welcome from './components/Welcome'
import { Route, Routes } from 'react-router'
import ProtectedRoute from './utils/ProtectedRoute'
import NotFound from './components/NotFound'
import PublicRoute from './utils/PublicRoute'

function App() {

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Welcome />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/calculadora" element={<ImcCalculator />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
