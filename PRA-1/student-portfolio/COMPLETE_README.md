# React Router Student Portfolio Application

A modern, responsive student portfolio website built with React 18, Vite, and React Router v6, demonstrating professional web development practices and React concepts.

## 🎯 Project Overview

This project is a complete implementation of a multi-page student portfolio application showcasing:
- Client-side routing with React Router v6
- State management with React Hooks (useState)
- Responsive design with CSS
- Dark/Light mode toggle
- Controlled components and form handling
- Component composition and reusability

## ✨ Features

### ✅ Implemented Features
- **Multi-page Navigation**: Home, Projects, Contact pages with client-side routing
- **Responsive Navbar**: Active route highlighting with NavLink, dark mode toggle
- **Home Page**: 
  - Student profile with image placeholder
  - Skills display in grid layout
  - Education information
  - Career objective
  - "Show More/Hide" toggle using useState
- **Projects Page**:
  - Project cards rendered dynamically with map()
  - Technologies display for each project
  - GitHub and Live Demo buttons
  - Project statistics
- **Contact Page**:
  - Controlled form with useState for form data
  - Real-time message preview
  - Character count display (max 500)
  - Form validation
  - Success message on submission
- **Dark/Light Mode**: Toggle button in navbar with CSS class-based theming
- **404 Page**: Custom NotFound component for invalid routes
- **Footer**: Consistent footer with social links and year
- **Responsive Design**: Mobile-friendly at all breakpoints

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18+ | UI Framework |
| React Router DOM | 7.x | Client-side routing |
| Vite | 8.x | Build tool & dev server |
| CSS | Latest | Styling (no frameworks) |
| JavaScript | ES6+ | Programming language |

## 📁 Project Structure

```
student-portfolio/
│
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar with dark mode toggle
│   │   ├── Navbar.css
│   │   ├── Footer.jsx       # Footer with social links
│   │   └── Footer.css
│   │
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Profile & intro page
│   │   ├── Home.css
│   │   ├── Projects.jsx     # Projects showcase page
│   │   ├── Projects.css
│   │   ├── Contact.jsx      # Contact form page
│   │   ├── Contact.css
│   │   ├── NotFound.jsx     # 404 error page
│   │   └── NotFound.css
│   │
│   ├── App.jsx              # Main app component with routing
│   ├── App.css              # App-level styles
│   ├── main.jsx             # React DOM entry point
│   ├── index.css            # Global styles
│   └── assets/              # Static assets
│
├── public/                  # Public assets
├── package.json             # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
└── README.md               # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Step 1: Install Dependencies

```bash
cd student-portfolio
npm install
```

This will install:
- React 18+
- React Router DOM v7
- Vite (already configured)
- ESLint for code quality

### Step 2: Run Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

### Step 3: Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Step 4: Preview Production Build

```bash
npm run preview
```

## 📝 Component Documentation

### 1. **App Component** (`src/App.jsx`)
**Purpose**: Root component that manages routing and dark mode state

**Key Features**:
- BrowserRouter wrapper for client-side routing
- Dark mode state management with useState
- Routes configuration
- Props passed to Navbar and Footer

**useState Usage**:
```javascript
const [isDarkMode, setIsDarkMode] = useState(false)
```

---

### 2. **Navbar Component** (`src/components/Navbar.jsx`)
**Purpose**: Navigation bar with routing links and dark mode toggle

**Key Features**:
- NavLink for active route highlighting
- Portfolio logo with Link to home
- Dark mode toggle button
- Responsive flex layout

**Props**:
- `isDarkMode`: Boolean state from App
- `onToggleDarkMode`: Function to toggle dark mode

**Important**: Uses `NavLink` instead of `<a>` tags for client-side routing

---

### 3. **Footer Component** (`src/components/Footer.jsx`)
**Purpose**: Footer displayed on all pages

**Key Features**:
- Student name and copyright
- Social media links
- Current year display
- Consistent styling across pages

---

### 4. **Home Page** (`src/pages/Home.jsx`)
**Purpose**: Student profile and introduction page

**Key Features**:
- Profile image (placeholder)
- Student name and title
- Introduction text
- Skills grid
- Education information
- Career objective
- **Show More/Hide toggle** (useState Example 1)

**useState Usage** (Demonstrates useState):
```javascript
const [showMore, setShowMore] = useState(false)
```

When `showMore` is true, additional information card is displayed with animation.

---

### 5. **Projects Page** (`src/pages/Projects.jsx`)
**Purpose**: Showcase student projects

**Key Features**:
- Projects array with map() function
- Project cards with:
  - Project name and description
  - Technologies used as tags
  - GitHub and Live Demo buttons
- Statistics section

**Dynamic Rendering**:
```javascript
{projects.map((project) => (
  <div key={project.id} className="project-card">
    {/* Card content */}
  </div>
))}
```

---

### 6. **Contact Page** (`src/pages/Contact.jsx`)
**Purpose**: Contact form with message handling

**Key Features**:
- **Controlled Form Component** using useState
- Form fields: Name, Email, Message
- **Character count display** (real-time)
- **Message preview** (live display as user types)
- Form validation
- Success message on submission
- Prevents page refresh on submit

**useState Usage** (Demonstrates useState Example 2):
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: ''
})
```

