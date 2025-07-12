import { useState, useEffect } from 'react';
import { DeepsekResponseModal } from './DeepsekResponseModal';
import { EditNoteModal } from './EditNoteModal';
import { NoteForm } from './NoteForm';
import type { Note } from './Note';

export const NotesContainer = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editNoteIdx, setEditNoteIdx] = useState<number | null>(null);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  useEffect(() => {
    const container = document.querySelector('.notes-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [notes]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes).map((i: any) => {
        return { content: i.content, dateTime: new Date(i.dateTime) };
      }));
    }

    if (!localStorage.getItem('assistant_name')) {
      localStorage.setItem('assistant_name', 'Deepsek');
    }

    if (!localStorage.getItem('assistant_system_message')) {
      localStorage.setItem('assistant_system_message', 'Você é um assistente de produtividade. Ajude o usuário a organizar suas notas e tarefas diárias.');
    }

    if (!localStorage.getItem('assistant_default_user_message')) {
      localStorage.setItem('assistant_default_user_message', 'Por favor, analise minhas notas e me dê um resumo.');
    }
  }, []);

  const addNote = (input: string) => {
    if (input.trim()) {
      if (input.startsWith('/')) {
        const inputCommandArray = input.split(' ');
        const command = inputCommandArray.splice(0, 1)[0].slice(1).trim();
        if (command === 'd') {
          sendToDeepsek(inputCommandArray.join(' '));
          return;
        }
        if (command === '?') {
          setHelpModalOpen(true);
          return;
        }
        else {
          console.error(`Comando desconhecido: ${inputCommandArray}`);
          return;
        }
      }
      var dt = new Date();
      setNotes([...notes, { content: input, dateTime: new Date() }]);
      localStorage.setItem('notes', JSON.stringify([...notes, { content: input, dateTime: dt.toISOString() }]));
    }
  };

  const [deepsekResponse, setDeepsekResponse] = useState<Promise<Response> | null>(null);
  const [deepsekModalOpen, setDeepsekModalOpen] = useState(false);

  const sendToDeepsek = (message?: string) => {
    var deepsekKey = localStorage.getItem('deepsek_key');
    if (!deepsekKey) {
      alert('Chave de API do Deepsek não configurada. Por favor, configure-a nas configurações.');
      return;
    }

    var taskListString = notes.map(i => `${i.dateTime.toLocaleString("pt-BR")}: ${i.content}`).join('\n');

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
    }));
    setDeepsekModalOpen(true);
  };

  return (
    <div className='flex items-start justify-center w-full'>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full transition-colors duration-300">
        <div className="max-h-[60vh] overflow-y-auto mb-4 space-y-3 notes-container custom-scrollbar">
          {notes.map((note, idx) => (
            <div key={idx} className="bg-blue-50 dark:bg-gray-800 rounded-md px-3 py-2 shadow-sm space-y-2 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors" onDoubleClick={() => { setEditNoteIdx(idx); setEditModalOpen(true); }}>
              <div className="text-xs text-blue-400 dark:text-blue-200">{note.dateTime.toLocaleString('pt-BR')}</div>
              <div className="text-gray-800 dark:text-gray-100 whitespace-pre-line font-[Nunito_Sans]">{note.content}</div>
            </div>
          ))}
          {notes.length === 0 && (
            <div className="text-gray-400 dark:text-gray-500 text-center">Nenhuma nota ainda.</div>
          )}
        </div>
        <NoteForm addNote={addNote} />
      </div>
      <HelpModal open={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
      <EditNoteModal
        open={editModalOpen}
        note={editNoteIdx !== null ? notes[editNoteIdx] : null}
        onSave={updatedNote => {
          if (editNoteIdx !== null) {
            const updatedNotes = notes.map((n, i) => i === editNoteIdx ? updatedNote : n
            );
            setNotes(updatedNotes);
            localStorage.setItem('notes', JSON.stringify(updatedNotes.map(i => ({ content: i.content, dateTime: i.dateTime.toISOString() }))));
          }
        }}
        onDelete={() => {
          if (editNoteIdx !== null) {
            const updatedNotes = notes.filter((_, i) => i !== editNoteIdx);
            setNotes(updatedNotes);
            localStorage.setItem('notes', JSON.stringify(updatedNotes.map(i => ({ content: i.content, dateTime: i.dateTime.toISOString() }))));
          }
        }}
        onClose={() => setEditModalOpen(false)} />
      <DeepsekResponseModal
        open={deepsekModalOpen}
        onClose={() => setDeepsekModalOpen(false)}
        response={deepsekResponse} />
    </div>
  );
};


export interface HelpModalProps {
  open: boolean
  onClose: () => void
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full m-5 lg:max-w-5xl relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-blue-600"
          onClick={onClose}
          aria-label="Fechar"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path d="M6 6l12 12M6 18L18 6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-200">Comandos disponíveis</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-800 dark:text-gray-100">
          <li><span className="font-semibold">/d</span> - Enviar notas para o Deepsek para análise.</li>
          <li><span className="font-semibold">/?</span> - Abrir este menu de ajuda.</li>
          <li><span className="font-semibold">Shift + Enter</span> - Inserir uma nova linha sem enviar a nota.</li>
          <li><span className="font-semibold">Enter</span> - Enviar a nota.</li>
        </ul>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Use os comandos acima para interagir com o aplicativo. Você pode enviar suas notas para o Deepsek para obter insights e análises, ou acessar este menu de ajuda a qualquer momento.
        </p>
      </div>
    </div>
  );
}
