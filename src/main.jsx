import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider} from 'react-router-dom'
import './index.css'
import router from "./routes/router.jsx"
import { FirebaseProvider } from './context/FirebaseContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <ThemeProvider>
    <FirebaseProvider>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </FirebaseProvider>
  </ThemeProvider>
  // </StrictMode>
)
