'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaCode, FaRocket, FaShieldAlt } from 'react-icons/fa';
import { VisualEffect } from '../components/VisualEffects';
import Link from 'next/link';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export default function Home() {
  const [isCopied, setIsCopied] = useState(false);
  const [currentEffect, setCurrentEffect] = useState<'liquid' | 'dream' | 'psywave' | 'inkstorm' | 'flame' | 'spectral' | 'biolume' | 'neuron' | 'organic' | 'synaptic'>('liquid');

  const embedCode = `<script src="https://your-domain.com/embed.js" data-api-key="YOUR_API_KEY"></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Change effect every 5 seconds
  useEffect(() => {
    const effects = ['liquid', 'dream', 'psywave', 'inkstorm', 'flame', 'spectral', 'biolume', 'neuron', 'organic', 'synaptic'] as const;
    const interval = setInterval(() => {
      setCurrentEffect(effects[Math.floor(Math.random() * effects.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <VisualEffect type={currentEffect} />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            NLP Search
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your e-commerce search with AI-powered natural language processing
          </p>
          <Link href="/subscribe">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold"
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FaSearch className="w-8 h-8" />}
              title="Natural Language Search"
              description="Let your customers search using everyday language"
            />
            <FeatureCard
              icon={<FaCode className="w-8 h-8" />}
              title="Easy Integration"
              description="One line of code to add powerful search to your store"
            />
            <FeatureCard
              icon={<FaRocket className="w-8 h-8" />}
              title="Lightning Fast"
              description="Instant results with vector-based search"
            />
            <FeatureCard
              icon={<FaShieldAlt className="w-8 h-8" />}
              title="Secure & Reliable"
              description="Enterprise-grade security and 99.9% uptime"
            />
          </div>
        </div>
      </section>

      {/* Embed Code Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Get Started in Minutes</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Embed Code</h3>
              <button
                onClick={copyToClipboard}
                className="text-sm bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                {isCopied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-gray-300">{embedCode}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Starter"
              price="$49"
              features={[
                'Up to 1,000 products',
                'Basic search features',
                'Email support',
                '1 store'
              ]}
            />
            <PricingCard
              title="Professional"
              price="$99"
              features={[
                'Up to 10,000 products',
                'Advanced search features',
                'Priority support',
                '3 stores'
              ]}
              highlighted
            />
            <PricingCard
              title="Enterprise"
              price="Custom"
              features={[
                'Unlimited products',
                'Custom features',
                '24/7 support',
                'Unlimited stores'
              ]}
            />
          </div>
          <div className="text-center mt-12">
            <Link href="/subscribe">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold"
              >
                Choose Your Plan
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2024 NLP Search. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800 p-6 rounded-lg"
    >
      <div className="text-purple-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

function PricingCard({ title, price, features, highlighted = false }: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-6 rounded-lg ${
        highlighted
          ? 'bg-gradient-to-b from-purple-500 to-blue-500'
          : 'bg-gray-800'
      }`}
    >
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="text-4xl font-bold mb-6">{price}</div>
      <ul className="space-y-3">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center">
            <span className="mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={`mt-6 w-full py-2 rounded ${
          highlighted
            ? 'bg-white text-purple-500'
            : 'bg-purple-500 text-white'
        }`}
      >
        Get Started
      </button>
    </motion.div>
  );
}
