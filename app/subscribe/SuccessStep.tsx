'use client';

import { motion } from 'framer-motion';

interface SuccessStepProps {
  apiKey: string;
  storeUrl: string;
}

export default function SuccessStep({ apiKey, storeUrl }: SuccessStepProps) {
  const getEmbedCode = () => {
    return `<script src="${window.location.origin}/embed.js"></script>
<script>
  window.NLPSearch.init({
    apiKey: '${apiKey}',
    storeUrl: '${storeUrl}'
  });
</script>`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Setup Complete!</h2>
          <p className="mt-2 text-gray-600">Your API key has been generated successfully.</p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Your API Key</h3>
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <code className="text-sm text-gray-800">{apiKey}</code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Embed Code</h3>
            <div className="mt-2">
              <pre className="p-4 bg-gray-50 rounded-md overflow-x-auto">
                <code className="text-sm text-gray-800">{getEmbedCode()}</code>
              </pre>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Copy and paste this code into your website's HTML, just before the closing &lt;/body&gt; tag.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 