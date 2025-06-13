// NLP Search Embed Script
(function() {
  // Create global namespace
  window.NLPSearch = {
    init: function(config) {
      if (!config.apiKey) {
        console.error('NLP Search: API key is required');
        return;
      }

      // Create search container if it doesn't exist
      let container = document.getElementById('nlp-search-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'nlp-search-container';
        document.body.insertBefore(container, document.body.firstChild);
      }

      // Create search input
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder = config.placeholder || 'Search...';
      searchInput.className = 'nlp-search-input';
      searchInput.style.cssText = `
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        box-sizing: border-box;
        border: 2px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
        transition: border-color 0.3s ease;
      `;

      // Create results container
      const resultsContainer = document.createElement('div');
      resultsContainer.className = 'nlp-search-results';
      resultsContainer.style.cssText = `
        position: absolute;
        width: 100%;
        max-height: 400px;
        overflow-y: auto;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        display: none;
        z-index: 1000;
      `;

      // Create loading indicator
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'nlp-search-loading';
      loadingIndicator.style.cssText = `
        display: none;
        text-align: center;
        padding: 20px;
        color: #666;
      `;
      loadingIndicator.innerHTML = 'Searching...';

      // Add event listeners
      let debounceTimer;
      searchInput.addEventListener('input', function(e) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const query = e.target.value.trim();
          if (query.length > 2) {
            searchProducts(query);
          } else {
            resultsContainer.style.display = 'none';
          }
        }, 300);
      });

      // Search function
      async function searchProducts(query) {
        try {
          loadingIndicator.style.display = 'block';
          resultsContainer.style.display = 'block';
          resultsContainer.innerHTML = '';

          const response = await fetch('https://nextjs-nlps-back.vercel.app/api/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': config.apiKey
            },
            body: JSON.stringify({ query })
          });

          if (!response.ok) {
            throw new Error('Search request failed');
          }

          const results = await response.json();
          displayResults(results);
        } catch (error) {
          console.error('Search error:', error);
          resultsContainer.innerHTML = `
            <div class="p-4 text-red-500">
              An error occurred while searching. Please try again.
            </div>
          `;
        } finally {
          loadingIndicator.style.display = 'none';
        }
      }

      // Display results
      function displayResults(results) {
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
          resultsContainer.innerHTML = '<div class="p-4 text-gray-500">No results found</div>';
        } else {
          results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'p-4 border-b hover:bg-gray-50 cursor-pointer';
            resultItem.innerHTML = `
              <h3 class="font-medium">${result.title}</h3>
              <p class="text-sm text-gray-600">${result.description}</p>
              <p class="text-sm font-medium text-gray-900 mt-1">${result.price}</p>
            `;
            resultItem.addEventListener('click', () => {
              window.location.href = result.url;
            });
            resultsContainer.appendChild(resultItem);
          });
        }

        resultsContainer.style.display = 'block';
      }

      // Add elements to container
      container.appendChild(searchInput);
      container.appendChild(resultsContainer);
      container.appendChild(loadingIndicator);

      // Close results when clicking outside
      document.addEventListener('click', function(e) {
        if (!container.contains(e.target)) {
          resultsContainer.style.display = 'none';
        }
      });
    }
  };
})(); 