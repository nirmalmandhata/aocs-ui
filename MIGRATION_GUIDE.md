# AOCS Theme Migration Guide

## Quick Start

1. **Install updated dependencies**:
   ```bash
   npm install
   ```
   This will install Angular Material, Material CDK, Tailwind CSS, and PostCSS.

2. **Run the development server**:
   ```bash
   npm start
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## What's Changed - Technical Details

### Component Hierarchy

**Before**:
```
app-root
├── app-header
├── router-outlet
└── app-footer
```

**After** (Improved):
```
app-root
└── router-outlet (MainLayout)
    ├── app-header
    ├── div.tms-content
    │   └── router-outlet (Page content)
    └── app-footer
```

This new structure allows for consistent layout across all pages.

---

### CSS Architecture

**Modern CSS Variables System**:
- All colors use CSS custom properties (variables)
- Easy global theme switching
- Consistent spacing scale
- Pre-defined border radius and transition values

**Example Usage**:
```css
/* Using TMS theme variables */
background-color: var(--tms-bg-primary);
color: var(--tms-text-primary);
border-radius: var(--tms-radius);
transition: all var(--tms-transition);
```

---

### Routing Changes

The MainLayoutComponent now wraps all pages as child routes:

```typescript
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'ai-development', component: AiDevelopmentComponent },
      // ... other routes
    ]
  }
];
```

**No changes needed in page components** - they work exactly as before.

---

## Verification Checklist

- [ ] `npm install` completes without errors
- [ ] `npm start` launches the application
- [ ] Header displays with proper styling
- [ ] Footer displays with proper styling
- [ ] Mobile menu works on screens < 768px
- [ ] Navigation links are active/highlighted
- [ ] All pages display with dark theme
- [ ] Responsive design works on mobile/tablet

---

## Troubleshooting

### Issue: Styles not loading
**Solution**: Make sure `custom-theme.scss` is listed before `styles.css` in `angular.json`

### Issue: Material icons not showing
**Solution**: Verify Material Icons font link is in `index.html`

### Issue: Mobile menu not working
**Solution**: Ensure CommonModule is imported in app.module.ts and `*ngIf` works in templates

### Issue: Build errors
**Solution**: Run `npm install` to ensure all dependencies are installed

---

## File Locations Reference

| Component | Location |
|-----------|----------|
| App Root | `src/app/app.component.ts` |
| Main Layout | `src/app/layouts/main-layout/main-layout.component.ts` |
| Header | `src/app/components/header.component.ts` |
| Footer | `src/app/components/footer.component.ts` |
| Global Styles | `src/styles.css` |
| Material Theme | `src/custom-theme.scss` |
| Config | `angular.json` |

---

## Next Steps

1. **Customize Colors**: Edit CSS variables in `src/styles.css`
2. **Add Components**: Create new page components using the same structure
3. **Extend Functionality**: Add authentication, API calls, etc. to services
4. **Deploy**: Build and deploy using your preferred hosting service

---

## Performance Notes

- **CSS-in-JS**: Uses native CSS for optimal performance
- **Material Design**: Provides accessible UI components
- **Responsive**: Mobile-first approach ensures fast load times
- **Lazy Loading**: Route-based code splitting possible with lazy routing

---

## Browser Support

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Additional Resources

- [Angular Material Components](https://material.angular.io/components)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Responsive Design Patterns](https://web.dev/responsive-web-design-basics/)

---

**Need Help?** 
Check the THEME_UPGRADE.md file for complete documentation of all changes.
