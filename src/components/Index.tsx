import { useState } from 'react'
import { NotesContainer } from './NotesContainer'
import { SettingsModal } from './SettingsModal'
import { GlobalSettingsButton } from './GlobalSettingsButton'

function Index() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  
  const Title = () => {
    return (
      <div className='flex flex-col items-center p-[2vh]'>
        <h1 className="title-font text-[3vh] text-blue-800 dark:text-blue-200 tracking-tight font-[Pacifico]">
          TimeTracker
        </h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 flex flex-col items-center px-4 transition-colors duration-300">
      <GlobalSettingsButton onClick={() => setSettingsOpen(true)} />
      <Title />
      <NotesContainer />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default Index