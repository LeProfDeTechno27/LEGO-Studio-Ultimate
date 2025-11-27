# LEGO 3D Editor

Production-ready LEGO 3D Editor built with React 18, TypeScript, Three.js, and Redux Toolkit. Build LEGO creations in your browser with real-time 3D rendering, PDF instruction import, semi-automatic brick detection, and comprehensive export options.

## ✨ Features

### Core Building Tools
- **Build Tool** - Place LEGO bricks with grid snapping
- **Select Tool** - Single-click or multi-select (Ctrl+Click)
- **Delete Tool** - Remove selected bricks
- **Move/Rotate/Scale** - Transform bricks with 3D gizmo controls
- **Group/Ungroup** - Organize bricks into groups

### LEGO Brick Library
- 35+ official LEGO brick types
- Standard Bricks (1x1, 1x2, 1x4, 1x8, 2x2, 2x4)
- Plates (1x1, 1x2, 2x2, 2x4, 4x4, 6x6, 32x32 Baseplate)
- Slopes (45°, 33°, curved, inverted)
- Special pieces (arches, headlight, windows)
- Technic pieces
- Accessories

### Color System
- 16 official LEGO colors
- Click to apply color to selected bricks
- Real-time color updates

### Save/Load System
- Auto-save every 30 seconds
- Manual save with localStorage persistence
- Load previously saved projects
- Export to JSON, PNG, GLB (coming soon)

### PDF Instruction Import
- Upload PDF instruction files
- Extract pages as images
- Step-by-step building interface
- Semi-automatic brick detection with TensorFlow.js
- Navigate between instruction steps

### Undo/Redo
- 15-level undo/redo history
- Tracks all actions (add, delete, move, rotate, color change)
- Keyboard shortcuts (Ctrl+Z, Ctrl+Y)

### Camera Controls
- Orbit camera with mouse drag
- Zoom with mouse wheel
- Pan with middle mouse button
- Reset view to default

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| B | Build tool |
| D | Delete tool |
| R | Rotate tool |
| M | Move tool |
| S | Scale tool |
| G | Group selected bricks |
| U | Ungroup selected bricks |
| V | Toggle visibility |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+S | Save project |
| Ctrl+A | Select all |
| Ctrl+C | Copy selected |
| Ctrl+V | Paste |
| Delete/Backspace | Delete selected |
| Escape | Deselect all |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/LeProfDeTechno27/LEGO-Studio-Ultimate.git
cd LEGO-Studio-Ultimate

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t lego-editor -f docker/Dockerfile .

# Run the container
docker run -p 3000:80 lego-editor
```

Or use Docker Compose:

```bash
# Start with docker-compose
docker-compose up

# Stop
docker-compose down
```

Access the app at `http://localhost:3000`

See [DOCKER.md](DOCKER.md) for detailed deployment instructions.

## 📖 Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture and design decisions
- [USER-GUIDE.md](USER-GUIDE.md) - Complete user guide with all features
- [DOCKER.md](DOCKER.md) - Docker deployment guide
- [API.md](API.md) - Component and hook API documentation

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **3D Rendering**: Three.js with three-stdlib
- **State Management**: Redux Toolkit
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **PDF Processing**: pdfjs-dist
- **ML/AI**: TensorFlow.js + COCO-SSD
- **Testing**: Vitest + React Testing Library
- **Deployment**: Docker + Nginx

## 📁 Project Structure

```
lego-3d-editor/
├── src/
│   ├── components/        # React components
│   │   ├── Canvas3D.tsx       # Three.js 3D canvas
│   │   ├── Editor.tsx          # Main editor layout
│   │   ├── Toolbar.tsx         # Tool selection
│   │   ├── Palette.tsx         # Color picker
│   │   ├── PropertiesPanel.tsx # Brick properties
│   │   ├── PDFImportPanel.tsx  # PDF import UI
│   │   └── Modals/             # Save/Load/Export modals
│   ├── hooks/             # React hooks
│   │   ├── useThreeScene.ts      # Three.js scene management
│   │   ├── useKeyboardShortcuts.ts # Keyboard handling
│   │   ├── useAppDispatch.ts
│   │   └── useAppSelector.ts
│   ├── services/          # Business logic
│   │   ├── brickLibrary.ts    # LEGO brick definitions
│   │   ├── pdfService.ts      # PDF processing
│   │   ├── mlService.ts       # TensorFlow.js brick detection
│   │   ├── exportService.ts   # Export to JSON/PNG/GLB
│   │   └── storageService.ts  # localStorage persistence
│   ├── utils/             # Utility functions
│   │   ├── grid.ts           # Grid snapping
│   │   ├── color.ts          # Color matching
│   │   ├── collision.ts      # Collision detection
│   │   ├── transforms.ts     # Transform utilities
│   │   └── uuid.ts           # UUID generation
│   └── types/             # TypeScript definitions
├── store/                 # Redux store
│   ├── slices/            # Redux slices
│   │   ├── project.ts        # Project metadata
│   │   ├── scene.ts          # Bricks and groups
│   │   ├── selection.ts      # Selected bricks
│   │   ├── ui.ts             # UI state
│   │   ├── history.ts        # Undo/redo
│   │   ├── camera.ts         # Camera state
│   │   └── pdf.ts            # PDF import state
│   ├── middleware/        # Redux middleware
│   │   ├── history.ts        # Undo/redo middleware
│   │   └── storage.ts        # Auto-save middleware
│   └── store.ts           # Store configuration
├── tests/                 # Unit tests
├── docker/                # Docker files
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── docker-compose.yml
└── vite.config.ts
```

## 🎯 Features Implemented

✅ All core building tools (Build, Delete, Rotate, Move, Scale)
✅ Full LEGO brick library (35+ brick types)
✅ 16 official LEGO colors
✅ Save/Load with localStorage
✅ Export to JSON and PNG
✅ Undo/Redo (15 levels)
✅ Keyboard shortcuts
✅ Group/Ungroup functionality
✅ PDF instruction import
✅ Semi-automatic brick detection (TensorFlow.js)
✅ Step-by-step building interface
✅ Responsive UI (desktop/tablet/mobile)
✅ Docker deployment
✅ Comprehensive documentation
✅ Unit tests

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is provided as-is for educational and personal use.

## 🙋 Support

For issues and questions, please visit the [GitHub Issues](https://github.com/LeProfDeTechno27/LEGO-Studio-Ultimate/issues) page.

## 🚀 Roadmap

- [ ] GLB export implementation
- [ ] Cloud sync (optional backend)
- [ ] Collaborative editing
- [ ] Advanced ML brick recognition
- [ ] Mobile app (React Native)
- [ ] VR/AR support

---

**Built with ❤️ using React, Three.js, and TypeScript**

Created: November 27, 2025
Version: 1.0.0
