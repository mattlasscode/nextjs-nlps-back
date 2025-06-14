'use client';

import { motion } from 'framer-motion';

interface SuccessStepProps {
  apiKey: string;
  storeUrl: string;
}

export default function SuccessStep({ apiKey, storeUrl }: SuccessStepProps) {
  const embedCode = `<script src="https://nlps2-np47kmsrd-mattlasscodes-projects.vercel.app/embed.js?apiKey=${apiKey}"></script>`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
        <p className="text-gray-600">
          Your NLP Search is ready to use. Add the code below to your website.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Your API Key</h3>
          <div className="relative">
            <input
              type="text"
              value={apiKey}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(apiKey);
                alert('API key copied to clipboard!');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Embed Code</h3>
          <div className="relative">
            <input
              type="text"
              value={embedCode}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(embedCode);
                alert('Embed code copied to clipboard!');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
            >
              Copy
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Add this single line of code to your website's HTML, just before the closing &lt;/body&gt; tag. That's it—no other code needed!
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Quick Start Guide</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>Copy the embed code above</li>
            <li>Open your website's HTML editor</li>
            <li>Paste the code just before the &lt;/body&gt; tag</li>
            <li>Save and publish your changes</li>
            <li>The search bar will automatically appear at the top of your page</li>
          </ol>
        </div>

        <div className="text-center">
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View Your Store
            <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
} 