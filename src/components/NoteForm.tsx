import { useState } from 'react';


export const NoteForm = (props: { addNote: (input: string) => void; }) => {
  const [input, setInput] = useState('');

  const addNote = () => {
    if (input.trim()) {
      props.addNote(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      setInput(input + '\n');
    }
    else if (e.key === 'Enter') {
      e.preventDefault();
      addNote();
    }
  }

  return (
    <div className="grid h-[13vh]">
      <textarea
        style={{ resize: 'none' }}
        value={input}
        onChange={e => setInput(e.target.value)}
        autoFocus
        placeholder="Digite uma nova nota... ou /? para ver os comandos disponíveis"
        className="flex-1 px-3 py-2 rounded-md border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
        rows={3}
        onKeyDown={handleKeyDown} />
    </div>
  );
};
