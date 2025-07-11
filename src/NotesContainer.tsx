import { useState, useEffect } from 'react';
import { DeepsekResponseModal } from './DeepsekResponseModal';
import { EditNoteModal } from './EditNoteModal';
import { NoteForm } from './NoteForm';
import type { Note } from './Note';

export const NotesContainer = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editNoteIdx, setEditNoteIdx] = useState<number | null>(null);

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

        if (command === 'send') {
          sendToDeepsek(inputCommandArray.join(' '));
          return;
        } else {
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
        <NoteForm addNote={addNote} />
      </div>
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
