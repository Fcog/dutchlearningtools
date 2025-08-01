# Dutch Learning Tools

A comprehensive collection of free, interactive Dutch language learning tools built with React and Vite. Master Dutch grammar, vocabulary, pronunciation, and conversation skills with engaging daily practice tools.

## 🚀 Features

### Currently Available:
- **Dutch Articles & Nouns**: Learn Dutch articles (de & het) with 200 most common Dutch nouns
  - Daily word rotation based on date
  - Random word practice mode
  - English translations and categories
  - Mobile-optimized design
  - Social media sharing
  
### Coming Soon:
- Dutch Verb Conjugation
- Dutch Pronunciation Guide
- Common Dutch Phrases
- Grammar Lessons
- Vocabulary Builder

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom responsive styling
- **JSON** - Data storage for Dutch vocabulary

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd learn-dutch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 in your browser

## 🇳🇱 **Dutch Flag Favicon**

The app features a beautiful Dutch flag favicon that displays across all platforms:
- **Multi-format support**: SVG favicons for modern browsers
- **Multiple sizes**: 32x32, 192x192, and 512x512 for all devices
- **PWA ready**: Web manifest for progressive web app capabilities
- **Apple touch icon**: Optimized for iOS devices
- **Theme color**: Dutch flag blue (#21468b) for browser UI

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components
│   ├── LandingPage.jsx # Main dashboard
│   └── ArticlesPage.jsx # Dutch articles tool
├── data/               # JSON data files
│   └── dutch-nouns.json # 200 Dutch nouns with articles
├── App.jsx             # Main app with routing
├── main.jsx           # React entry point
└── index.css          # Global styles

public/                 # Static assets
├── favicon.svg         # Main Dutch flag favicon
├── icon-192.svg        # 192x192 icon for PWA
├── icon-512.svg        # 512x512 icon for large displays
└── site.webmanifest    # Web app manifest

dist/                  # Production build output
backup/                # Backup of original files
```

## 🌐 Production Deployment

### Option 1: Static Hosting (Recommended)

**Deploy to Netlify:**
1. Build the project: `npm run build`
2. Upload the `dist/` folder to Netlify
3. Configure redirects for React Router:
   ```
   /* /index.html 200
   ```

**Deploy to Vercel:**
1. Connect your Git repository
2. Vercel automatically detects Vite
3. Deploy with zero configuration

**Deploy to GitHub Pages:**
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/learn-dutch",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`

### Option 2: Traditional Hosting

1. Build the project: `npm run build`
2. Upload the `dist/` folder contents to your web server
3. Configure your server to serve `index.html` for all routes

### Server Configuration

**Apache (.htaccess):**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 🎯 Performance Features

- **Code Splitting**: Separate chunks for vendor libraries and router
- **Tree Shaking**: Only includes used code in production
- **CSS Optimization**: Minified and compressed stylesheets
- **Source Maps**: Available for debugging production issues
- **Gzip Compression**: Reduced file sizes for faster loading

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly interface
- Optimized font sizes for mobile
- Reduced motion for accessibility
- Daily word visible without scrolling on mobile

## 🔍 SEO Features

- Meta tags for search engines
- Open Graph tags for social sharing
- Twitter Card support
- Structured data (JSON-LD)
- Semantic HTML elements
- Proper heading hierarchy

## 🧩 Adding New Tools

To add a new learning tool:

1. **Create a new page component** in `src/pages/`
2. **Add the route** in `src/App.jsx`
3. **Update the tools array** in `src/pages/LandingPage.jsx`
4. **Set available: true** when ready to launch

Example:
```jsx
// src/pages/VerbsPage.jsx
function VerbsPage() {
  return (
    <div className="articles-container">
      <h1>Dutch Verb Conjugation</h1>
      {/* Your component content */}
    </div>
  )
}

// Add to App.jsx
<Route path="/verbs" element={<VerbsPage />} />

// Update in LandingPage.jsx
{ id: 'verbs', available: true, ... }
```

## 📊 Bundle Analysis

Current production bundle sizes:
- **Total**: ~193.62 kB
- **Vendor (React)**: 141.30 kB (gzipped: 45.43 kB)
- **App Code**: 27.85 kB (gzipped: 7.07 kB)
- **Router**: 18.13 kB (gzipped: 6.87 kB)
- **CSS**: 6.34 kB (gzipped: 1.78 kB)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-tool`
3. Commit changes: `git commit -am 'Add new learning tool'`
4. Push to branch: `git push origin feature/new-tool`
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎓 Educational Use

This tool is designed for:
- Dutch language learners at all levels
- Teachers and educators
- Anyone interested in learning Dutch articles and grammar
- Self-study and classroom use

## 🌟 Support

If you find this tool helpful, please:
- ⭐ Star the repository
- 🐛 Report bugs or suggest features
- 📢 Share with other Dutch learners
- 🤝 Contribute new features or improvements

---

**Built with ❤️ for Dutch language learners worldwide** 🇳🇱