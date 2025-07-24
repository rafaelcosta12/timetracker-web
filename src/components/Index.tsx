import { useState } from 'react'
import { NotesContainer } from './NotesContainer'
import { GlobalSettingsButton } from './GlobalSettingsButton'
import { ListResponsesButton } from './ListResponsesButton'

function Index() {  
  const Title = () => {
    return (
      <div className='fixed top-[1vh]'> 
        <h1 className="title-font text-[4vh] text-blue-800 dark:text-blue-200 tracking-tight font-[Pacifico]">
          TimeTracker
        </h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 flex flex-col items-center px-4 transition-colors duration-300">
      <GlobalSettingsButton />
      <ListResponsesButton />
      <Title /> {/* 14vh total */}
      <NotesContainer /> {/* 86vh total */}
    </div>
  )
}

export default Index