import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider} from 'react-router-dom'
import './index.css'
import router from "./routes/router.jsx"
import { FirebaseProvider } from './context/FirebaseContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketContextProvider } from "./context/SocketContext.jsx"
const queryClient = new QueryClient(); 
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
    <FirebaseProvider>
      <UserContextProvider>
        <SocketContextProvider>
        <RouterProvider router={router} />
        </SocketContextProvider>
      </UserContextProvider>
    </FirebaseProvider>
    </QueryClientProvider>
  </ThemeProvider>
  // </StrictMode>
)
