
import './App.css'
import AppRouter from './Routing/AppRouter'
import { Toaster } from "react-hot-toast";

function App() {

  return (
<div className="min-h-screen transition-colors duration-300 bg-bgcolor dark:bg-bg_dark">
       <AppRouter/>
       <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </div>
  )
}

export default App
