import { useState } from 'react'
import { NotesContainer } from './NotesContainer'
import { SettingsModal } from './SettingsModal'
import { GlobalSettingsButton } from './GlobalSettingsButton'

function Index() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  
  const Title = () => {
    return (
      <div className='flex flex-col items-center min-h-[13vh]'>
        <div className="flex items-center gap-3 mb-4 mt-5">
          <div className="w-12 h-12 bg-blue-600 dark:bg-blue-800 rounded-full flex items-center justify-center shadow-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-800 dark:text-blue-200 tracking-tight">TimeTracker</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md text-center text-xs">
          Bem-vindo ao <span className="font-semibold text-blue-700 dark:text-blue-300">TimeTracker</span>! Registre suas notas diárias, acompanhe seu desempenho e veja sua evolução ao longo do tempo.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 flex flex-col items-center px-4 transition-colors duration-300">
      <GlobalSettingsButton onClick={() => setSettingsOpen(true)} />
      <Title />
      <NotesContainer />
      <footer className="min-h-[2vh] text-xs text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} TimeTracker. Feito com ❤️ por você.</footer>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default Index