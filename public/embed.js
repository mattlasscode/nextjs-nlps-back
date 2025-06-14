// NLP Search Embed Script
(function() {
  // Default configuration
  const defaultConfig = {
    apiKey: null,
    apiEndpoint: 'https://nlps2-h4pe9d6vr-mattlasscodes-projects.vercel.app/api/search',
    container: 'nlp-search-container',
    position: 'top',
    placeholder: 'Search products...',
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
      loading: {
        padding: '12px',
        textAlign: 'center',
        color: '#888',
        fontSize: '15px',
      },
      error: {
        padding: '12px',
        textAlign: 'center',
        color: '#d32f2f',
        fontSize: '15px',
      },
      resultItem: {
        padding: '12px',
        borderBottom: '1px solid #eee',
        cursor: 'pointer',
        background: 'white',
        transition: 'background 0.2s',
      },
      resultItemHover: {
        background: '#f5f5f5',
      },
      title: {
        fontWeight: 'bold',
        fontSize: '16px',
        marginBottom: '2px',
      },
      description: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '2px',
      },
      price: {
        fontSize: '15px',
        color: '#222',
        fontWeight: '500',
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
    _loading: null,
    _debounceTimer: null,

    init: function(config) {
      if (this._initialized) {
        console.warn('NLP Search: Already initialized');
        return;
      }
      this._config = { ...defaultConfig, ...config };
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
      // Insert at top of body
      document.body.insertBefore(this._container, document.body.firstChild);

      // Create input
      this._input = document.createElement('input');
      this._input.type = 'text';
      this._input.placeholder = this._config.placeholder;
      this._input.autocomplete = 'off';
      applyStyles(this._input, this._config.styles.input);
      this._container.appendChild(this._input);

      // Create results container
      this._results = document.createElement('div');
      this._results.style.display = 'none';
      applyStyles(this._results, this._config.styles.results);
      this._container.appendChild(this._results);

      // Create loading indicator
      this._loading = document.createElement('div');
      this._loading.innerText = 'Searching...';
      this._loading.style.display = 'none';
      applyStyles(this._loading, this._config.styles.loading);
      this._container.appendChild(this._loading);
    },

    _setupEventListeners: function() {
      this._input.addEventListener('input', (e) => {
        clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
          const query = e.target.value.trim();
          if (query.length >= this._config.minChars) {
            this._searchProducts(query);
          } else {
            this._results.style.display = 'none';
          }
        }, this._config.debounceMs);
      });
      document.addEventListener('click', (e) => {
        if (!this._container.contains(e.target)) {
          this._results.style.display = 'none';
        }
      });
    },

    async _searchProducts(query) {
      try {
        this._loading.style.display = 'block';
        this._results.style.display = 'none';
        this._results.innerHTML = '';
        const response = await fetch(this._config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this._config.apiKey
          },
          body: JSON.stringify({ query })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const results = await response.json();
        this._displayResults(results);
      } catch (error) {
        this._results.innerHTML = '';
        const errorDiv = document.createElement('div');
        applyStyles(errorDiv, this._config.styles.error);
        errorDiv.innerText = 'An error occurred while searching. Please try again.';
        this._results.appendChild(errorDiv);
        this._results.style.display = 'block';
      } finally {
        this._loading.style.display = 'none';
      }
    },

    _displayResults(results) {
      this._results.innerHTML = '';
      if (!results || results.length === 0) {
        const noResults = document.createElement('div');
        applyStyles(noResults, this._config.styles.loading);
        noResults.innerText = 'No results found';
        this._results.appendChild(noResults);
      } else {
        results.slice(0, this._config.maxResults).forEach(result => {
          const resultItem = document.createElement('div');
          applyStyles(resultItem, this._config.styles.resultItem);
          resultItem.onmouseenter = () => applyStyles(resultItem, { background: '#f5f5f5' });
          resultItem.onmouseleave = () => applyStyles(resultItem, { background: 'white' });
          resultItem.innerHTML = `
            <div style="${styleString(this._config.styles.title)}">${result.title || ''}</div>
            <div style="${styleString(this._config.styles.description)}">${result.description || ''}</div>
            <div style="${styleString(this._config.styles.price)}">${result.price || ''}</div>
          `;
          resultItem.addEventListener('click', () => {
            if (result.url) {
              window.location.href = result.url;
            }
          });
          this._results.appendChild(resultItem);
        });
      }
      this._results.style.display = 'block';
    }
  };

  // Helper to convert style object to inline style string
  function styleString(styleObj) {
    return Object.entries(styleObj).map(([k, v]) => `${k}:${v}`).join(';');
  }

  // Auto-initialize if apiKey is present in script URL
  const apiKey = getApiKey();
  if (apiKey) {
    window.NLPSearch.init({ apiKey });
  }
})(); 