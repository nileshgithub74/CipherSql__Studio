# SQL Editor Frontend

React-based frontend application for the SQL Editor learning platform.

## 🛠️ Tech Stack

- **React 19** - Modern UI framework
- **Vite** - Fast build tool and development server
- **Monaco Editor** - VS Code-like code editor
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication
- **Vanilla CSS** - Custom styling without frameworks
## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AssignmentHeader.jsx
│   │   ├── Navbar.jsx
│   │   ├── Problem.jsx
│   │   ├── QueryPanel.jsx
│   │   ├── ResultsDisplay.jsx
│   │   ├── Schema.jsx
│   │   ├── Sidebar.jsx
│   │   └── SQLEditor.jsx
│   ├── pages/              # Page components
│   │   ├── Assignment.jsx
│   │   ├── AssignmentList.jsx
│   │   └── Home.jsx
│   ├── styles/             # CSS stylesheets
│   │   ├── App.css
│   │   ├── Assignment.css
│   │   ├── [component].css
│   │   └── index.css
│   ├── config/             # Configuration
│   │   └── api.js
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── dist/                   # Production build
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── vite.config.js          # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Backend API running on port 8080

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Environment Setup:**
Create `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
```

3. **Start Development Server:**
```bash
npm run dev
```

4. **Build for Production:**
```bash
npm run build
```

5. **Preview Production Build:**
```bash
npm run preview
```

## 🎨 Components

### Core Components

#### `SQLEditor.jsx`
- Monaco Editor integration
- Syntax highlighting for SQL
- Keyboard shortcuts (Ctrl+Enter to execute)
- Query execution controls

#### `ResultsDisplay.jsx`
- Query result visualization
- Validation feedback (✅ Correct / ❌ Incorrect)
- Scrollable data tables
- Row count display

#### `QueryPanel.jsx`
- Combines editor and results
- Manages layout switching
- Auto-scroll to results

#### `AssignmentHeader.jsx`
- Assignment title and difficulty
- Compact single-row layout
- Difficulty badges

#### `Sidebar.jsx`
- Problem description
- Database schema visualization
- Sample data preview

### Page Components

#### `AssignmentList.jsx`
- Lists available assignments
- Difficulty filtering
- Assignment cards with descriptions

#### `Assignment.jsx`
- Main assignment interface
- Integrates all components
- Manages state and API calls

#### `Home.jsx`
- Landing page
- Call-to-action for assignments

## 🎯 Features

### SQL Editor
- **Monaco Editor** - Professional code editing experience
- **Syntax Highlighting** - SQL syntax coloring
- **Auto-completion** - Smart code suggestions
- **Keyboard Shortcuts** - Ctrl+Enter to execute queries
- **Dark Theme** - Easy on the eyes

### Query Execution
- **Real-time Execution** - Run queries against live database
- **Instant Validation** - Immediate feedback on correctness
- **Result Visualization** - Clean table display
- **Auto-scroll** - Automatically scroll to results

### User Interface
- **Responsive Design** - Works on all screen sizes
- **Clean Layout** - Minimal, distraction-free interface
- **Smooth Animations** - Polished user experience
- **Accessible** - Keyboard navigation support

## 🔧 Configuration

### API Configuration (`src/config/api.js`)
```javascript
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
};
```

### Vite Configuration (`vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react()],
  // Additional Vite configuration
});
```

## 🎨 Styling

### CSS Architecture
- **Component-based** - Each component has its own CSS file
- **Vanilla CSS** - No CSS frameworks, custom styling
- **Responsive** - Mobile-first design approach
- **Clean Classes** - Human-readable class names

### Color Scheme
- **Primary**: Blue (#3b82f6) - Action buttons
- **Success**: Green (#10b981) - Correct answers
- **Error**: Red (#dc2626) - Incorrect answers
- **Background**: Light gray (#f8fafc) - Page background

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 768px - Full layout with sidebar
- **Mobile**: ≤ 768px - Stacked layout, collapsible sidebar

### Mobile Optimizations
- Touch-friendly buttons
- Scrollable result tables
- Optimized editor size
- Simplified navigation

## 🚀 Build & Deployment

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)
```

### Production Build
The build creates optimized files in `dist/`:
- `index.html` - Main HTML file
- `assets/` - Bundled CSS and JS files
- Static assets with cache-friendly names

### Deployment Options
- **Netlify** - Drag and drop `dist/` folder
- **Vercel** - Connect GitHub repository
- **AWS S3** - Upload `dist/` contents
- **Traditional hosting** - Upload `dist/` to web server

## 🔌 API Integration

### HTTP Client Setup
```javascript
// src/config/api.js
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
};
```

### API Calls Example
```javascript
// Execute SQL query
const executeResponse = await axios.post(`${API_CONFIG.BASE_URL}/sql/query/execute`, {
  query,
  schemaId
});

// Validate query
const validateResponse = await axios.post(`${API_CONFIG.BASE_URL}/sql/query/validate`, {
  query,
  assignmentId,
  schemaId
});
```

## 🧪 Testing

### Manual Testing
1. Start development server
2. Navigate to assignments
3. Test SQL query execution
4. Verify result validation
5. Check responsive design

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

### Development Guidelines
1. Follow existing component structure
2. Use functional components with hooks
3. Keep components small and focused
4. Add CSS files for new components
5. Test on multiple screen sizes

### Code Style
- Use ES6+ features
- Prefer const/let over var
- Use arrow functions
- Keep functions pure when possible

## 📦 Dependencies

### Production
- `react` - UI framework
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing
- `@monaco-editor/react` - Code editor
- `axios` - HTTP client

### Development
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `eslint` - Code linting

---

For backend integration, see [Backend README](../Backend/README.md)
