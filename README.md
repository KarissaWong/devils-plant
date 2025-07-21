# Devil's Plant - Math Puzzle Game

A beautiful, interactive math puzzle game built with Next.js 14, React 18, and TypeScript. Players must find combinations of three tiles that add up to a target number within a time limit.

## 🎮 Game Features

- **Dynamic Tile Generation**: Random tiles with values 1-9
- **Target Number Calculation**: Automatically generated based on tile combinations
- **Time-Based Challenge**: 2-minute timer with bonus points
- **Multiple Solutions**: Each puzzle has multiple valid combinations
- **Beautiful Animations**: Smooth transitions and visual feedback
- **Keyboard Controls**: Full keyboard support for tile selection
- **Responsive Design**: Works on desktop and mobile devices
- **Background Cycling**: Dynamic background images that change between games

## 🎯 How to Play

1. **Select Tiles**: Click or press keys A-J to select tiles
2. **Find Combinations**: Find sets of 3 tiles that add up to the target number
3. **Score Points**: +1 point for correct combinations, -1 for incorrect
4. **Beat the Clock**: Complete all combinations before time runs out
5. **Win**: Find all possible combinations to win!

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your `devils-plant` repository

2. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

3. **Environment Variables** (if needed):
   - No environment variables required for this project

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - Your app will be available at `https://your-project-name.vercel.app`

### Manual Deployment

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📁 Project Structure

```
devils-plant/
├── app/                    # Next.js 14 app directory
│   ├── page.tsx           # Main game component
│   ├── globals.css        # Global styles and animations
│   ├── error.tsx          # Error boundary
│   └── global-error.tsx   # Global error boundary
├── components/            # React components
│   └── GameBoard.tsx      # Game board component
├── types/                 # TypeScript type definitions
│   └── game.ts           # Game-related types
├── public/               # Static assets
│   └── background-images/ # Background images
└── package.json          # Dependencies and scripts
```

## 🎨 Technologies Used

- **Next.js 14**: React framework with app router
- **React 18**: UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Animations**: Custom keyframe animations
- **GitHub**: Version control and hosting

## 🎯 Game Logic

- **Tile Generation**: Random tiles with values 1-9
- **Target Calculation**: Sum of 3 random tiles
- **Solution Finding**: Algorithm finds all valid combinations
- **Scoring System**: +1 for correct, -1 for incorrect
- **Timer Management**: 2-minute countdown with win condition

## 🌟 Features

- **Smooth Animations**: Fade-ins, tile animations, pill growth
- **Keyboard Support**: Full keyboard navigation
- **Debug Panel**: Toggle with Shift+H for development
- **Game Over Screens**: Timer expiration and completion screens
- **Image Preloading**: Smooth background transitions
- **Responsive Layout**: Works on all screen sizes

## 📝 License

This project is open source and available under the MIT License.

---

**Ready to play?** Deploy to Vercel and start solving puzzles! 🎮✨ 