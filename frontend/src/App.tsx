import ImcCalculator from './components/ImcCalculator'
import Welcome from './components/Welcome'
import { Route, Routes } from 'react-router'
import ProtectedRoute from './ProtectedRoute'
import NotFound from './components/NotFound'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route
        path="/calculadora"
        element={
          <ProtectedRoute>
            <ImcCalculator />
          </ProtectedRoute>
        } />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
