import axios from 'axios';
import * as cheerio from 'cheerio';

export interface Product {
  title: string;
  description: string;
  url?: string;
  image?: string;
  price?: string;
  sku?: string;
}

export interface ScraperConfig {
  name: string;
  baseUrl: string;
  selectors: {
    productContainer: string;
    title: string;
    description?: string;
    price?: string;
    image?: string;
    url?: string;
    sku?: string;
  };
  headers?: Record<string, string>;
  pagination?: {
    enabled: boolean;
    selector?: string;
    maxPages?: number;
  };
}

const defaultHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Cache-Control': 'max-age=0'
};

export async function scrapeProducts(config: ScraperConfig): Promise<Product[]> {
  try {
    const products: Product[] = [];
    let currentPage = 1;
    const maxPages = config.pagination?.maxPages || 1;

    while (currentPage <= maxPages) {
      const url = config.pagination?.enabled 
        ? `${config.baseUrl}${config.pagination.selector?.replace('{page}', currentPage.toString())}`
        : config.baseUrl;

      const response = await axios.get(url, {
        headers: { ...defaultHeaders, ...config.headers }
      });

      const $ = cheerio.load(response.data);
      const productElements = $(config.selectors.productContainer);

      productElements.each((_, element) => {
        const product: Product = {
          title: $(element).find(config.selectors.title).text().trim(),
          description: config.selectors.description 
            ? $(element).find(config.selectors.description).text().trim()
            : '',
        };

        if (config.selectors.price) {
          product.price = $(element).find(config.selectors.price).text().trim();
        }

        if (config.selectors.image) {
          const imageUrl = $(element).find(config.selectors.image).attr('src');
          product.image = imageUrl?.startsWith('http') ? imageUrl : `${config.baseUrl}${imageUrl}`;
        }

        if (config.selectors.url) {
          const productUrl = $(element).find(config.selectors.url).attr('href');
          product.url = productUrl?.startsWith('http') ? productUrl : `${config.baseUrl}${productUrl}`;
        }

        if (config.selectors.sku) {
          product.sku = $(element).find(config.selectors.sku).text().trim();
        }

        products.push(product);
      });

      if (!config.pagination?.enabled) break;
      currentPage++;
    }

    return products;
  } catch (error) {
    console.error(`Error scraping ${config.name}:`, error);
    throw error;
  }
}

// Example configurations for different e-commerce platforms
export const scraperConfigs: Record<string, ScraperConfig> = {
  gibert: {
    name: 'Gibert',
    baseUrl: 'https://www.gibert.com',
    selectors: {
      productContainer: '.product-item',
      title: '.product-name a',
      description: '.product-description',
      price: '.price',
      image: 'img',
      url: '.product-name a'
    },
    pagination: {
      enabled: true,
      selector: '/livres/livres-nouveaute-7702.html?page={page}',
      maxPages: 3
    }
  },
  // Add more configurations for different e-commerce platforms
  shopify: {
    name: 'Shopify',
    baseUrl: '', // Will be set dynamically
    selectors: {
      productContainer: '.product-item',
      title: '.product-title',
      description: '.product-description',
      price: '.product-price',
      image: '.product-image img',
      url: '.product-link'
    },
    pagination: {
      enabled: true,
      selector: '?page={page}',
      maxPages: 10
    }
  }
}; 