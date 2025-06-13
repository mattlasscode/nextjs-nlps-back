'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  maxProducts: number;
  maxStores: number;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$49',
    features: [
      'Up to 1,000 products',
      'Basic search features',
      'Email support',
      '1 store'
    ],
    maxProducts: 1000,
    maxStores: 1
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$99',
    features: [
      'Up to 10,000 products',
      'Advanced search features',
      'Priority support',
      '3 stores'
    ],
    maxProducts: 10000,
    maxStores: 3
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Unlimited products',
      'Custom features',
      '24/7 support',
      'Unlimited stores'
    ],
    maxProducts: -1,
    maxStores: -1
  }
];

export default function Subscribe() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [storeUrl, setStoreUrl] = useState('');
  const [step, setStep] = useState<'plan' | 'details' | 'success'>('plan');
  const [apiKey, setApiKey] = useState('');

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a mock API key
    const mockApiKey = `nlp_${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(mockApiKey);
    
    // Simulate API call to create store
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStep('success');
  };

  const embedCode = `<script src="${window.location.origin}/embed.js" data-api-key="${apiKey}"></script>`;

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-8 rounded-lg"
          >
            <h1 className="text-3xl font-bold mb-6">Setup Complete!</h1>
            <p className="text-gray-300 mb-6">
              Your store has been successfully set up. Here's your embed code:
            </p>
            <div className="bg-gray-900 p-4 rounded mb-6">
              <pre className="text-sm overflow-x-auto">
                <code>{embedCode}</code>
              </pre>
            </div>
            <p className="text-gray-300 mb-6">
              Add this code to your website's HTML, just before the closing &lt;/body&gt; tag.
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(embedCode)}
              className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition-colors"
            >
              Copy Code
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (step === 'details') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-8 rounded-lg"
          >
            <h1 className="text-3xl font-bold mb-6">Store Details</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Store URL</label>
                <input
                  type="url"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder="https://your-store.com"
                  required
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('plan')}
                  className="text-gray-300 hover:text-white"
                >
                  ← Back to Plans
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition-colors"
                >
                  Complete Setup
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-16">Choose Your Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-lg ${
                selectedPlan === plan.id
                  ? 'bg-gradient-to-b from-purple-500 to-blue-500'
                  : 'bg-gray-800'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-6">{plan.price}</div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-2 rounded ${
                  selectedPlan === plan.id
                    ? 'bg-white text-purple-500'
                    : 'bg-purple-500 text-white'
                }`}
              >
                Select Plan
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 