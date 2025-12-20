// ring-builder.js
import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

class RingBuilder extends LitElement {
  static get properties() {
    return {
      ringType: { type: String },
      shape:    { type: String },
      carat:    { type: Number },
      color:    { type: String },
      metalColor: { type: String },
      price:    { type: Number },
      draggedItem: { type: Object },
      dropZoneActive: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.ringType = 'engagement';
    this.shape    = 'round';
    this.carat    = 1.0;
    this.color    = 'E';
    this.metalColor = '#FFD700';
    this.price    = 0;
    this.draggedItem = null;
    this.dropZoneActive = false;
  }

  static styles = css`
    :host {
      display: block;
      max-width: 550px;
      width: 100%;
      background: white;
      border-radius: 20px;
      padding: 2em;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .field { margin-bottom: 1.5em; }
    label { 
      display: block; 
      margin-bottom: 0.5em; 
      font-weight: 600; 
      color: #333;
      font-size: 0.95em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    select, input[type="number"] {
      width: 100%;
      padding: 0.8em;
      box-sizing: border-box;
      font-size: 1em;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      transition: all 0.3s ease;
      background: #f9f9f9;
    }
    .color-picker-wrapper {
      display: flex;
      gap: 15px;
      align-items: center;
      flex-wrap: wrap;
    }
    .color-option {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      cursor: grab;
      border: 3px solid #e0e0e0;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      user-select: none;
    }
    .color-option:active {
      cursor: grabbing;
    }
    .color-option.dragging {
      opacity: 0.5;
      transform: scale(0.9);
    }
    .color-option:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .color-option.selected {
      border-color: #667eea;
      border-width: 4px;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
    input[type="color"] {
      width: 50px;
      height: 50px;
      border: 3px solid #e0e0e0;
      border-radius: 50%;
      cursor: pointer;
      padding: 0;
      background: none;
    }
    input[type="color"]::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    input[type="color"]::-webkit-color-swatch {
      border: none;
      border-radius: 50%;
    }
    select:focus, input[type="number"]:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    .filters { 
      display: grid;
      grid-template-columns: 1fr;
      gap: 1em;
    }
    .filters > div {
      width: 100%;
    }
    .preview {
      margin: 1.5em 0;
      width: 100%;
      height: 300px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      border-radius: 15px;
      position: relative;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
    }
    .preview.drop-active {
      border: 3px dashed white;
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.2);
      transform: scale(1.02);
    }
    .drop-hint {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.75em;
      backdrop-filter: blur(10px);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .preview.drop-active .drop-hint {
      opacity: 1;
    }
    .preview::before {
      content: '';
      position: absolute;
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      border-radius: 50%;
      animation: shimmer 3s infinite;
    }
    @keyframes shimmer {
      0%, 100% { transform: translate(-20px, -20px); }
      50% { transform: translate(20px, 20px); }
    }
    .ring-icon {
      font-size: 3.5em;
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 3;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
    }
    .ring-details {
      position: absolute;
      bottom: 20%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 4;
      text-align: center;
      font-size: 0.9em;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      max-width: 90%;
      line-height: 1.4;
      font-weight: 500;
    }
    .ring-band {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      border: 18px solid;
      position: relative;
      margin-bottom: 10px;
      z-index: 2;
      box-shadow: 
        inset 0 0 20px rgba(0,0,0,0.3),
        0 0 30px rgba(0,0,0,0.4),
        inset 0 -10px 10px rgba(255,255,255,0.2);
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
    }
    .ring-container {
      position: relative;
      width: 100%;
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px 50px;
    }
    .price { 
      margin: 1em 0;
      padding: 0.5em;
      font-size: 2em;
      font-weight: bold;
      text-align: center;
      color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
      border-radius: 10px;
    }
    button { 
      width: 100%;
      padding: 1em;
      font-size: 1.1em;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }
    button:active {
      transform: translateY(0);
    }
    .shape-icons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .shape-option {
      padding: 15px 10px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      cursor: grab;
      text-align: center;
      transition: all 0.3s ease;
      background: #f9f9f9;
      min-height: 90px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      user-select: none;
    }
    .shape-option:active {
      cursor: grabbing;
    }
    .shape-option.dragging {
      opacity: 0.5;
      transform: scale(0.95);
    }
    .shape-option:hover {
      border-color: #667eea;
      background: white;
    }
    .shape-option.selected {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    }
    .shape-icon {
      font-size: 2em;
      margin-bottom: 5px;
    }
    .shape-label {
      font-size: 0.85em;
      color: #666;
      font-weight: 500;
    }
    @media (max-width: 599px) {
      :host {
        padding: 1.5em;
      }
      .shape-option {
        padding: 12px 8px;
        min-height: 80px;
      }
      .shape-icon {
        font-size: 1.8em;
      }
      .shape-label {
        font-size: 0.75em;
      }
    }
    @media (min-width: 600px) {
      .filters { grid-template-columns: 1fr 1fr; }
    }
  `;

  firstUpdated() {
    this.updatePrice();
  }

  updatePrice() {
    const ringBases = { engagement: 1000, wedding: 800 };
    const shapeBases = { round: 1000, princess: 1200, oval: 1100 };
    const colorFactors = { D: 1.2, E: 1.0, F: 0.8 };

    let typePrice   = ringBases[this.ringType] || 0;
    let shapePrice  = shapeBases[this.shape]   || 0;
    let caratPrice  = (this.carat || 0) * 2000;
    let colorFactor = colorFactors[this.color]  || 1.0;

    this.price = (typePrice + shapePrice + caratPrice) * colorFactor;
  }

  // Drag and drop handlers
  handleDragStart(e, type, value) {
    this.draggedItem = { type, value };
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  }

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    this.draggedItem = null;
    this.dropZoneActive = false;
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.dropZoneActive = true;
  }

