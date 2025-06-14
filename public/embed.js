// NLP Search Embed Script
(function() {
  // Default configuration
  const defaultConfig = {
    apiKey: null,
    apiEndpoint: 'https://nlps2-h4pe9d6vr-mattlasscodes-projects.vercel.app/api/search',
    container: 'nlp-search-container',
    position: 'top', // 'top', 'bottom', or 'custom'
    customSelector: null, // CSS selector for custom position
    placeholder: 'Search products...',
    minChars: 2,
    debounceMs: 300,
    maxResults: 10,
    styles: {
      container: {
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        position: 'relative'
      },
      input: {
        width: '100%',
        padding: '12px 20px',
        fontSize: '16px',
        border: '2px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box'
      },
      results: {
        position: 'absolute',
        width: '100%',
        maxHeight: '400px',
        overflowY: 'auto',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: '1000'
      }
    },
    onInit: null,
    onError: null,
    onResults: null,
    onSelect: null
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

  // Create global namespace
  window.NLPSearch = {
    // Track initialization state
    _initialized: false,
    _config: null,
    _container: null,
    _input: null,
    _results: null,
    _loading: null,
    _debounceTimer: null,

    // Initialize the search bar
    init: function(config) {
      // Prevent multiple initializations
      if (this._initialized) {
        console.warn('NLP Search: Already initialized');
        return;
      }

      // Merge config with defaults
      this._config = { ...defaultConfig, ...config };

      // Validate required config
      if (!this._config.apiKey) {
        console.error('NLP Search: API key is required');
        return;
      }

      try {
        this._createElements();
        this._setupEventListeners();
        this._initialized = true;
        
        // Call onInit callback if provided
        if (typeof this._config.onInit === 'function') {
          this._config.onInit();
        }
      } catch (error) {
        console.error('NLP Search: Failed to initialize:', error);
      }
    },

    // Create DOM elements
    _createElements: function() {
      // Create or get container
      this._container = document.getElementById(this._config.container);
      if (!this._container) {
        this._container = document.createElement('div');
        this._container.id = this._config.container;
        
        // Apply container styles
        Object.assign(this._container.style, this._config.styles.container);
        
        // Position the container
        if (this._config.position === 'custom' && this._config.customSelector) {
          const target = document.querySelector(this._config.customSelector);
          if (target) {
            target.appendChild(this._container);
          } else {
            document.body.insertBefore(this._container, document.body.firstChild);
          }
        } else if (this._config.position === 'bottom') {
          document.body.appendChild(this._container);
        } else {
          document.body.insertBefore(this._container, document.body.firstChild);
        }
      }

      // Create search input
      this._input = document.createElement('input');
      this._input.type = 'text';
      this._input.placeholder = this._config.placeholder;
      this._input.className = 'nlp-search-input';
      Object.assign(this._input.style, this._config.styles.input);

      // Create results container
      this._results = document.createElement('div');
      this._results.className = 'nlp-search-results';
      Object.assign(this._results.style, this._config.styles.results);
      this._results.style.display = 'none';

      // Create loading indicator
      this._loading = document.createElement('div');
      this._loading.className = 'nlp-search-loading';
      this._loading.style.display = 'none';
      this._loading.innerHTML = 'Searching...';

      // Add elements to container
      this._container.appendChild(this._input);
      this._container.appendChild(this._results);
      this._container.appendChild(this._loading);
    },

    // Setup event listeners
    _setupEventListeners: function() {
      // Input event with debouncing
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

      // Close results when clicking outside
      document.addEventListener('click', (e) => {
        if (!this._container.contains(e.target)) {
          this._results.style.display = 'none';
        }
      });
    },

    // Search products
    async _searchProducts(query) {
      try {
        this._loading.style.display = 'block';
        this._results.style.display = 'block';
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
        console.error('Search error:', error);
        this._results.innerHTML = `
          <div class="p-4 text-red-500">
            An error occurred while searching. Please try again.
          </div>
        `;
      } finally {
        this._loading.style.display = 'none';
      }
    },

    // Display search results
    _displayResults(results) {
      this._results.innerHTML = '';
      
      if (!results || results.length === 0) {
        this._results.innerHTML = '<div class="p-4 text-gray-500">No results found</div>';
      } else {
        results.slice(0, this._config.maxResults).forEach(result => {
          const resultItem = document.createElement('div');
          resultItem.className = 'p-4 border-b hover:bg-gray-50 cursor-pointer';
          resultItem.innerHTML = `
            <h3 class="font-medium">${result.title || ''}</h3>
            <p class="text-sm text-gray-600">${result.description || ''}</p>
            <p class="text-sm font-medium text-gray-900 mt-1">${result.price || ''}</p>
          `;
          
          resultItem.addEventListener('click', () => {
            if (typeof this._config.onSelect === 'function') {
              this._config.onSelect(result);
            }
            if (result.url) {
              window.location.href = result.url;
            }
          });
          
          this._results.appendChild(resultItem);
        });
      }

      this._results.style.display = 'block';
      
      // Call onResults callback if provided
      if (typeof this._config.onResults === 'function') {
        this._config.onResults(results);
      }
    },

    // Handle errors
    _handleError(error) {
      console.error('NLP Search:', error);
      
      if (this._results) {
        this._results.innerHTML = `
          <div class="p-4 text-red-500">
            ${error}
          </div>
        `;
        this._results.style.display = 'block';
      }
      
      // Call onError callback if provided
      if (typeof this._config.onError === 'function') {
        this._config.onError(error);
      }
    }
  };

  // Auto-initialize if apiKey is present in script URL
  const apiKey = getApiKey();
  if (apiKey) {
    window.NLPSearch.init({ apiKey });
  }
})(); 