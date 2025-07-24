import { marked } from 'marked';
import { useState, useEffect } from 'react';
import type { DeepsekResponse } from './DeepsekResponse';
import { Loading } from './Loading';
import type { DeepsekRequestPromise } from './DeepsekRequestPromise';

export interface DeepsekResponseModalProps {
  open: boolean
  onClose: () => void
  response: DeepsekRequestPromise | null,
}

export function DeepsekResponseModal({ open, onClose, response }: DeepsekResponseModalProps) {
  if (!open) return null;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!response || !response.response) {
      setLoading(false);
      return;
    }

    setLoading(true);

    response.response
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao enviar notas para o Deepsek: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        const modelResponse = data?.choices?.[0]?.message?.content || 'Nenhuma resposta recebida.';
        if (!modelResponse) {
          throw new Error('Resposta vazia do Deepsek.');
        }
        var parsedMarkdown = marked.parse(modelResponse.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,""), { async: false})
        document.querySelector('.markdown-body')!.innerHTML = parsedMarkdown;
        
        setTimeout(() => {
          var responsesJson = localStorage.getItem('model_responses');
          const responses: DeepsekResponse[] = responsesJson ? JSON.parse(responsesJson) : [];
          localStorage.setItem('model_responses', JSON.stringify([{
            dateTime: new Date(),
            model: data.model,
            response: modelResponse,
            question: response.question,
          }, ...responses]));
        }, 100);
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
            <Loading text='Carregando resposta...' />
          ) : null}
          <div style={{all: 'initial'}}>
            <div className="markdown-body" />
          </div>
        </div>
      </div>
    </div>
  );
}