**Controlled Component Pattern**:
```javascript
const handleInputChange = (e) => {
  const { name, value } = e.target
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }))
}
```

---

### 7. **NotFound Page** (`src/pages/NotFound.jsx`)
**Purpose**: 404 error page for invalid routes

**Key Features**:
- Large "404" display
- "Page Not Found" message
- Navigation buttons back to Home and Projects
- Uses Link for routing

---

## 🎨 Styling Features

### Light Mode (Default)
- Clean white backgrounds
- Dark text for readability
- Blue accent colors (#6c63ff)

### Dark Mode
- Gradient dark backgrounds
- Light text
- Adjusted accent colors
- Smooth transitions between modes

### Responsive Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 768px to 1023px
- **Mobile**: Below 768px
- **Small Mobile**: 480px and below

### CSS Features Demonstrated
- Flexbox layout
- CSS Grid for multi-column layouts
- CSS transitions and animations
- Media queries for responsive design
- Gradient backgrounds
- Box shadows for depth
- Hover effects

## 🔄 React Concepts Demonstrated

### 1. **Components**
- Functional components with hooks
- Component composition
- Reusable navbar and footer

### 2. **JSX**
- HTML-like syntax in JavaScript
- Conditional rendering
- Event handling

### 3. **Props**
- Passing data to components
- Props validation through usage
- Event handlers as props

### 4. **State Management (useState)**
- Dark mode toggle state
- Show More/Hide toggle on Home page
- Form data state in Contact page
- Form submission status

### 5. **React Router DOM v6**
- BrowserRouter wrapper
- Routes and Route components
- NavLink for navigation links
- Link for programmatic navigation
- Wildcard route for 404

### 6. **Controlled Components**
- Form inputs controlled by state
- onChange handlers
- Form submission handling

### 7. **Conditional Rendering**
- Show/Hide additional info based on state
- Display form success message
- Render preview based on input

### 8. **Array Methods**
- map() for rendering lists
- Dynamic project cards
- Skills and education loops

### 9. **Event Handling**
- Click events (buttons, links)
- Form submission
- Input change events
- Dark mode toggle

### 10. **CSS Classes Based on State**
- Dark mode class applied to root element
- Active navigation links

## 🚗 Application Navigation Flow

```
BrowserRouter (Root)
    │
    ├── Navbar (Active NavLink)
    ├── Main Content (Routes)
    │   ├── / → Home (ShowMore toggle)
    │   ├── /projects → Projects (Map projects)
    │   ├── /contact → Contact (Controlled form)
    │   └── * → NotFound (404)
    └── Footer
```

## 📱 Responsive Design Strategy

1. **Mobile-First Approach**: Styles start mobile, then expand for larger screens
2. **Flexbox Layout**: Primary layout system for flexibility
3. **CSS Grid**: Used for multi-column layouts on larger screens
4. **Media Queries**: Breakpoints at 768px and 480px
5. **Relative Units**: Use rem and em for scalable sizing

## 🔐 Form Security & Validation

### Contact Form Validation
- Email format validation using regex
- Required field checking
- Message length limit (500 characters)
- No special script tags (basic protection)

### Best Practices
- Form submission prevents default behavior
- Controlled components for better control
- Validation before submission

## 🎓 Learning Outcomes

After completing this project, you understand:

1. ✅ How to set up React with Vite
2. ✅ React Router v6 for client-side routing
3. ✅ useState hook for state management
4. ✅ Controlled components in forms
5. ✅ Component composition and reusability
6. ✅ Conditional rendering in React
7. ✅ Event handling and callbacks
8. ✅ CSS styling and dark mode implementation
9. ✅ Responsive design patterns
10. ✅ React best practices

## 🐛 Troubleshooting

### Issue: Port 5173 already in use
**Solution**: 
```bash
npm run dev -- --port 3000
```

### Issue: React Router not working
**Ensure** BrowserRouter is wrapping the Routes in App.jsx

### Issue: Dark mode not persisting on refresh
**Note**: Current implementation uses state only. To persist, use localStorage:
```javascript
const [isDarkMode, setIsDarkMode] = useState(() => {
  return localStorage.getItem('darkMode') === 'true'
})

useEffect(() => {
  localStorage.setItem('darkMode', isDarkMode)
}, [isDarkMode])
```

### Issue: Styles not loading
**Check**:
- CSS files are in correct locations
- Import statements match filenames exactly
- Check browser developer tools for CSS errors

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)
- [MDN CSS Guide](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 📝 Code Comments

All components include detailed comments explaining:
- Component purpose
- Key features and functionality
- useState usage
- Important React patterns

## 🎯 Next Steps / Enhancements

Possible improvements for future versions:
1. Add localStorage for dark mode persistence
2. Implement form backend integration
3. Add animations with Framer Motion
4. Create a blog section with dynamic content
5. Add SEO optimization
6. Implement accessibility (ARIA labels)
7. Add unit tests with Jest
8. Deploy to Vercel or Netlify

## 👨‍💻 Author

Created as a comprehensive React learning project demonstrating modern web development practices.

## 📄 License

This project is open source and available for educational purposes.

---

**Last Updated**: 2026
**React Version**: 18+
**Vite Version**: 8+
**React Router Version**: 7+
