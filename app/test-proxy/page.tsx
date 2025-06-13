'use client';

import { useState } from 'react';

export default function TestProxy() {
  const [url, setUrl] = useState('https://nextjs-nlps-front.vercel.app');
  const [apiKey, setApiKey] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');

  const generateProxyUrl = () => {
    const proxyUrl = `https://nextjs-nlps-back.vercel.app/api/proxy?url=${encodeURIComponent(url)}&apiKey=${apiKey}`;
    setProxyUrl(proxyUrl);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Test Proxy Integration</h3>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  Target URL
                </label>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                  API Key
                </label>
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <button
                onClick={generateProxyUrl}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Generate Proxy URL
              </button>

              {proxyUrl && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Proxy URL</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      readOnly
                      value={proxyUrl}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(proxyUrl);
                        alert('Proxy URL copied to clipboard!');
                      }}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Open this URL in a new tab to see the search bar injected into your website.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 