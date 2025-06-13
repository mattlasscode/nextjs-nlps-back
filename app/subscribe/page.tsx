'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  maxProducts: number;
  maxStores: number;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    features: [
      'Up to 1,000 products',
      '1 store',
      'Basic search analytics',
      'Email support'
    ],
    maxProducts: 1000,
    maxStores: 1
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    features: [
      'Up to 10,000 products',
      '3 stores',
      'Advanced search analytics',
      'Priority support',
      'Custom styling'
    ],
    maxProducts: 10000,
    maxStores: 3
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    features: [
      'Unlimited products',
      'Unlimited stores',
      'Advanced analytics',
      '24/7 support',
      'Custom integration',
      'Dedicated account manager'
    ],
    maxProducts: -1,
    maxStores: -1
  }
];

export default function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [storeUrl, setStoreUrl] = useState('');
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setStep(2);
  };

  const handleStoreSubmit = () => {
    // Generate a mock API key
    const mockApiKey = `nlp_${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(mockApiKey);
    setStep(3);
  };

  const getEmbedCode = () => {
    if (!isClient) return '';
    return `<script src="${window.location.origin}/embed.js"></script>
<script>
  window.NLPSearch.init({
    apiKey: '${apiKey}',
    storeUrl: '${storeUrl}'
  });
</script>`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose Your Plan
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Select the perfect plan for your business needs
          </p>
        </div>

        {step === 1 && (
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-4 text-4xl font-extrabold text-gray-900">
                    ${plan.price}
                    <span className="text-base font-medium text-gray-500">/month</span>
                  </p>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePlanSelect(plan)}
                    className="mt-8 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Select Plan
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 max-w-lg mx-auto"
          >
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Store Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="storeUrl" className="block text-sm font-medium text-gray-700">
                    Store URL
                  </label>
                  <input
                    type="url"
                    id="storeUrl"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    placeholder="https://your-store.com"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <button
                  onClick={handleStoreSubmit}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
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
        )}
      </div>
    </div>
  );
} 