// ring-builder.js
import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

class RingBuilder extends LitElement {
  static get properties() {
    return {
      ringType: { type: String },
      shape:    { type: String },
      carat:    { type: Number },
      color:    { type: String },
      clarity:  { type: String },
      cut:      { type: String },
      setting:  { type: String },
      metalColor: { type: String },
      metalType:  { type: String },
      price:    { type: Number },
      currency: { type: String },
      draggedItem: { type: Object },
      dropZoneActive: { type: Boolean },
      showWishlist: { type: Boolean },
      wishlistItems: { type: Array },
      showShareModal: { type: Boolean },
      maxPrice: { type: Number },
      language: { type: String }
    };
  }

  constructor() {
    super();
    this.ringType = 'engagement';
    this.shape    = 'round';
    this.carat    = 1.0;
    this.color    = 'E';
    this.clarity  = 'VS1';
    this.cut      = 'Excellent';
    this.setting  = 'solitaire';
    this.metalColor = '#FFD700';
    this.metalType = 'yellow-gold';
    this.price    = 0;
    this.currency = 'USD';
    this.draggedItem = null;
    this.dropZoneActive = false;
    this.imageCache = {};
    this.showWishlist = false;
    this.wishlistItems = this.loadWishlist();
    this.showShareModal = false;
    this.maxPrice = 50000;
    this.language = 'en';
  }

