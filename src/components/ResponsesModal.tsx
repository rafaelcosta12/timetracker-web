import { useState, useEffect } from 'react';
import { Loading } from './Loading';
import type { DeepsekResponse } from './DeepsekResponse';
import { marked } from 'marked';


export function ResponsesModal({ open, onClose }: { open: boolean; onClose: () => void; }) {
  if (!open) return null;
  const [responses, setResponses] = useState<DeepsekResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedResponse, setSelectedResponse] = useState<DeepsekResponse | null>(null);
  
  useEffect(() => {
    const responsesJson = localStorage.getItem('model_responses');
    if (responsesJson) {
      setResponses(JSON.parse(responsesJson).map((i: any) => {
        return { model: i.model, response: i.response, dateTime: new Date(i.dateTime), question: i.question };
      }));
    }
    setLoading(false);
  }, []);
  
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
        { selectedResponse ? (
          <ParsedResponse response={selectedResponse} />
        ) : 
        (
          <>
            <h2 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-200">Iterações anteriores</h2>
            {loading ? (<Loading text='Carregando iterações...' />) : null}
            <div className="space-y-4 max-h-[70vh] overflow-auto">
              {responses.length > 0 ? (
                responses.map((response, index) => (
                  <div onClick={() => setSelectedResponse(response)} key={index} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                    <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">{response.dateTime.toLocaleString('pt-BR')}</h3>
                    <p className="text-gray-900 dark:text-gray-100">{response.question || 'Unknown'}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Nenhuma resposta encontrada.</p>
              )}
            </div>
          </>
        )
      }
      </div>
    </div>
  );
}


function ParsedResponse({ response }: { response: DeepsekResponse }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
        {response.dateTime.toLocaleString('pt-BR')}
      </h3>
      <div style={{ all: 'initial' }}>
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: marked.parse(response.response) }} />
      </div>
    </div>
  );
}

