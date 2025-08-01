#!/bin/bash

# Dutch Learning Tools - Production Deployment Script
# Usage: ./deploy.sh [target]
# Targets: netlify, github-pages, static

set -e  # Exit on any error

echo "🇳🇱 Dutch Learning Tools - Production Deployment"
echo "================================================="

# Build the project
echo "📦 Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "📊 Bundle size analysis:"
ls -lah dist/

TARGET=${1:-"static"}

case $TARGET in
    "netlify")
        echo ""
        echo "🌐 Netlify deployment instructions:"
        echo "1. Upload the 'dist' folder to Netlify"
        echo "2. Add this redirect rule to _redirects file:"
        echo "   /* /index.html 200"
        echo "3. Your site will be available at your Netlify URL"
        ;;
    
    "github-pages")
        echo ""
        echo "📚 GitHub Pages deployment:"
        if command -v gh-pages &> /dev/null; then
            echo "Deploying to GitHub Pages..."
            npx gh-pages -d dist
        else
            echo "Installing gh-pages..."
            npm install --save-dev gh-pages
            echo "Add this to your package.json scripts:"
            echo "  \"deploy\": \"gh-pages -d dist\""
            echo "Then run: npm run deploy"
        fi
        ;;
    
    "static")
        echo ""
        echo "📂 Static hosting deployment:"
        echo "1. Upload contents of 'dist' folder to your web server"
        echo "2. Configure server to serve index.html for all routes"
        echo "3. For Apache, add .htaccess with:"
        echo "   RewriteEngine On"
        echo "   RewriteCond %{REQUEST_FILENAME} !-f"
        echo "   RewriteRule ^ index.html [QR,L]"
        ;;
    
    *)
        echo "❌ Unknown target: $TARGET"
        echo "Available targets: netlify, github-pages, static"
        exit 1
        ;;
esac

echo ""
echo "🎉 Your Dutch Learning Tools app is ready for production!"
echo "📱 Features:"
echo "   ✅ React Router navigation"
echo "   ✅ Mobile responsive design"
echo "   ✅ SEO optimized"
echo "   ✅ No Babel warnings"
echo "   ✅ Optimized bundle size"
echo "   🇳🇱 Dutch flag favicon (SVG + PWA ready)"
echo "   📱 Multi-platform icon support"
echo ""
echo "🚀 Live preview: http://localhost:4173 (run 'npm run preview')"
echo "🏠 Development: http://localhost:3000 (run 'npm run dev')"