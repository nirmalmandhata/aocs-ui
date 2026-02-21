# Theme Toggle Feature - Implementation Guide

## Overview

A theme toggle button has been added to the AOCS application header, allowing users to switch between dark and light themes. The implementation matches the autowired-fe project's theme service pattern.

## Features

✅ **Theme Service** - Manages theme state with Angular signals
✅ **Persistent Storage** - Saves user's theme preference in localStorage
✅ **Automatic Initialization** - Loads saved theme on app startup
✅ **Toggle Button** - Icon button in header to switch themes
✅ **Visual Feedback** - Different icons for dark/light modes
✅ **Smooth Transitions** - CSS animations when switching themes

## File Structure

### New Files Created

1. **`src/app/core/services/theme.service.ts`**
   - Service that manages theme state
   - Uses Angular signals for reactive state management
   - Handles localStorage persistence
   - Applies theme classes to document body

### Modified Files

1. **`src/app/components/header.component.ts`**
   - Added ThemeService injection
   - Added toggleTheme() method
   - Made themeService public for template access

2. **`src/app/components/header.component.html`**
   - Added theme toggle button with sun/moon SVG icons
   - Icons switch based on current theme
   - Button positioned between navigation and mobile menu

3. **`src/app/components/header.component.css`**
   - Added `.theme-toggle-btn` styles
   - Proper spacing and hover effects
   - Responsive positioning on mobile

## How It Works

### Theme Service Implementation

```typescript
export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themeSignal = signal<Theme>('dark');
  
  toggleTheme() {
    const newTheme = this.themeSignal() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
  
  setTheme(theme: Theme) {
    this.themeSignal.set(theme);
    localStorage.setItem('aocs-theme', theme);
    this.applyTheme(theme);
  }
  
  private applyTheme(theme: Theme) {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }
}
```

### Header Button Implementation

```html
<button class="theme-toggle-btn" (click)="toggleTheme()">
  <svg *ngIf="themeService.themeSignal() === 'dark'">
    <!-- Sun icon for light mode -->
  </svg>
  <svg *ngIf="themeService.themeSignal() === 'light'">
    <!-- Moon icon for dark mode -->
  </svg>
</button>
```

## Usage

### For End Users

1. Click the sun/moon icon in the header
2. Theme automatically switches
3. Preference is saved automatically
4. Preference persists across browser sessions

### For Developers

Inject the theme service in any component:

```typescript
constructor(private themeService: ThemeService) {}

toggleTheme() {
  this.themeService.toggleTheme();
}

getCurrentTheme() {
  return this.themeService.themeSignal();
}
```

## Theme Styling

### Dark Theme
- Background: `#0F172A` (Dark blue)
- Cards: `#1E293B` (Lighter blue)
- Accent: `#F97316` (Orange)
- Text: `#F8FAFC` (Light gray)
- Default theme

### Light Theme
- Background: `#F1F5F9` (Light gray)
- Cards: `#FFFFFF` (White)
- Accent: `#EA580C` (Dark orange)
- Text: `#0F172A` (Dark blue)
- Activated when user selects

## CSS Classes

The theme service automatically applies these classes to the `<body>` element:

```html
<!-- Dark Theme -->
<body class="dark-theme">

<!-- Light Theme -->
<body class="light-theme">
```

All CSS variables in `styles.css` automatically respond to these classes.

## localStorage Key

- **Key**: `aocs-theme`
- **Values**: `'dark'` or `'light'`
- **Default**: `'dark'`

## Browser Behavior

### First Visit
- No saved preference
- Defaults to dark theme
- User can change anytime

### Subsequent Visits
- Loads saved preference from localStorage
- Applies theme automatically
- Theme loads before page renders (no flashing)

## Icons Used

### Dark Theme (Current) - Shows Sun Icon
```svg
<svg width="20" height="20" viewBox="0 0 24 24">
  <!-- Sun icon indicating light mode is available -->
</svg>
```

### Light Theme (Current) - Shows Moon Icon
```svg
<svg width="20" height="20" viewBox="0 0 24 24">
  <!-- Moon icon indicating dark mode is available -->
</svg>
```

## Styling Details

### Button Appearance
- Border: 1px solid (tms-border)
- Padding: 0.5rem 0.75rem
- Border radius: 6px (tms-radius-sm)
- Min size: 44x44px (touch-friendly)

### Button Hover State
- Background: Elevated (tms-bg-elevated)
- Color: Accent (tms-accent)
- Border: Accent color

### Responsive Behavior
- Desktop: Positioned in header next to navigation
- Mobile: Between navigation bar and hamburger menu
- Touch-friendly sizing maintained on all devices

## Integration Points

### App Module
- ThemeService is provided via `providedIn: 'root'`
- No additional module configuration needed

### Header Component
- Imports ThemeService
- Exposes themeService as public property
- Toggle button calls themeService.toggleTheme()

### CSS Variables
- All colors defined in `styles.css` as CSS custom properties
- Themes use `.dark-theme` and `.light-theme` classes
- No component-level changes needed

## Testing

### Manual Testing
1. Click the theme toggle button
2. Verify icon changes (sun ↔ moon)
3. Verify page colors change immediately
4. Refresh page - theme persists
5. Open DevTools - check localStorage for 'aocs-theme' key

### Verification Points
- [ ] Dark theme loads on first visit
- [ ] Light theme loads after toggle
- [ ] Icon reflects current theme
- [ ] Colors match theme specification
- [ ] Theme preference persists after refresh
- [ ] localStorage updates correctly
- [ ] Mobile layout works correctly
- [ ] No console errors

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- localStorage support required

## Future Enhancements

Possible improvements:
- System preference detection (prefers-color-scheme)
- Theme preview before saving
- Additional themes (e.g., high contrast)
- Theme schedule (auto-switch at specific times)
- Per-page theme settings

## Troubleshooting

### Theme doesn't persist
- Check if localStorage is enabled
- Clear browser cache and try again
- Verify 'aocs-theme' key in localStorage

### Icon doesn't update
- Check browser console for errors
- Verify `*ngIf="themeService.themeSignal()"` syntax
- Ensure CommonModule is imported in app.module

### Colors don't change
- Verify CSS variables are defined in styles.css
- Check that dark-theme/light-theme classes are applied to body
- Inspect element to see applied classes

## References

- Service Implementation: `src/app/core/services/theme.service.ts`
- Header Component: `src/app/components/header.component.ts`
- Global Styles: `src/styles.css`
- Theme Colors: Inside CSS variables in `styles.css`
