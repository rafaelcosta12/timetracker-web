import { useState, useEffect } from 'react';
import type { Note } from './Note';


export interface EditNoteModalProps {
  open: boolean
  note: Note | null
  onSave: (updatedNote: Note) => void
  onDelete: () => void
  onClose: () => void
}

export function EditNoteModal({ open, note, onSave, onDelete, onClose }: EditNoteModalProps) {
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    setContent(note?.content || '');
  }, [note]);

  if (!open || !note) return null;

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
            onChange={e => setContent(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Remover
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              onSave({ ...note, content });
              onClose();
            }}
            disabled={content.trim() === ''}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
