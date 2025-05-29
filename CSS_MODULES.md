# CSS Modules in the Project

This project uses CSS Modules for component styling. CSS Modules provide local scoping of CSS by automatically creating unique class names when styles are imported into components.

## How to Use CSS Modules

### 1. Create a CSS Module File

Create a file with the `.module.css` extension, for example: `Button.module.css`

```css
.button {
  background-color: blue;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.primary {
  background-color: #4caf50;
}

.secondary {
  background-color: #f44336;
}

/* Using nesting with postcss-nested */
.button {
  &:hover {
    opacity: 0.8;
  }
}
```

### 2. Import and Use in React Component

```jsx
import React from 'react';
import styles from './Button.module.css';

function Button({ children, variant = 'primary' }) {
  return (
    <button 
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;
```

### 3. Features Available in This Project

- **Local Scoping**: Class names are automatically scoped locally to avoid conflicts
- **Camel Case Conversion**: CSS classes with hyphens (e.g., `my-class`) are available as camelCase in JavaScript (`styles.myClass`)
- **CSS Nesting**: You can use nesting in your CSS files with the `&` selector (powered by postcss-nested)

### 4. TypeScript Support

TypeScript definitions for CSS Modules are included in the project. When you import a CSS Module, you'll get proper type checking:

```tsx
import styles from './Button.module.css';
// styles will be typed as: { [key: string]: string }
```

## Best Practices

1. Use meaningful class names that describe the purpose rather than the appearance
2. Keep CSS modules close to their respective components
3. Use composition to share styles between components
4. Avoid using global styles when possible
5. Use the `&` selector for nesting related styles (like hover states)

## Example

See `src/csv-parser.tsx` and `src/csv-parser.module.css` for a working example of CSS Modules in this project.
