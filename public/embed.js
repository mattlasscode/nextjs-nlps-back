// NLP Search Embed Script
(function() {
  // Default configuration
  const defaultConfig = {
    apiKey: null,
    apiEndpoint: 'https://your-domain.com/api/search',
    container: 'nlp-search-container',
    position: 'top',
    placeholder: 'Search properties...',
    minChars: 2,
    debounceMs: 300,
    maxResults: 10,
    styles: {
      container: {
        width: '100%',
        maxWidth: '600px',
        margin: '24px auto',
        position: 'relative',
        zIndex: 9999
      },
      input: {
        width: '100%',
        padding: '12px 20px',
        fontSize: '16px',
        border: '2px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
        outline: 'none',
        marginBottom: '0',
      },
      results: {
        position: 'absolute',
        width: '100%',
        maxHeight: '400px',
        overflowY: 'auto',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        zIndex: 10000,
        marginTop: '2px',
      },
      resultItem: {
        display: 'flex',
        padding: '12px',
        borderBottom: '1px solid #eee',
        cursor: 'pointer',
        background: 'white',
        transition: 'background 0.2s',
      },
      resultItemHover: {
        background: '#f5f5f5',
      },
      image: {
        width: '80px',
        height: '80px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginRight: '12px',
      },
      content: {
        flex: 1,
      },
      title: {
        fontWeight: 'bold',
        fontSize: '16px',
        marginBottom: '4px',
      },
      price: {
        fontSize: '18px',
        color: '#2c5282',
        marginBottom: '4px',
      },
      location: {
        fontSize: '14px',
        color: '#666',
      },
      features: {
        fontSize: '12px',
        color: '#888',
        marginTop: '4px',
      }
    }
  };

  // Get API key from script URL
  function getApiKey() {
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
      if (script.src.includes('embed.js')) {
        const url = new URL(script.src);
        return url.searchParams.get('apiKey');
      }
    }
    return null;
  }

  // Utility to apply styles
  function applyStyles(el, styles) {
    for (const key in styles) {
      el.style[key] = styles[key];
    }
  }

  // Create global namespace
  window.NLPSearch = {
    _initialized: false,
    _config: null,
    _container: null,
    _input: null,
    _results: null,
    _debounceTimer: null,

    init: function(config) {
      if (this._initialized) {
        console.warn('NLP Search: Already initialized');
        return;
      }

      this._config = { ...defaultConfig, ...config };
      if (!this._config.apiKey) {
        this._config.apiKey = getApiKey();
      }

      if (!this._config.apiKey) {
        console.error('NLP Search: API key is required');
        return;
      }

      this._createElements();
      this._setupEventListeners();
      this._initialized = true;
    },

    _createElements: function() {
      // Create container
      this._container = document.createElement('div');
      this._container.id = this._config.container;
      applyStyles(this._container, this._config.styles.container);

      // Create input
      this._input = document.createElement('input');
      this._input.type = 'text';
      this._input.placeholder = this._config.placeholder;
      applyStyles(this._input, this._config.styles.input);

      // Create results container
      this._results = document.createElement('div');
      applyStyles(this._results, this._config.styles.results);
      this._results.style.display = 'none';

      // Assemble
      this._container.appendChild(this._input);
      this._container.appendChild(this._results);

      // Insert into page
      const target = document.querySelector(this._config.position === 'top' ? 'body' : 'footer');
      if (target) {
        target.insertBefore(this._container, target.firstChild);
      }
    },

    _setupEventListeners: function() {
      // Input event
      this._input.addEventListener('input', (e) => {
        clearTimeout(this._debounceTimer);
        const query = e.target.value;

        if (query.length < this._config.minChars) {
          this._results.style.display = 'none';
          return;
        }

        this._debounceTimer = setTimeout(() => {
          this._search(query);
        }, this._config.debounceMs);
      });

      // Click outside to close
      document.addEventListener('click', (e) => {
        if (!this._container.contains(e.target)) {
          this._results.style.display = 'none';
        }
      });
    },

    _search: async function(query) {
      try {
        const response = await fetch(this._config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this._config.apiKey}`
          },
          body: JSON.stringify({ query })
        });

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        this._displayResults(data.results);
      } catch (error) {
        console.error('NLP Search error:', error);
        this._results.innerHTML = '<div style="padding: 12px; color: #d32f2f;">Search failed. Please try again.</div>';
        this._results.style.display = 'block';
      }
    },

    _displayResults: function(results) {
      this._results.innerHTML = '';
      
      if (!results.length) {
        this._results.innerHTML = '<div style="padding: 12px; color: #666;">No results found</div>';
        this._results.style.display = 'block';
        return;
      }

      results.slice(0, this._config.maxResults).forEach(result => {
        const item = document.createElement('div');
        applyStyles(item, this._config.styles.resultItem);

        const image = document.createElement('img');
        image.src = result.images[0]?.url || 'placeholder.jpg';
        applyStyles(image, this._config.styles.image);

        const content = document.createElement('div');
        applyStyles(content, this._config.styles.content);

        const title = document.createElement('div');
        title.textContent = result.title;
        applyStyles(title, this._config.styles.title);

        const price = document.createElement('div');
        price.textContent = `$${result.price.toLocaleString()}`;
        applyStyles(price, this._config.styles.price);

        const location = document.createElement('div');
        location.textContent = result.location;
        applyStyles(location, this._config.styles.location);

        const features = document.createElement('div');
        features.textContent = `${result.bedrooms} bed • ${result.bathrooms} bath • ${result.squareFeet} sqft`;
        applyStyles(features, this._config.styles.features);

        content.appendChild(title);
        content.appendChild(price);
        content.appendChild(location);
        content.appendChild(features);

        item.appendChild(image);
        item.appendChild(content);

        item.addEventListener('click', () => {
          window.location.href = result.url;
        });

        item.addEventListener('mouseover', () => {
          applyStyles(item, this._config.styles.resultItemHover);
        });

        item.addEventListener('mouseout', () => {
          applyStyles(item, this._config.styles.resultItem);
        });

        this._results.appendChild(item);
      });

      this._results.style.display = 'block';
    }
  };

  // Auto-initialize if script has data-init attribute
  const script = document.currentScript;
  if (script && script.hasAttribute('data-init')) {
    window.NLPSearch.init();
  }
})(); 