import { useState, useEffect } from 'react';

export interface DeepsekResponseModalProps {
  open: boolean
  onClose: () => void
  response: Promise<Response> | null
}

export function DeepsekResponseModal({ open, onClose, response }: DeepsekResponseModalProps) {
  if (!open) return null;
  const [deepsekResponse, setDeepsekResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!response) {
      setDeepsekResponse('');
      setLoading(false);
      return;
    }
    setLoading(true);
    setDeepsekResponse('');
    response
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao enviar notas para o Deepsek: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        const modelResponse = data?.choices?.[0]?.message?.content || 'Nenhuma resposta recebida.';
        setDeepsekResponse(modelResponse);
      })
      .catch(error => {
        setDeepsekResponse('Erro ao enviar notas para o Deepsek. Verifique o console para mais detalhes e tente novamente.');
        console.error('Erro ao enviar notas para o Deepsek:', error);
      })
      .finally(() => setLoading(false));
  }, [response]);

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
                  fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
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
  );
}
