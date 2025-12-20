# Ring Builder - Technical Documentation

## Architecture Overview

### Component Structure
```
RingBuilder (Lit Web Component)
├── Properties (State Management)
├── Methods (Business Logic)
├── Styles (CSS-in-JS)
└── Render (Template)
```

### File Structure
```
RingBuilder/
├── index.html              # Main HTML container
├── ring-builder-widget.js  # Lit component (~1000 lines)
├── server.js              # Express dev server
├── package.json           # Dependencies
├── README.md             # Project overview
├── FEATURES.md           # Feature documentation
├── USER_GUIDE.md         # User instructions
└── .gitignore           # Git exclusions
```

## Component API

### Custom Element
```javascript
<ring-builder id="my-ring-widget"></ring-builder>
```

### Properties (Public API)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ringType` | String | `'engagement'` | Type of ring |
| `shape` | String | `'round'` | Diamond shape |
| `carat` | Number | `1.0` | Carat weight |
| `color` | String | `'D'` | Color grade |
| `clarity` | String | `'VVS1'` | Clarity grade |
| `cut` | String | `'Excellent'` | Cut quality |
| `setting` | String | `'solitaire'` | Setting style |
| `metalColor` | String | `'#FFD700'` | Metal hex color |
| `metalType` | String | `'yellow-gold'` | Metal type identifier |
| `price` | Number | `0` | Calculated price |
| `currency` | String | `'USD'` | Selected currency |
| `language` | String | `'en'` | UI language |
| `wishlistItems` | Array | `[]` | Saved designs |

### Events

#### add-to-cart
Dispatched when user adds ring to cart.

**Event Detail:**
```javascript
{
  ringType: String,
  shape: String,
  carat: Number,
  color: String,
  clarity: String,
  cut: String,
  setting: String,
  metalColor: String,
  metalType: String,
  price: Number,
  currency: String,
  imageUrl: String
}
```

**Usage:**
```javascript
document.getElementById('my-ring-widget')
  .addEventListener('add-to-cart', (e) => {
    console.log(e.detail);
    // Handle cart logic
  });
```

## Core Methods

### Price Calculation
```javascript
updatePrice()
```

**Algorithm:**
```
basePrice = (ringTypePrice + shapePrice + (carat × 2000))
factors = colorFactor × clarityFactor × cutFactor
settingPrice = settingBasePrice
metalFactor = metalTypeFactor

finalPrice = (basePrice × factors + settingPrice) × metalFactor
```

**Pricing Tables:**

| Ring Type | Base Price |
|-----------|------------|
| Engagement | $1,000 |
| Wedding | $800 |
| Eternity | $1,200 |
| Promise | $600 |

| Shape | Base Price |
|-------|------------|
| Round | $1,000 |
| Princess | $1,200 |
| Oval | $1,100 |
| Emerald | $1,300 |
| Cushion | $1,150 |
| Pear | $1,250 |

| Color Grade | Multiplier |
|-------------|------------|
| D | 1.3× |
| E | 1.2× |
| F | 1.1× |
| G | 1.0× |
| H | 0.9× |
| I | 0.8× |

| Clarity | Multiplier |
|---------|------------|
| FL | 1.5× |
| IF | 1.4× |
| VVS1 | 1.3× |
| VVS2 | 1.2× |
| VS1 | 1.1× |
| VS2 | 1.0× |
| SI1 | 0.9× |
| SI2 | 0.8× |

| Cut | Multiplier |
|-----|------------|
| Excellent | 1.2× |
| Very Good | 1.1× |
| Good | 1.0× |
| Fair | 0.9× |

| Setting | Base Price |
|---------|------------|
| Solitaire | $500 |
| Halo | $800 |
| Three Stone | $1,000 |
| Pavé | $900 |
| Side Stone | $850 |
| Vintage | $950 |

| Metal Type | Multiplier |
|------------|------------|
| Yellow Gold | 1.0× |
| White Gold | 1.1× |
| Rose Gold | 1.05× |
| Platinum | 1.3× |
| Silver | 0.7× |

### Image Mapping
```javascript
getRingImageUrl()
```

**Returns:** Unsplash image URL based on:
- Metal type (detected from color)
- Diamond shape
- Ring type

**Image Matrix (18 combinations):**
```
Gold × Round × Engagement
Gold × Round × Wedding
Gold × Princess × Engagement
... (18 total)
```

### Metal Type Detection
```javascript
getMetalType(hexColor)
```

**Algorithm:**
1. Convert hex to RGB
2. Analyze color components
3. Return metal type identifier

**Logic:**
- High yellow+red, low blue → `'yellow-gold'`
- High yellow+red (equal) → `'rose-gold'`
- All components equal/high → `'white-gold'`
- Default → `'yellow-gold'`

### Wishlist Management

#### Save Design
```javascript
saveToWishlist()
```

**Stores:**
- Complete ring configuration
- Current price
- Timestamp
- Image URL

**Storage:** `localStorage.ringBuilderWishlist`

#### Load Wishlist
```javascript
loadWishlist()
```

**Returns:** Array of saved designs from localStorage

#### Remove from Wishlist
```javascript
removeFromWishlist(index)
```

**Parameters:**
- `index` (Number): Array index to remove

### Internationalization

```javascript
getTranslation(key)
```

**Translation Dictionary:**
```javascript
{
  en: {
    ringType: 'Ring Type',
    metalColor: 'Metal Color',
    shape: 'Diamond Shape',
    carat: 'Carat',
    // ... 20+ translations
  },
  es: {
    ringType: 'Tipo de Anillo',
    metalColor: 'Color del Metal',
    shape: 'Forma del Diamante',
    // ...
  }
}
```

### Currency Conversion

```javascript
formatPrice(usdAmount)
```

