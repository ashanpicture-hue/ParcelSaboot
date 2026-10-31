# Claude Project Context: Saboot Marketing Site

## Project Overview

**Saboot** (ثبوت) is a marketing landing page for a Pakistani e-commerce tool that records packing and return videos. It helps online sellers win return claims with Daraz and courier companies by providing verifiable video evidence of parcel contents and return conditions.

## Tech Stack

- **Framework**: React 18.3.1 (single-page app)
- **Build Tool**: Vite 5.4.11
- **Styling**: Inline CSS (no external CSS files)
- **Language**: JavaScript/TypeScript (JSX)
- **Bilingual**: English + Urdu (RTL support)
- **Package Manager**: npm

## Project Structure

```
E:/Saboot/saboot-site/
├── src/
│   ├── main.jsx              # React entry point
│   └── SabootLanding.jsx     # Single landing component (822 lines)
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite config
├── index.html                # HTML template
├── README.md                 # Project documentation
└── claude.md                 # This context file
```

## Key Files

### src/SabootLanding.jsx
- **Purpose**: Complete landing page component
- **Size**: 822 lines (single file)
- **Features**:
  - Animated banner (PakBanner)
  - Interactive loss calculator
  - Audience selector (Daraz / Social / Brand)
  - Pricing calculator with monthly/yearly toggle
  - FAQ accordion
  - Early access form
  - All visual styles inline

### src/main.jsx
- **Purpose**: React root rendering
- **Simple**: Just renders SabootLanding into #root

### package.json
- **Scripts**: `dev`, `build`, `preview`
- **Dependencies**: React, React-DOM, Vite plugins

## Architecture Patterns

### 1. Single-File Component
- All JSX and CSS in one file
- No separate component files
- Easy to edit but can be hard to maintain for very large apps

### 2. Inline Styling
- CSS embedded in JSX using style attributes
- CSS variables defined in root element for theming
- No external CSS files or CSS-in-JS libraries

### 3. Bilingual Design
- Language state: `lang` (en/ur)
- RTL support: `dir={rtl ? "rtl" : "ltr"}`
- Urdu text marked with `font-family: var(--urdu)`
- Text direction handled in multiple places

### 4. Interactive Calculator
- State: `calc` object with orders, ret, bad, value
- Sliders update calculation in real-time
- Shows monthly loss, recoverable amount
- Compares against plan costs

## Build and Run Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview built site
npm run preview
```

## Component Library

The component uses custom CSS classes like:
- `.sb` - Root container
- `.wrap` - Content wrapper
- `.tile` - Feature card
- `.tab` - Tab button
- `.btn` - Button
- `.panel` - Panel container

## Key Features

### 1. Navigation
- Sticky header with language toggle
- Smooth scroll links to sections
- Mobile-responsive with hidden-m class

### 2. Animated Banner
- Pakistan green/white banner with animation
- Displays welcome message

### 3. Loss Calculator
- Sliders for: orders/month, return %, bad returns %, average order value
- Shows: bad returns/month, money at risk, recoverable amount
- Compares against plan costs

### 4. Audience Selector
- Three tabs: Daraz sellers, Social sellers, Brand owners
- Shows relevant features and benefits per audience

### 5. Pricing
- Three plans: Free, Standard (Rs 1,999), Growth (Rs 4,999)
- Monthly/yearly toggle (2 months free yearly)
- Shows parcel limits and features per plan

### 6. FAQ
- Accordion-style questions
- Expand/collapse functionality

### 7. Early Access Form
- WhatsApp integration
- Store name, phone number, sales channel
- Shows thank-you message on submit

## Data and Content

### Translation Object (T)
- English and Urdu text stored in T object
- Accessed via `const t = T[lang];`

### Audience Data
- Three audience types with different features
- Each has tab text, heading, description, and feature list

### Issues Data
- List of return problems sellers face
- Each has icon, label, background/foreground colors

### Rules Data
- Company claim windows and requirements
- Used in comparison table

### FAQs
- Question/answer pairs
- Accordion functionality

## Known Limitations (from README)

1. **Form Not Connected**: Sign-up form shows thank-you message but doesn't save or send anything
2. **Urdu Copy Needs Proofreading**: Urdu translations need native speaker review

## Special Considerations

### 1. Performance
- Single large file (822 lines) may be slow to load initially
- Inline styles increase bundle size
- Consider code splitting for production

### 2. Maintainability
- All logic in one file makes testing difficult
- Changes affect entire page
- Consider extracting components for future development

### 3. Accessibility
- Uses semantic HTML where appropriate
- ARIA labels on interactive elements
- Keyboard navigation for tabs and accordion

### 4. Mobile Design
- Uses CSS classes like `hide-m` for mobile-specific hiding
- Responsive grid layouts
- Touch-friendly buttons

## How to Edit

### Editing the Landing Page
1. Open `src/SabootLanding.jsx`
2. Make changes directly in the component
3. Test with `npm run dev`
4. Build with `npm run build` when ready

### Adding New Features
- Since it's a single file, add new sections within the return statement
- Consider extracting large sections into separate components if needed
- Maintain the same styling patterns (CSS variables, inline styles)

### Fixing Bugs
- Check console for React errors
- Test interactive elements (sliders, tabs, forms)
- Verify bilingual display (English/Urdu)

## Testing

1. **Development**: `npm run dev` - auto-reload on changes
2. **Build**: `npm run build` - check for build errors
3. **Preview**: `npm run preview` - test production build
4. **Manual Testing**: Test all interactive elements
   - Calculator sliders
   - Tab navigation
   - Form submission
   - Language switching
   - Mobile responsiveness

## Future Improvements

1. **Extract Components**: Break down large sections into reusable components
2. **Add Backend**: Connect form to email/WhatsApp service
3. **Improve Urdu**: Get native speaker review of translations
4. **Analytics**: Add Google Analytics or similar
5. **SEO**: Add meta tags and structured data
6. **Code Splitting**: Split large component for better performance
7. **Testing**: Add unit tests for calculator logic
8. **Internationalization**: Consider i18n library for more languages

## Quick Reference

### Common Patterns
- **State**: `const [var, setVar] = useState(initial)`
- **Styles**: `style={{ color: "var(--brand)", marginTop: 16 }}`
- **Events**: `onClick={() => setLang("ur")}`
- **Maps**: `{data.map(item => <div>{item}</div>)}`
- **Conditionals**: `{sent ? <Success/> : <Form/>}`

### CSS Variables
- `--bg`: Background color
- `--brand`: Brand color (Pakistan green)
- `--ink`: Text color
- `--sub`: Secondary text color
- `--line`: Border color
- `--warn`: Warning color

### Key Calculations
- `badReturns = (orders * ret * bad) / 10000`
- `monthlyLoss = badReturns * value`
- `recoverable = monthlyLoss * 0.6`
- `price = monthly ? m : m * 10 / 12`

This context should help Claude understand and work with the Saboot marketing site effectively.