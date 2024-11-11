import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import { AuthProvider } from "./contexts/AuthContext"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
              <Routes>
                {/* <Route path='/login' element= */}
              </Routes>
            </main>

          </div>
        </Router>

      </AuthProvider>
      <ModeToggle />
    </ThemeProvider>
  )
}

export default App
