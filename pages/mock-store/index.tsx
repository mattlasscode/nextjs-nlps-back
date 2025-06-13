import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

// Sample products data
const sampleProducts = [
  {
    id: '1',
    title: 'Vintage Leather Backpack',
    description: 'Handcrafted genuine leather backpack with multiple compartments and adjustable straps. Perfect for daily use or travel.',
    price: '$129.99',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    url: '/products/vintage-leather-backpack'
  },
  {
    id: '2',
    title: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
    price: '$249.99',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    url: '/products/wireless-headphones'
  },
  {
    id: '3',
    title: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and water resistance up to 50m.',
    price: '$199.99',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    url: '/products/smart-fitness-watch'
  },
  {
    id: '4',
    title: 'Organic Cotton T-Shirt',
    description: 'Comfortable and eco-friendly t-shirt made from 100% organic cotton. Available in multiple colors and sizes.',
    price: '$29.99',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    url: '/products/organic-cotton-tshirt'
  },
  {
    id: '5',
    title: 'Stainless Steel Water Bottle',
    description: 'Double-walled insulated water bottle that keeps drinks cold for 24 hours and hot for 12 hours.',
    price: '$24.99',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    url: '/products/stainless-steel-bottle'
  }
];

export default function MockStore() {
  const [storeApiKey, setStoreApiKey] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if store is already registered
    const storedApiKey = localStorage.getItem('mockStoreApiKey');
    if (storedApiKey) {
      setStoreApiKey(storedApiKey);
      setIsRegistered(true);
    }
  }, []);

  useEffect(() => {
    // Initialize search bar when script is loaded and store is registered
    if (isScriptLoaded && isRegistered && storeApiKey) {
      // @ts-ignore - NLPSearch is loaded via script
      window.NLPSearch?.init({
        apiKey: storeApiKey,
        placeholder: 'Search our products...'
      });
    }
  }, [isScriptLoaded, isRegistered, storeApiKey]);

  const registerStore = async () => {
    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Mock Store',
          domain: 'localhost:3000',
          baseUrl: 'http://localhost:3000/mock-store',
        }),
      });

      const data = await response.json();
      setStoreApiKey(data.apiKey);
      localStorage.setItem('mockStoreApiKey', data.apiKey);
      setIsRegistered(true);

      // Load sample products
      await fetch('/api/load-sample-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: data.apiKey,
        }),
      });
    } catch (error) {
      console.error('Error registering store:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Mock Store - Test NLP Search</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Mock Store</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!isRegistered ? (
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Register Store</h2>
            <button
              onClick={registerStore}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Register Store
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div id="nlp-search-container"></div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sampleProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.description}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      {product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Script
        src="/embed.js"
        onLoad={() => setIsScriptLoaded(true)}
      />
    </div>
  );
} 