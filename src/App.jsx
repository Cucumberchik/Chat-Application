import Index from "./pages";
import AuthProvider from './providers/AppProviders'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/dashboard";

const AuthenticatedRoute = ({ children }) => {
  const { authUser } = useAuth();

  if (!authUser) return <Navigate to="/" />;

  return children;
};
 const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/dashboard"
            element={
              <AuthenticatedRoute>
                <Dashboard />
              </AuthenticatedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App