  loadWishlist() {
    try {
      const saved = localStorage.getItem('ringWishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveToWishlist() {
    const design = {
      id: Date.now(),
      ringType: this.ringType,
      shape: this.shape,
      carat: this.carat,
      color: this.color,
      clarity: this.clarity,
      cut: this.cut,
      setting: this.setting,
      metalType: this.metalType,
      price: this.price,
      currency: this.currency,
      imageUrl: this.getRingImageUrl(),
      date: new Date().toISOString()
    };
    this.wishlistItems = [...this.wishlistItems, design];
    localStorage.setItem('ringWishlist', JSON.stringify(this.wishlistItems));
    this.showNotification('Added to wishlist! ❤️');
  }

  removeFromWishlist(index) {
    this.wishlistItems = this.wishlistItems.filter((item, i) => i !== index);
    localStorage.setItem('ringWishlist', JSON.stringify(this.wishlistItems));
    this.requestUpdate();
  }

  showNotification(message) {
    const event = new CustomEvent('show-notification', {
      detail: { message },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  printDesign() {
    const printContent = this.generatePrintContent();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }

  generatePrintContent() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ring Design Quote</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .ring-image { max-width: 400px; margin: 20px auto; display: block; }
          .specs { margin: 20px 0; }
          .spec-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .price { font-size: 24px; font-weight: bold; color: #667eea; margin: 20px 0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💍 Custom Ring Design</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <img class="ring-image" src="${this.getRingImageUrl()}" alt="Ring Design">
        <div class="specs">
          <div class="spec-row"><span>Ring Type:</span><span>${this.ringType.toUpperCase()}</span></div>
          <div class="spec-row"><span>Diamond Shape:</span><span>${this.shape.toUpperCase()}</span></div>
          <div class="spec-row"><span>Carat:</span><span>${this.carat} ct</span></div>
          <div class="spec-row"><span>Color:</span><span>${this.color}</span></div>
          <div class="spec-row"><span>Clarity:</span><span>${this.clarity}</span></div>
          <div class="spec-row"><span>Cut:</span><span>${this.cut}</span></div>
          <div class="spec-row"><span>Setting:</span><span>${this.setting.toUpperCase()}</span></div>
          <div class="spec-row"><span>Metal:</span><span>${this.metalType.replace('-', ' ').toUpperCase()}</span></div>
        </div>
        <div class="price">Price: ${this.formatPrice(this.price)}</div>
      </body>
      </html>
    `;
  }

  emailDesign() {
    const subject = encodeURIComponent('My Custom Ring Design');
    const body = encodeURIComponent(`
I've designed a custom ring:

Ring Type: ${this.ringType}
Diamond: ${this.carat}ct ${this.shape} ${this.color} ${this.clarity} ${this.cut}
Setting: ${this.setting}
Metal: ${this.metalType}
Price: ${this.formatPrice(this.price)}

View design: ${this.getRingImageUrl()}
    `);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  formatPrice(price) {
    const rates = {
      USD: { symbol: '$', rate: 1 },
      EUR: { symbol: '€', rate: 0.92 },
      GBP: { symbol: '£', rate: 0.79 },
      AUD: { symbol: 'A$', rate: 1.52 },
      CAD: { symbol: 'C$', rate: 1.36 }
    };
    const { symbol, rate } = rates[this.currency] || rates.USD;
    return `${symbol}${(price * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  getTranslation(key) {
    const translations = {
      en: {
        ringType: 'Ring Type',
        engagement: 'Engagement Ring',
        wedding: 'Wedding Ring',
        eternity: 'Eternity Ring',
        promise: 'Promise Ring',
        metalColor: 'Metal Color',
        dragHint: 'Click or drag to ring',
        shape: 'Diamond Shape',
        carat: 'Carat',
        colorGrade: 'Color Grade',
        clarity: 'Clarity',
        cut: 'Cut Quality',
        setting: 'Ring Setting',
        metalType: 'Metal Type',
        diamondDetails: 'Diamond Details',
        saveToWishlist: 'Save to Wishlist',
        viewWishlist: 'View Wishlist',
        printQuote: 'Print Quote',
        emailQuote: 'Email Quote',
        addToCart: 'Add to Cart',
        myWishlist: 'My Wishlist',
        emptyWishlist: 'Your wishlist is empty. Start adding rings!'
      },
      es: {
        ringType: 'Tipo de Anillo',
        engagement: 'Anillo de Compromiso',
        wedding: 'Anillo de Boda',
        eternity: 'Anillo Eterno',
        promise: 'Anillo de Promesa',
        metalColor: 'Color del Metal',
        dragHint: 'Haz clic o arrastra al anillo',
        shape: 'Forma del Diamante',
        carat: 'Quilates',
        colorGrade: 'Grado de Color',
        clarity: 'Claridad',
        cut: 'Calidad de Corte',
        setting: 'Montaje',
        metalType: 'Tipo de Metal',
        diamondDetails: 'Detalles del Diamante',
        saveToWishlist: 'Guardar en Lista',
        viewWishlist: 'Ver Lista de Deseos',
        printQuote: 'Imprimir Cotización',
        emailQuote: 'Enviar por Email',
        addToCart: 'Añadir al Carrito',
        myWishlist: 'Mi Lista de Deseos',
        emptyWishlist: '¡Tu lista está vacía. Comienza a agregar anillos!'
      }
    };
    return translations[this.language]?.[key] || translations.en[key] || key;
  }

  getRingImageUrl() {
    // Map metal color to metal type
    const metalType = this.getMetalType(this.metalColor);
    
    // Image naming convention: {metalType}-{shape}-{ringType}.jpg
    // Example: gold-round-engagement.jpg
    const imageKey = `${metalType}-${this.shape}-${this.ringType}`;
    
    // For now, generate placeholder images using a service
    // You can replace these with actual product photos
    const imageUrls = {
      // Yellow Gold
      'gold-round-engagement': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      'gold-princess-engagement': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
      'gold-oval-engagement': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      'gold-round-wedding': 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=400&fit=crop',
      'gold-princess-wedding': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop',
      'gold-oval-wedding': 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400&h=400&fit=crop',
      
      // White Gold/Platinum
      'white-round-engagement': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
      'white-princess-engagement': 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=400&fit=crop',
      'white-oval-engagement': 'https://images.unsplash.com/photo-1609586716918-0e00c91c3623?w=400&h=400&fit=crop',
      'white-round-wedding': 'https://images.unsplash.com/photo-1612323999615-a3dd9fa4f146?w=400&h=400&fit=crop',
      'white-princess-wedding': 'https://images.unsplash.com/photo-1594552072238-4828bc235ad1?w=400&h=400&fit=crop',
      'white-oval-wedding': 'https://images.unsplash.com/photo-1590972768742-037b1c0d7f7c?w=400&h=400&fit=crop',
      
      // Rose Gold
      'rose-round-engagement': 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=400&h=400&fit=crop',
      'rose-princess-engagement': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      'rose-oval-engagement': 'https://images.unsplash.com/photo-1611652022419-a9419f74343e?w=400&h=400&fit=crop',
      'rose-round-wedding': 'https://images.unsplash.com/photo-1588444837495-c6b8f0a089a2?w=400&h=400&fit=crop',
      'rose-princess-wedding': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      'rose-oval-wedding': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
    };
    
    return imageUrls[imageKey] || imageUrls['gold-round-engagement'];
  }

  getMetalType(colorHex) {
    const lowerHex = colorHex.toLowerCase();
    
    // Yellow Gold range
    if (lowerHex === '#ffd700' || lowerHex.includes('gold')) {
      return 'gold';
    }
    // Rose Gold range
    if (lowerHex === '#b76e79' || lowerHex.includes('b76')) {
      return 'rose';
    }
    // White/Platinum range (covers #F5F5F5, #D3D3D3, etc.)
    if (lowerHex === '#f5f5f5' || lowerHex === '#d3d3d3' || lowerHex === '#e5e4e2') {
      return 'white';
    }
    
    // For custom colors, determine by brightness
    const r = parseInt(lowerHex.slice(1, 3), 16);
    const g = parseInt(lowerHex.slice(3, 5), 16);
    const b = parseInt(lowerHex.slice(5, 7), 16);
    
    // If more red/pink tones
    if (r > g && r > b && r - g > 30) {
      return 'rose';
    }
    // If more yellow tones
    if (r > 200 && g > 180 && b < 100) {
      return 'gold';
    }
    // Default to white for other colors
    return 'white';
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
      height: 350px;
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      border-radius: 15px;
      position: relative;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      overflow: hidden;
    }
    .ring-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 20px;
      transition: transform 0.3s ease;
    }
    .preview:hover .ring-image {
      transform: scale(1.05);
    }
    .image-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.2em;
      color: #666;
    }
    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
      padding: 20px;
      color: white;
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
    .button-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 1em;
    }
    .secondary-btn {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
      font-size: 0.95em;
    }
    .secondary-btn:hover {
      background: #f0f0ff;
    }
    .icon-btn {
      padding: 0.8em;
      font-size: 0.9em;
    }
    .wishlist-btn {
      background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
    }
    .currency-selector {
      display: flex;
      gap: 5px;
      justify-content: center;
      margin: 10px 0;
    }
    .currency-btn {
      padding: 5px 10px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.85em;
      transition: all 0.2s;
    }
    .currency-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    }
    .modal-content {
      background: white;
      padding: 2em;
      border-radius: 15px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1em;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5em;
      cursor: pointer;
      padding: 0;
      width: auto;
    }
    .wishlist-item {
      border: 1px solid #eee;
      border-radius: 10px;
      padding: 1em;
      margin-bottom: 1em;
      display: flex;
      gap: 1em;
    }
    .wishlist-img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
    }
    .wishlist-details {
      flex: 1;
    }
    .diamond-details {
      background: #f9f9f9;
      padding: 1em;
      border-radius: 10px;
      margin: 1em 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5em 0;
      border-bottom: 1px solid #eee;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .slider-container {
      margin: 1em 0;
    }
    input[type=\"range\"] {
      width: 100%;
      margin: 0.5em 0;
    }
    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.85em;
      color: #666;
    }
    .shape-icons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    @media (min-width: 600px) {
      .shape-icons {
        grid-template-columns: repeat(3, 1fr);
      }
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
    const ringBases = { engagement: 1000, wedding: 800, eternity: 1200, promise: 600 };
    const shapeBases = { round: 1000, princess: 1200, oval: 1100, emerald: 1300, cushion: 1150, pear: 1250 };
    const colorFactors = { D: 1.3, E: 1.2, F: 1.1, G: 1.0, H: 0.9, I: 0.8 };
    const clarityFactors = { FL: 1.5, IF: 1.4, VVS1: 1.3, VVS2: 1.2, VS1: 1.1, VS2: 1.0, SI1: 0.9, SI2: 0.8 };
    const cutFactors = { Excellent: 1.2, 'Very Good': 1.1, Good: 1.0, Fair: 0.9 };
    const settingBases = { solitaire: 500, halo: 800, 'three-stone': 1000, pave: 900, 'side-stone': 850, vintage: 950 };
    const metalBases = { 'yellow-gold': 1.0, 'white-gold': 1.1, 'rose-gold': 1.05, platinum: 1.3, silver: 0.7 };

    let typePrice = ringBases[this.ringType] || 1000;
    let shapePrice = shapeBases[this.shape] || 1000;
    let caratPrice = (this.carat || 0) * 2000;
    let colorFactor = colorFactors[this.color] || 1.0;
    let clarityFactor = clarityFactors[this.clarity] || 1.0;
    let cutFactor = cutFactors[this.cut] || 1.0;
    let settingPrice = settingBases[this.setting] || 500;
    let metalFactor = metalBases[this.metalType] || 1.0;

    this.price = ((typePrice + shapePrice + caratPrice) * colorFactor * clarityFactor * cutFactor + settingPrice) * metalFactor;
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
      this.metalType = this.getMetalType(value);
      this.updatePrice();
    }

    this.draggedItem = null;
  }

  render() {
    const shapeIcons = {
      round: '💍',
      princess: '💎',
      oval: '✨',
      emerald: '🔷',
      cushion: '💠',
      pear: '💧'
    };

    const metalColors = [
      { name: 'Yellow Gold', color: '#FFD700' },
      { name: 'White Gold', color: '#F5F5F5' },
      { name: 'Rose Gold', color: '#B76E79' },
      { name: 'Platinum', color: '#D3D3D3' }
    ];

    return html`
      <!-- Language & Currency Selector -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 1em;">
        <button class="secondary-btn" style="padding: 0.5em 1em;" @click="${() => this.language = this.language === 'en' ? 'es' : 'en'}">
          🌐 ${this.language === 'en' ? 'Español' : 'English'}
        </button>
        <div class="currency-selector">
          ${['USD', 'EUR', 'GBP', 'AUD', 'CAD'].map(curr => html`
            <button class="currency-btn ${this.currency === curr ? 'active' : ''}"
                    @click="${() => this.currency = curr}">
              ${curr}
            </button>
          `)}
        </div>
      </div>

      <div class="field">
        <label for="ringType">${this.getTranslation('ringType')}:</label>
        <select id="ringType" @change="${e => { this.ringType = e.target.value; this.updatePrice(); }}">
          <option value="engagement" ?selected="${this.ringType === 'engagement'}">💑 ${this.getTranslation('engagement')}</option>
          <option value="wedding" ?selected="${this.ringType === 'wedding'}">💒 ${this.getTranslation('wedding')}</option>
          <option value="eternity" ?selected="${this.ringType === 'eternity'}">♾️ ${this.getTranslation('eternity')}</option>
          <option value="promise" ?selected="${this.ringType === 'promise'}">💝 ${this.getTranslation('promise')}</option>
        </select>
      </div>

      <div class="field">
        <label>${this.getTranslation('metalColor')}: <small style="opacity: 0.7;">(${this.getTranslation('dragHint')})</small></label>
        <div class="color-picker-wrapper">
          ${metalColors.map(metal => html`
            <div class="color-option ${this.metalColor === metal.color ? 'selected' : ''}"
                 style="background: ${metal.color};"
                 title="${metal.name}"
                 draggable="true"
                 @dragstart="${e => this.handleDragStart(e, 'metalColor', metal.color)}"
                 @dragend="${e => this.handleDragEnd(e)}"
                 @click="${() => { this.metalColor = metal.color; this.metalType = this.getMetalType(metal.color); this.updatePrice(); }}">
            </div>
          `)}
          <input type="color" 
                 .value="${this.metalColor}"
                 @input="${e => { this.metalColor = e.target.value; this.metalType = this.getMetalType(e.target.value); this.updatePrice(); }}"
                 title="Custom Color">
        </div>
      </div>

      <div class="field">
        <label>${this.getTranslation('shape')}: <small style="opacity: 0.7;">(${this.getTranslation('dragHint')})</small></label>
        <div class="shape-icons">
          ${['round', 'princess', 'oval', 'emerald', 'cushion', 'pear'].map(shapeType => html`
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
          <label for="carat">${this.getTranslation('carat')} (ct):</label>
          <input id="carat" type="number" min="0.5" max="5" step="0.1"
                 .value="${this.carat}"
                 @input="${e => { this.carat = parseFloat(e.target.value); this.updatePrice(); }}">
        </div>
        <div>
          <label for="color">${this.getTranslation('colorGrade')}:</label>
          <select id="color" @change="${e => { this.color = e.target.value; this.updatePrice(); }}">
            <option value="D" ?selected="${this.color === 'D'}">D (Colorless)</option>
            <option value="E" ?selected="${this.color === 'E'}">E (Colorless)</option>
            <option value="F" ?selected="${this.color === 'F'}">F (Near Colorless)</option>
            <option value="G" ?selected="${this.color === 'G'}">G (Near Colorless)</option>
            <option value="H" ?selected="${this.color === 'H'}">H (Faint)</option>
            <option value="I" ?selected="${this.color === 'I'}">I (Faint)</option>
          </select>
        </div>
      </div>

      <div class="field filters">
        <div>
          <label for="clarity">${this.getTranslation('clarity')}:</label>
          <select id="clarity" @change="${e => { this.clarity = e.target.value; this.updatePrice(); }}">
            <option value="FL" ?selected="${this.clarity === 'FL'}">FL (Flawless)</option>
            <option value="IF" ?selected="${this.clarity === 'IF'}">IF (Internally Flawless)</option>
            <option value="VVS1" ?selected="${this.clarity === 'VVS1'}">VVS1</option>
            <option value="VVS2" ?selected="${this.clarity === 'VVS2'}">VVS2</option>
            <option value="VS1" ?selected="${this.clarity === 'VS1'}">VS1</option>
            <option value="VS2" ?selected="${this.clarity === 'VS2'}">VS2</option>
            <option value="SI1" ?selected="${this.clarity === 'SI1'}">SI1</option>
            <option value="SI2" ?selected="${this.clarity === 'SI2'}">SI2</option>
          </select>
        </div>
        <div>
          <label for="cut">${this.getTranslation('cut')}:</label>
          <select id="cut" @change="${e => { this.cut = e.target.value; this.updatePrice(); }}">
            <option value="Excellent" ?selected="${this.cut === 'Excellent'}">Excellent</option>
            <option value="Very Good" ?selected="${this.cut === 'Very Good'}">Very Good</option>
            <option value="Good" ?selected="${this.cut === 'Good'}">Good</option>
            <option value="Fair" ?selected="${this.cut === 'Fair'}">Fair</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label for="setting">${this.getTranslation('setting')}:</label>
        <select id="setting" @change="${e => { this.setting = e.target.value; this.updatePrice(); }}">
          <option value="solitaire" ?selected="${this.setting === 'solitaire'}">💍 Solitaire</option>
          <option value="halo" ?selected="${this.setting === 'halo'}">✨ Halo</option>
          <option value="three-stone" ?selected="${this.setting === 'three-stone'}">💎 Three Stone</option>
          <option value="pave" ?selected="${this.setting === 'pave'}">🌟 Pavé</option>
          <option value="side-stone" ?selected="${this.setting === 'side-stone'}">💠 Side Stone</option>
          <option value="vintage" ?selected="${this.setting === 'vintage'}">🏛️ Vintage</option>
        </select>
      </div>

      <!-- Diamond Details Panel -->
      <div class="diamond-details">
        <h3 style="margin-top: 0;">💎 ${this.getTranslation('diamondDetails')}</h3>
        <div class="detail-row">
          <span>${this.getTranslation('shape')}:</span>
          <strong>${this.shape.charAt(0).toUpperCase() + this.shape.slice(1)}</strong>
        </div>
        <div class="detail-row">
          <span>${this.getTranslation('carat')}:</span>
          <strong>${this.carat} ct</strong>
        </div>
        <div class="detail-row">
          <span>${this.getTranslation('colorGrade')}:</span>
          <strong>${this.color}</strong>
        </div>
        <div class="detail-row">
          <span>${this.getTranslation('clarity')}:</span>
          <strong>${this.clarity}</strong>
        </div>
        <div class="detail-row">
          <span>${this.getTranslation('cut')}:</span>
          <strong>${this.cut}</strong>
        </div>
        <div class="detail-row">
          <span>${this.getTranslation('setting')}:</span>
          <strong>${this.setting.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
        </div>
        <div class="detail-row">
          <span>${this.getTranslation('metalType')}:</span>
          <strong>${this.metalType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
        </div>
      </div>

      <div class="preview ${this.dropZoneActive ? 'drop-active' : ''}"
           @dragover="${e => this.handleDragOver(e)}"
           @dragleave="${e => this.handleDragLeave(e)}"
           @drop="${e => this.handleDrop(e)}">
        <div class="drop-hint">Drop here to apply! ✨</div>
        
        <img class="ring-image" 
             src="${this.getRingImageUrl()}" 
             alt="${this.shape} ${this.ringType} ring"
             @error="${e => e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop'}">
        
        <div class="image-overlay">
          <div class="ring-details" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
            ${this.shape.charAt(0).toUpperCase() + this.shape.slice(1)} | ${this.carat}ct | ${this.color} | ${this.clarity}
          </div>
        </div>
      </div>
      
      <div class="price">${this.formatPrice(this.price)}</div>

      <!-- Action Buttons -->
      <div class="button-group">
        <button class="icon-btn wishlist-btn" @click="${this.saveToWishlist}">
          ❤️ ${this.getTranslation('saveToWishlist')}
        </button>
        <button class="icon-btn secondary-btn" @click="${() => this.showWishlist = true}">
          📋 ${this.getTranslation('viewWishlist')} (${this.wishlistItems.length})
        </button>
      </div>

      <div class="button-group">
        <button class="icon-btn secondary-btn" @click="${this.printDesign}">
          🖨️ ${this.getTranslation('printQuote')}
        </button>
        <button class="icon-btn secondary-btn" @click="${this.emailDesign}">
          📧 ${this.getTranslation('emailQuote')}
        </button>
      </div>

      <button @click="${this._onAddToCart}">🛒 ${this.getTranslation('addToCart')}</button>

      <!-- Wishlist Modal -->
      ${this.showWishlist ? html`
        <div class="modal" @click="${e => { if(e.target.classList.contains('modal')) this.showWishlist = false; }}">
          <div class="modal-content">
            <div class="modal-header">
              <h2>❤️ ${this.getTranslation('myWishlist')}</h2>
              <button class="close-btn" @click="${() => this.showWishlist = false}">✕</button>
            </div>
            ${this.wishlistItems.length === 0 ? html`
              <p style="text-align: center; color: #999; padding: 2em;">
                ${this.getTranslation('emptyWishlist')}
              </p>
            ` : html`
              ${this.wishlistItems.map((item, index) => html`
                <div class="wishlist-item">
                  <img class="wishlist-img" src="${item.imageUrl}" alt="Ring">
                  <div class="wishlist-details">
                    <h4>${item.ringType.charAt(0).toUpperCase() + item.ringType.slice(1)} Ring</h4>
                    <p><strong>${item.shape}</strong> | ${item.carat}ct | ${item.color} | ${item.clarity}</p>
                    <p>${item.setting} • ${item.metalType}</p>
                    <p style="font-size: 1.2em; color: #667eea;"><strong>${this.formatPrice(item.price)}</strong></p>
                    <small style="color: #999;">${new Date(item.date).toLocaleDateString()}</small>
                    <div style="margin-top: 0.5em;">
                      <button class="secondary-btn" style="padding: 0.5em 1em; font-size: 0.85em;"
                              @click="${() => this.removeFromWishlist(index)}">
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              `)}
            `}
          </div>
        </div>
      ` : ''}
    `;
  }

  _onAddToCart() {
    const detail = {
      ringType: this.ringType,
      shape: this.shape,
      carat: this.carat,
      color: this.color,
      clarity: this.clarity,
      cut: this.cut,
      setting: this.setting,
      metalColor: this.metalColor,
      metalType: this.metalType,
      price: this.price,
      currency: this.currency,
      imageUrl: this.getRingImageUrl()
    };
    
    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail,
      bubbles: true,
      composed: true
    }));

    this.showNotification('🛒 Added to cart!');
  }
}

customElements.define('ring-builder', RingBuilder);
