import { useState, useEffect } from 'react';

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void; }) {
  if (!open) return null;
  const [deepsekApiKey, setDeepsekApiKey] = useState(localStorage.getItem('deepsek_key') || '');
  const [assistantName, setAssistantName] = useState(localStorage.getItem('assistant_name') || '');
  const [assistantSystemMessage, setAssistantSystemMessage] = useState(localStorage.getItem('assistant_system_message') || '');
  const [assistantDefaultUserMessage, setAssistantDefaultUserMessage] = useState(localStorage.getItem('assistant_default_user_message') || '');

  useEffect(() => {
    localStorage.setItem('deepsek_key', deepsekApiKey);
  }, [deepsekApiKey]);

  useEffect(() => {
    localStorage.setItem('assistant_name', assistantName);
  }, [assistantName]);

  useEffect(() => {
    localStorage.setItem('assistant_system_message', assistantSystemMessage);
  }, [assistantSystemMessage]);

  useEffect(() => {
    localStorage.setItem('assistant_default_user_message', assistantDefaultUserMessage);
  }, [assistantDefaultUserMessage]);

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
              onChange={e => setDeepsekApiKey(e.target.value)} />
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
                onChange={e => setAssistantName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensagem do Sistema</label>
              <textarea
                value={assistantSystemMessage}
                placeholder="Mensagem de instrução para o assistente"
                className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
                rows={3}
                onChange={e => setAssistantSystemMessage(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensagem padrão</label>
              <textarea
                value={assistantDefaultUserMessage}
                placeholder="Mensagem padrão para o assistente"
                className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
                rows={3}
                onChange={e => setAssistantDefaultUserMessage(e.target.value)} />
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
                  localStorage.removeItem('notes');
                  window.location.reload();
                }
              }}
            >
              Remover todas as notas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
