# Skolic School Management System - Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [x] Remove debug APK artifact
- [x] Remove console logs and debug statements
- [x] Remove inline styles
- [x] Remove temporary comments
- [x] Validate all links work
- [x] Test all interactive features

### Performance
- [x] Optimize scroll event handling
- [x] Minify CSS and JavaScript
- [x] Optimize images
- [x] Add CSS rules for styling (remove inline styles)
- [x] Enable font preloading
- [x] Add font-display: swap

### Security
- [x] No sensitive data in code
- [x] No hardcoded API keys
- [x] Add .gitignore for sensitive files
- [x] Configure Content Security Policy headers (in web server)

### SEO & Metadata
- [x] Meta tags present
- [x] Open Graph tags configured
- [x] Twitter Card tags configured
- [x] Canonical URLs set up

## Deployment Steps

### 1. Local Testing
```bash
# Clear cache
rm -rf .git/index

# Test locally
open index.html  # or python -m http.server 8000
```

### 2. Build Optimization (Optional with build tools)
```bash
# If using a build tool:
npm run build

# This would typically:
# - Minify CSS
# - Minify JavaScript
# - Optimize images
# - Generate source maps for debugging
```

### 3. Server Configuration

#### Apache (.htaccess)
```apache
# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Set cache headers
<IfModule mod_headers.c>
  # Cache static assets for 1 year
  <FilesMatch "\\.(jpg|jpeg|png|gif|ico|css|js|webp|svg|woff|woff2)$">
    Header set Cache-Control "max-age=31536000, public"
  </FilesMatch>

  # Don't cache HTML
  <FilesMatch "\\.html$">
    Header set Cache-Control "max-age=3600, must-revalidate"
  </FilesMatch>

  # Security headers
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "no-referrer-when-downgrade"
</IfModule>
```

#### Nginx Configuration
```nginx
# Compression
gzip on;
gzip_types text/plain text/css text/javascript application/javascript text/xml application/xml+rss;

# Cache control
location ~* \.(jpg|jpeg|png|gif|ico|css|js|webp|svg|woff|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location ~* \.html$ {
  expires 1h;
  add_header Cache-Control "public, must-revalidate";
}

# Security headers
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "no-referrer-when-downgrade";
```

### 4. File Upload
```bash
# Upload all files EXCEPT:
# - .git/ directory
# - .env (use .env.example as template)
# - *.apk files

# Recommended file structure on server:
/public_html/
  ├── index.html
  ├── app.js (minified)
  ├── styles.css (minified)
  ├── Skolic app icon.png
  ├── Skolic logo.png
  ├── app-release.apk (production build only)
  └── .htaccess (if using Apache)
```

### 5. Post-Deployment Verification

```bash
# Check file sizes
ls -lh

# Test CSS loading
curl -I https://yourdomain.com/styles.css

# Test JavaScript loading
curl -I https://yourdomain.com/app.js

# Check compression
curl -I -H "Accept-Encoding: gzip" https://yourdomain.com/

# Test from different devices
# - Desktop browsers (Chrome, Firefox, Safari, Edge)
# - Mobile (iOS, Android)
# - Tablets
```

### 6. Monitoring

- [ ] Set up error logging
- [ ] Monitor page load times
- [ ] Track APK downloads
- [ ] Monitor QR code generation failures
- [ ] Check server response times

## Performance Targets

| Metric | Target |
|--------|--------|
| Time to First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Total Page Size | < 200 KB |
| Load Time on 4G | < 3s |

## Rollback Plan

If issues occur after deployment:

1. Restore previous version from git
2. Clear CDN cache if applicable
3. Clear browser cache on client devices
4. Verify DNS propagation

## Version History

- **v1.0.0** - Initial production release (May 30, 2026)

## Support & Contact

For deployment issues, contact: skolic@gmail.com
