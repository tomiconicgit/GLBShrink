export default class UIManager {
    constructor(optionsSchema) {
        this.panel = document.getElementById('ui-panel');
        this.schema = optionsSchema;
        this.config = {};
        this.onOptionChange = () => {}; // Callback for when config changes

        this._buildPanel();
        this._initDefaultConfig();
    }

    getCurrentConfig() {
        return this.config;
    }

    _initDefaultConfig() {
        for (const category in this.schema) {
            const options = this.schema[category];
            if (category === 'Gear') { // Toggles
                options.forEach(opt => this.config[opt] = true); // Default to on
            } else { // Selectors
                this.config[category] = options[0]; // Default to first option
            }
        }
    }

    _buildPanel() {
        for (const category in this.schema) {
            const options = this.schema[category];
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';

            const title = document.createElement('div');
            title.className = 'category-title';
            title.textContent = category;
            categoryDiv.appendChild(title);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'options';
            categoryDiv.appendChild(optionsDiv);

            if (category === 'Gear') {
                // These are toggle buttons
                options.forEach(opt => this._createToggleButton(optionsDiv, opt));
            } else {
                // These are selection buttons (only one can be active)
                options.forEach(opt => this._createSelectionButton(optionsDiv, category, opt));
            }
            this.panel.appendChild(categoryDiv);
        }
    }

    _createSelectionButton(container, category, option) {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.dataset.category = category;
        btn.dataset.option = option;
        
        // Activate the first button by default
        if (this.schema[category][0] === option) {
            btn.classList.add('active');
        }

        btn.onclick = () => {
            // Update config and UI
            this.config[category] = option;
            container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.onOptionChange(this.config);
        };
        container.appendChild(btn);
    }

    _createToggleButton(container, option) {
        const btn = document.createElement('button');
        btn.className = 'option-btn active'; // Active by default
        btn.textContent = option;
        
        btn.onclick = () => {
            btn.classList.toggle('active');
            this.config[option] = btn.classList.contains('active');
            this.onOptionChange(this.config);
        };
        container.appendChild(btn);
    }
}
