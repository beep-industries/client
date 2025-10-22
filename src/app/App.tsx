import './styles/App.css'
import './styles/index.css'
import { ThemeProvider } from './providers/ThemeProvider'
import { ModeToggle } from '@/features/init/components/ModeToggle'

function App() {

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ModeToggle />
    </ThemeProvider>
  )
}

export default App
