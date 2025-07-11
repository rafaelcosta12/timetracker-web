import { useEffect, useState } from 'react'

interface Note {
  content: string
  dateTime: Date
}

function Welcome() {
  const [input, setInput] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [deepsekResponse, setDeepsekResponse] = useState<Promise<Response> | null>(null)
  const [deepsekModalOpen, setDeepsekModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editNoteIdx, setEditNoteIdx] = useState<number | null>(null)

  const addNote = () => {
    if (input.trim()) {
      if (input.startsWith('/')) {
        const inputCommandArray = input.split(' ')
        const command = inputCommandArray.splice(0, 1)[0].slice(1).trim()

        if (command === 'send') {
          sendToDeepsek(inputCommandArray.join(' '))
          setInput('')
          return
        } else {
          console.error(`Comando desconhecido: ${inputCommandArray}`)
          setInput('')
          return
        }
      }
      var dt = new Date()
      setNotes([...notes, { content: input, dateTime: new Date() }])
      setInput('')
      localStorage.setItem('notes', JSON.stringify([...notes, { content: input, dateTime: dt.toISOString() }]));
    }
  }

  useEffect(() => {
    const container = document.querySelector('.notes-container')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [notes])

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes).map((i: any) => {
        return { content: i.content, dateTime: new Date(i.dateTime) }
      }))
    }

    if (!localStorage.getItem('assistant_name')) {
      localStorage.setItem('assistant_name', 'Deepsek')
    }
    
    if (!localStorage.getItem('assistant_system_message')) {
      localStorage.setItem('assistant_system_message', 'Você é um assistente de produtividade. Ajude o usuário a organizar suas notas e tarefas diárias.')
    }

    if (!localStorage.getItem('assistant_default_user_message')) {
      localStorage.setItem('assistant_default_user_message', 'Por favor, analise minhas notas e me dê um resumo.')
    }
  }, [])

  const sendToDeepsek = (message?: string) => {
    var deepsekKey = localStorage.getItem('deepsek_key')
    if (!deepsekKey) {
      alert('Chave de API do Deepsek não configurada. Por favor, configure-a nas configurações.')
      return
    }

    var taskListString = notes.map(i => `${i.dateTime.toLocaleString("pt-BR")}: ${i.content}`).join('\n')

    setDeepsekResponse(fetch("https://api.deepseek.com/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + deepsekKey,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: localStorage.getItem('assistant_system_message') || '' },
          { role: 'user', content: 'Aqui estão minhas notas do dia:\n\n' + taskListString },
          { role: 'user', content: message || localStorage.getItem('assistant_defaul_user_message') || '' },
        ],
      }),
    }))
    setDeepsekModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 flex flex-col items-center px-4 transition-colors duration-300">
      <GlobalSettingsButton onClick={() => setSettingsOpen(true)} />
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
      <div className='flex items-start justify-center w-full min-h-[80vh]'>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-2xl transition-colors duration-300">
            <div className="max-h-[60vh] overflow-y-auto mb-4 space-y-3 notes-container custom-scrollbar">
              {notes.map((note, idx) => (
                <div key={idx} className="bg-blue-50 dark:bg-gray-800 rounded-md px-3 py-2 shadow-sm space-y-2 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors" onDoubleClick={() => { setEditNoteIdx(idx); setEditModalOpen(true); }}>
                  <div className="text-xs text-blue-400 dark:text-blue-200">{note.dateTime.toLocaleString('pt-BR')}</div>
                  <div className="text-gray-800 dark:text-gray-100 whitespace-pre-line">{note.content}</div>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="text-gray-400 dark:text-gray-500 text-center">Nenhuma nota ainda.</div>
              )}
            </div>
          <form
            className="grid grid-cols-1 gap-3"
            onSubmit={e => {
              e.preventDefault()
              addNote()
            }}
          >
            <div className='flex items-center gap-2'>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
                placeholder="Digite uma nova nota..."
                className="flex-1 px-3 py-2 rounded-md border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
                rows={3}
                onKeyDown={e => {
                  if (e.shiftKey && e.key === 'Enter')
                  {
                    e.preventDefault()
                    setInput(input + '\n')
                  }
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addNote()
                  }
                }}
              />
            </div>
          </form>
        </div>
      </div>
      <footer className="min-h-[2vh] text-xs text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} TimeTracker. Feito com ❤️ por você.</footer>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <DeepsekResponseModal
        open={deepsekModalOpen}
        onClose={() => setDeepsekModalOpen(false)}
        response={deepsekResponse}
      />
      <EditNoteModal
        open={editModalOpen}
        note={editNoteIdx !== null ? notes[editNoteIdx] : null}
        onSave={updatedNote => {
          if (editNoteIdx !== null) {
            const updatedNotes = notes.map((n, i) =>
              i === editNoteIdx ? updatedNote : n
            )
            setNotes(updatedNotes)
            localStorage.setItem('notes', JSON.stringify(updatedNotes.map(i => ({ content: i.content, dateTime: i.dateTime.toISOString() }))))
          }
        }}
        onDelete={() => {
          if (editNoteIdx !== null) {
            const updatedNotes = notes.filter((_, i) => i !== editNoteIdx)
            setNotes(updatedNotes)
            localStorage.setItem('notes', JSON.stringify(updatedNotes.map(i => ({ content: i.content, dateTime: i.dateTime.toISOString() }))))
          }
        }}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  )
}