  handleDragLeave(e) {
    if (e.target.classList.contains('preview')) {
      this.dropZoneActive = false;
    }
  }

  handleDrop(e) {
    e.preventDefault();
    this.dropZoneActive = false;

    if (!this.draggedItem) return;

    const { type, value } = this.draggedItem;
    
    if (type === 'shape') {
      this.shape = value;
      this.updatePrice();
    } else if (type === 'metalColor') {
      this.metalColor = value;
    }

    this.draggedItem = null;
  }

  render() {
    const shapeIcons = {
      round: '💍',
      princess: '💎',
      oval: '✨'
    };

    const metalColors = [
      { name: 'Yellow Gold', color: '#FFD700' },
      { name: 'White Gold', color: '#F5F5F5' },
      { name: 'Rose Gold', color: '#B76E79' },
      { name: 'Platinum', color: '#D3D3D3' }
    ];

    return html`
      <div class="field">
        <label for="ringType">Ring Type:</label>
        <select id="ringType" @change="${e => { this.ringType = e.target.value; this.updatePrice(); }}">
          <option value="engagement" ?selected="${this.ringType === 'engagement'}">💑 Engagement Ring</option>
          <option value="wedding" ?selected="${this.ringType === 'wedding'}">💒 Wedding Ring</option>
        </select>
      </div>

      <div class="field">
        <label>Metal Color: <small style="opacity: 0.7;">(Click or drag to ring)</small></label>
        <div class="color-picker-wrapper">
          ${metalColors.map(metal => html`
            <div class="color-option ${this.metalColor === metal.color ? 'selected' : ''}"
                 style="background: ${metal.color};"
                 title="${metal.name}"
                 draggable="true"
                 @dragstart="${e => this.handleDragStart(e, 'metalColor', metal.color)}"
                 @dragend="${e => this.handleDragEnd(e)}"
                 @click="${() => { this.metalColor = metal.color; }}">
            </div>
          `)}
          <input type="color" 
                 .value="${this.metalColor}"
                 @input="${e => { this.metalColor = e.target.value; }}"
                 title="Custom Color">
        </div>
      </div>

      <div class="field">
        <label>Diamond Shape: <small style="opacity: 0.7;">(Click or drag to ring)</small></label>
        <div class="shape-icons">
          ${['round', 'princess', 'oval'].map(shapeType => html`
            <div class="shape-option ${this.shape === shapeType ? 'selected' : ''}"
                 draggable="true"
                 @dragstart="${e => this.handleDragStart(e, 'shape', shapeType)}"
                 @dragend="${e => this.handleDragEnd(e)}"
                 @click="${() => { this.shape = shapeType; this.updatePrice(); }}">
              <div class="shape-icon">${shapeIcons[shapeType]}</div>
              <div class="shape-label">${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}</div>
            </div>
          `)}
        </div>
      </div>

      <div class="field filters">
        <div>
          <label for="carat">Carat (ct):</label>
          <input id="carat" type="number" min="0.5" max="5" step="0.1"
                 .value="${this.carat}"
                 @input="${e => { this.carat = parseFloat(e.target.value); this.updatePrice(); }}">
        </div>
        <div>
          <label for="color">Color Grade:</label>
          <select id="color" @change="${e => { this.color = e.target.value; this.updatePrice(); }}">
            <option value="D" ?selected="${this.color === 'D'}">D (Colorless)</option>
            <option value="E" ?selected="${this.color === 'E'}">E (Colorless)</option>
            <option value="F" ?selected="${this.color === 'F'}">F (Near Colorless)</option>
          </select>
        </div>
      </div>

      <div class="preview ${this.dropZoneActive ? 'drop-active' : ''}"
           @dragover="${e => this.handleDragOver(e)}"
           @dragleave="${e => this.handleDragLeave(e)}"
           @drop="${e => this.handleDrop(e)}">
        <div class="drop-hint">Drop here to apply! ✨</div>
        <div class="ring-container">
          <div class="ring-band" style="border-color: ${this.metalColor};"></div>
          <div class="ring-icon">${shapeIcons[this.shape]}</div>
          <div class="ring-details">
            ${this.shape.charAt(0).toUpperCase() + this.shape.slice(1)} Cut | ${this.carat}ct | Color ${this.color}
          </div>
        </div>
      </div>
      <div class="price">$${this.price.toFixed(2)}</div>
      <button @click="${this._onAddToCart}">🛒 Add to Cart</button>
    `;
  }

  _onAddToCart() {
    const detail = {
      ringType: this.ringType,
      shape:    this.shape,
      carat:    this.carat,
      color:    this.color,
      metalColor: this.metalColor,
      price:    this.price
    };
    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail,
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('ring-builder', RingBuilder);