**Conversion Rates:**
```javascript
{
  USD: { rate: 1.0, symbol: '$' },
  EUR: { rate: 0.92, symbol: '€' },
  GBP: { rate: 0.79, symbol: '£' },
  AUD: { rate: 1.52, symbol: 'A$' },
  CAD: { rate: 1.36, symbol: 'C$' }
}
```

### Print & Email

#### Print Design
```javascript
printDesign()
```

**Generates:**
- HTML print window
- Ring image
- Complete specifications
- Current price
- Timestamp

#### Email Design
```javascript
emailDesign()
```

**Creates:** `mailto:` link with:
- Subject: "My Custom Ring Design"
- Body: Complete specifications

## Drag & Drop System

### Event Handlers

```javascript
handleDragStart(e, type, value)
```
- Sets `draggedItem` property
- Adds `.dragging` class
- Sets `effectAllowed`

```javascript
handleDragEnd(e)
```
- Removes `.dragging` class
- Clears `draggedItem`
- Resets `dropZoneActive`

```javascript
handleDragOver(e)
```
- Prevents default
- Sets `dropZoneActive = true`
- Changes cursor

```javascript
handleDragLeave(e)
```
- Resets `dropZoneActive = false`

```javascript
handleDrop(e)
```
- Applies dragged value
- Updates price
- Resets state

### Draggable Elements

**Metal Colors:**
```javascript
draggable="true"
@dragstart="${e => this.handleDragStart(e, 'metalColor', color)}"
```

**Diamond Shapes:**
```javascript
draggable="true"
@dragstart="${e => this.handleDragStart(e, 'shape', shapeType)}"
```

## Styling System

### CSS Architecture
```
Global Styles (index.html)
└── Gradient background
└── Container layout

Component Styles (widget)
├── :host (component wrapper)
├── Form elements (.field, select, input)
├── Interactive elements (.color-option, .shape-option)
├── Preview (.preview, .ring-image, .drop-hint)
├── Details (.diamond-details, .detail-row)
├── Buttons (button, .secondary-btn, .icon-btn)
├── Modals (.modal, .modal-content)
└── Responsive (@media queries)
```

### Color Palette
```css
Primary: #667eea (Purple-Blue)
Secondary: #764ba2 (Purple)
Accent: #ff6b9d (Pink)
Gold: #FFD700
Rose: #B76E79
White: #F5F5F5
Platinum: #D3D3D3
```

### Animations
- `fadeIn` - Element entrance
- `slideIn` - Modal entrance
- `.drop-active` - Drop zone pulse
- Hover transitions (0.3s ease)

## State Management

### Reactive Properties
All properties automatically trigger re-render on change.

**Example:**
```javascript
this.carat = 2.0;  // Triggers render() + updatePrice()
```

### Lifecycle

1. **Constructor** - Initialize state
2. **firstUpdated** - Call `updatePrice()`
3. **User Interaction** - Update property
4. **render()** - Re-render UI
5. **Updated** - DOM reflects changes

## Performance Optimizations

### Efficient Re-rendering
- Lit tracks property changes
- Only updates changed DOM nodes
- Virtual DOM diffing

### Image Loading
- Lazy loading via browser
- Error fallback image
- CDN-hosted (Unsplash)

### LocalStorage
- Wishlist persists across sessions
- No database required
- Instant load/save

## Browser APIs Used

| API | Purpose |
|-----|---------|
| Custom Elements | Web Component registration |
| Shadow DOM | Style encapsulation |
| LocalStorage | Wishlist persistence |
| Drag & Drop | Interactive customization |
| Window.print() | Print quotes |
| mailto: protocol | Email sharing |

## Development Workflow

### Hot Reload
Express serves static files with auto-refresh on file change.

### Debugging
```javascript
// Enable Lit devtools
window.litDevtools = true;
```

### Testing Changes
1. Edit `ring-builder-widget.js`
2. Save file
3. Refresh browser
4. Check console for errors

## Integration Guide

### Basic Integration
```html
<script type="module" src="ring-builder-widget.js"></script>
<ring-builder id="widget"></ring-builder>
```

### With Event Handling
```javascript
const widget = document.getElementById('widget');

widget.addEventListener('add-to-cart', (e) => {
  fetch('/api/cart', {
    method: 'POST',
    body: JSON.stringify(e.detail),
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### Programmatic Control
```javascript
const widget = document.querySelector('ring-builder');

// Set properties
widget.ringType = 'wedding';
widget.carat = 2.5;
widget.currency = 'EUR';
widget.language = 'es';

// Read state
console.log(widget.price);
console.log(widget.wishlistItems);
```

## Extending Functionality

### Add New Ring Type
1. Update `ringBases` in `updatePrice()`
2. Add option in render() `<select>`
3. Add translation keys

### Add New Currency
1. Add to conversion rates in `formatPrice()`
2. Add button in currency selector
3. Update symbol mapping

### Add New Language
1. Add translations to `getTranslation()`
2. Update language toggle button
3. Add locale-specific formatting

## Security Considerations

- ✅ No user data sent to server
- ✅ LocalStorage only (client-side)
- ✅ No SQL injection risk
- ✅ No XSS vulnerabilities (Lit escapes by default)
- ✅ HTTPS recommended for production

## Deployment Checklist

- [ ] Update version in `package.json`
- [ ] Test all features locally
- [ ] Verify mobile responsiveness
- [ ] Check browser console for errors
- [ ] Test wishlist persistence
- [ ] Verify currency conversion
- [ ] Test drag & drop functionality
- [ ] Validate print quotes
- [ ] Test email links
- [ ] Push to GitHub
- [ ] Verify GitHub Pages deployment

---

**Last Updated:** 2025
**Component Version:** 2.0.0
**Lit Version:** 3.0