function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  const [deepsekApiKey, setDeepsekApiKey] = useState(localStorage.getItem('deepsek_key') || '')
  const [assistantName, setAssistantName] = useState(localStorage.getItem('assistant_name') || '')
  const [assistantSystemMessage, setAssistantSystemMessage] = useState(localStorage.getItem('assistant_system_message') || '')
  const [assistantDefaultUserMessage, setAssistantDefaultUserMessage] = useState(localStorage.getItem('assistant_default_user_message') || '')
  
  useEffect(() => {
    localStorage.setItem('deepsek_key', deepsekApiKey)
  }, [deepsekApiKey])
  
  useEffect(() => {
    localStorage.setItem('assistant_name', assistantName)
  }, [assistantName])
  
  useEffect(() => {
    localStorage.setItem('assistant_system_message', assistantSystemMessage)
  }, [assistantSystemMessage])

  useEffect(() => {
    localStorage.setItem('assistant_default_user_message', assistantDefaultUserMessage)
  }, [assistantDefaultUserMessage])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-blue-600"
          onClick={onClose}
          aria-label="Fechar"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path d="M6 6l12 12M6 18L18 6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-200">Configurações</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chave de API do Deepsek</label>
            <input
              type="text"
              value={deepsekApiKey}
              placeholder="Insira sua chave de API"
              className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
              onChange={e => setDeepsekApiKey(e.target.value)}
            />
          </div>
          <div className="mb-4 rounded border-blue-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">Configurações do Assistente</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Assistente</label>
              <input
                type="text"
                value={assistantName}
                placeholder="Ex: Deepsek, GPT, etc."
                className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 mb-2"
                onChange={e => setAssistantName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensagem do Sistema</label>
              <textarea
              value={assistantSystemMessage}
              placeholder="Mensagem de instrução para o assistente"
              className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
              rows={3}
              onChange={e => setAssistantSystemMessage(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensagem padrão</label>
              <textarea
                value={assistantDefaultUserMessage}
                placeholder="Mensagem padrão para o assistente"
                className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
                rows={3}
                onChange={e => setAssistantDefaultUserMessage(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remover todas as notas:</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Esta ação removerá todas as notas salvas. Você não poderá recuperá-las depois.
            </p>
            <button
              className="px-4 py-2 rounded text-red-500 hover:text-red-700 transition-colors border"
              onClick={() => {
                if (window.confirm('Tem certeza que deseja remover todas as notas?')) {
                  localStorage.removeItem('notes')
                  window.location.reload()
                }
              }}
            >
              Remover todas as notas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GlobalSettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-full p-2 shadow hover:bg-blue-50 dark:hover:bg-gray-700 transition"
      onClick={onClick}
      aria-label="Abrir configurações"
    >
      <svg width="24" height="24" fill="none" stroke="currentColor" className='text-gray-800 dark:text-gray-300'>
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path d="M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" strokeWidth="2" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

interface DeepsekResponseModalProps {
  open: boolean
  onClose: () => void
  response: Promise<Response> | null
}

function DeepsekResponseModal({ open, onClose, response }: DeepsekResponseModalProps) {
  if (!open) return null
  const [deepsekResponse, setDeepsekResponse] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!response) {
      setDeepsekResponse('')
      setLoading(false)
      return
    }
    setLoading(true)
    setDeepsekResponse('')
    response
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao enviar notas para o Deepsek: ' + response.statusText)
        }
        return response.json()
      })
      .then(data => {
        const modelResponse = data?.choices?.[0]?.message?.content || 'Nenhuma resposta recebida.'
        setDeepsekResponse(modelResponse)
      })
      .catch(error => {
        setDeepsekResponse('Erro ao enviar notas para o Deepsek. Verifique o console para mais detalhes e tente novamente.')
        console.error('Erro ao enviar notas para o Deepsek:', error)
      })
      .finally(() => setLoading(false))
  }, [response])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-blue-600"
          onClick={onClose}
          aria-label="Fechar"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path d="M6 6l12 12M6 18L18 6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-200">Resposta do Deepsek</h2>
        <div className="whitespace-pre-line text-gray-800 dark:text-gray-100 max-h-[50vh] overflow-y-auto min-h-[3rem] flex items-center justify-center">
          {loading ? (
            <span className="flex items-center gap-2 text-blue-500">
              <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Carregando resposta...
            </span>
          ) : (
            <div className='md-content dark:bg-gray-800 bg-gray-200 rounded p-4 text-sm overflow-y-auto max-h-[50vh]'>
              {deepsekResponse || <span className="text-gray-400 dark:text-gray-500">Nenhuma resposta recebida.</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface EditNoteModalProps {
  open: boolean
  note: Note | null
  onSave: (updatedNote: Note) => void
  onDelete: () => void
  onClose: () => void
}

function EditNoteModal({ open, note, onSave, onDelete, onClose }: EditNoteModalProps) {
  const [content, setContent] = useState(note?.content || '')

  useEffect(() => {
    setContent(note?.content || '')
  }, [note])

  if (!open || !note) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-blue-600"
          onClick={onClose}
          aria-label="Fechar"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path d="M6 6l12 12M6 18L18 6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-200">Editar Nota</h2>
        <div className="mb-4">
          <textarea
            className="w-full px-3 py-2 rounded-md border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
            rows={4}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              onDelete()
              onClose()
            }}
          >
            Remover
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              onSave({ ...note, content })
              onClose()
            }}
            disabled={content.trim() === ''}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Welcome