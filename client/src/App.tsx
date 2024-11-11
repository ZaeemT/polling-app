import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import { AuthProvider } from "./contexts/AuthContext"
import SignIn from './views/auth/Login'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
              <ModeToggle />
              <Routes>
                <Route path='/login' element={<SignIn />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>

      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
