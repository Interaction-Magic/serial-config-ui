// We'll fetch the configuration data from config.json
let data = {}; // Initialize empty object that will be populated after fetch

// Function to render the settings
function renderSettings() {
  const container = document.getElementById('settings-container');
  
  data.groups.forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'settings-group';
    
    const titleEl = document.createElement('h2');
    titleEl.className = 'group-title';
    titleEl.textContent = group.name;
    groupEl.appendChild(titleEl);
    
    group.options.forEach(option => {
      const optionEl = document.createElement('div');
      optionEl.className = 'option';
      
      const nameEl = document.createElement('div');
      nameEl.className = 'option-name';
      nameEl.textContent = option.name;
      optionEl.appendChild(nameEl);
      
      // Create the appropriate input based on type
      let inputEl;
      
      if (option.type === 'select') {
        inputEl = document.createElement('select');
        
        // Handle different formats of options
        let optionsList = [];
        if (typeof option.options === 'string') {
          if (option.options.includes('A-Z')) {
            // Create A-Z options
            for (let i = 65; i <= 90; i++) {
              optionsList.push(String.fromCharCode(i));
            }
          }
          if (option.options.includes('0-9')) {
            // Create 0-9 options
            for (let i = 0; i <= 9; i++) {
              optionsList.push(i.toString());
            }
          }
          
          // If comma-separated list
          if (option.options.includes(',')) {
            optionsList = option.options.split(',');
          }
        } else if (Array.isArray(option.options)) {
          optionsList = option.options;
        }
        
        // Create option elements
        optionsList.forEach(opt => {
          const optEl = document.createElement('option');
          optEl.value = opt;
          optEl.textContent = opt;
          if (opt === option.value) {
            optEl.selected = true;
          }
          inputEl.appendChild(optEl);
        });
        
      } else if (option.type === 'numeric') {
        inputEl = document.createElement('input');
        inputEl.type = 'number';
        inputEl.min = option.min;
        inputEl.max = option.max;
        inputEl.value = option.value;

		  // Add step attribute - you can customize the step value
			inputEl.step = option.step || 100; // Default to 100 if not specified in the option
        
      } else if (option.type === 'toggle') {
        inputEl = document.createElement('input');
        inputEl.type = 'checkbox';
        inputEl.checked = option.value;
      }
      
      optionEl.appendChild(inputEl);
      groupEl.appendChild(optionEl);
    });
    
    container.appendChild(groupEl);
  });
}

// Initialize the page - fetch config first, then render
document.addEventListener('DOMContentLoaded', () => {
  // Fetch the configuration from the JSON file
  fetch('example.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(config => {
      data = config; // Assign the loaded config to our data variable
      renderSettings(); // Now render the settings
    })
    .catch(error => {
      console.error('Error loading configuration:', error);
      document.getElementById('settings-container').innerHTML = 
        '<div class="error">Error loading configuration. Please check console for details.</div>';
    });
});