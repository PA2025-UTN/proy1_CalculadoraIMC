import ImcCalculator from '@/components/ImcCalculator'
import Header from './components/Header'

function App() {

  return (
    <div className='py-4 min-h-screen w-screen flex flex-col justify-center items-center bg-slate-50'>
      <div className='absolute top-0 w-full'>
        <Header />
      </div>
      <ImcCalculator />
    </div>
  )
}

export default App
