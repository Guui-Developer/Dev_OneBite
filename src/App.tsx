import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Root from './pages/Root'
import {Welcome} from './pages/Welcome'
import History from './pages/History'
import Category from './pages/Category'
import Learn from './pages/Learn'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-full max-w-lg min-h-screen bg-[#0A0A0A] shadow-xl">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/category" element={<Category />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/history" element={<History />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
