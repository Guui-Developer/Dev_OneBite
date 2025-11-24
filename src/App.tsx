import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import History from './pages/History'
import Category from './pages/Category'
import Learn from './pages/Learn'

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-full max-w-md min-h-screen bg-[#0A0A0A] shadow-xl">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/category" element={<Category />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
