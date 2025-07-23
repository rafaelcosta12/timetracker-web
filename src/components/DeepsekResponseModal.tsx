import { marked } from 'marked';
import { useState, useEffect } from 'react';

export interface DeepsekResponseModalProps {
  open: boolean
  onClose: () => void
  response: Promise<Response> | null
}

export function DeepsekResponseModal({ open, onClose, response }: DeepsekResponseModalProps) {
  if (!open) return null;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!response) {
      setLoading(false);
      return;
    }
    setLoading(true);

    response
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao enviar notas para o Deepsek: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        const modelResponse = data?.choices?.[0]?.message?.content || 'Nenhuma resposta recebida.';
        var markdown = marked.parse(modelResponse.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,""), { async: false})
        document.querySelector('.markdown-body')!.innerHTML = markdown;
      })
      .catch(error => {
        alert('Erro ao enviar notas para o Deepsek. Verifique o console para mais detalhes e tente novamente.');
        console.error('Erro ao enviar notas para o Deepsek:', error);
      })
      .finally(() => setLoading(false));
  }, [response]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-[2vh] w-full m-[2vh] relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-blue-600"
          onClick={onClose}
          aria-label="Fechar"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path d="M6 6l12 12M6 18L18 6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-200">Resposta do Deepsek</h2>
        <div className="whitespace-pre-line text-gray-800 dark:text-gray-100 max-h-[70vh] overflow-y-auto min-h-[3rem]">
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
                  fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Carregando resposta...
            </span>
          ) : null}
          <div style={{all: 'initial'}}>
            <div className="markdown-body" />
          </div>
        </div>
      </div>
    </div>
  );
}
