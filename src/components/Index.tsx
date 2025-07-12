import { useState } from 'react'
import { NotesContainer } from './NotesContainer'
import { SettingsModal } from './SettingsModal'
import { GlobalSettingsButton } from './GlobalSettingsButton'

function Index() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  
  const Title = () => {
    return (
      <div className='flex flex-col items-center space-y-3 mb-4'>
        <h1 className="title-font text-5xl text-blue-800 dark:text-blue-200 tracking-tight font-[Pacifico]">
          TimeTracker
        </h1>
      </div>
    )
  }

  return (
    <div className="p-2 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 flex flex-col items-center px-4 transition-colors duration-300">
      <GlobalSettingsButton onClick={() => setSettingsOpen(true)} />
      <Title />
      <NotesContainer />
      <footer className="mt-10 text-gray-400 dark:text-gray-100">&copy; {new Date().getFullYear()} TimeTracker. Feito com ❤️ por você.</footer>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default Index