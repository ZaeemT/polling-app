import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from './components/ProtectedRoutes'
import SignIn from './views/auth/Login'
import { Toaster } from './components/ui/toaster'
import SignUp from './views/auth/Register'
import Navbar from './components/Navbar'
import Polls from './views/poll/Polls'
import AddPoll from './views/poll/AddPoll'
import PollDetail from './views/poll/ViewPoll'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path='/' element={<Polls />} />
                <Route path='/login' element={<SignIn />} />
                <Route path='/register' element={<SignUp />} />
                <Route
                  path="/create-poll"
                  element={
                    <ProtectedRoute>
                      <AddPoll />
                    </ProtectedRoute>
                  }
                />
                <Route path='/polls/:id' element={<PollDetail/>} />
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
