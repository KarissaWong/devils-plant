# Devil's Plant - Arithmetic Game

A challenging web-based arithmetic game where players select 3 tiles in sequence to reach a target number within a 3-minute time limit.

## 🎮 Game Rules

### Objective
- Select exactly 3 tiles in sequence to reach the target number
- Score as many points as possible within the 3-minute time limit
- Each tile can only be used once per 3-tile combination

### Scoring System
- **Correct Answer**: +1 point
- **Incorrect Answer**: -1 point
- **Bonus Points**: +1 point every 20 seconds if all solutions are exhausted but time remains

### Calculation Rules
1. **First Tile**: Operator is ignored, only the number value is used
2. **Order of Operations**: Multiplication (×) and Division (÷) take priority over Addition (+) and Subtraction (-)
3. **Tile Usage**: Each tile can only be used once per 3-tile combination

### Example
For target number 9 with tiles:
- A = -11, B = +7, C = ÷9, D = +9, E = -10, F = ÷5, G = ×6, H = ÷4, I = ×3, J = +1

Valid solutions:
- IJG = 3+1×6 = 9
- GJI = 6×1+3 = 9
- EFB = 10÷5+7 = 9
- AEF = 11-10÷5 = 9

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd devils-plant
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🎯 How to Play

1. **Start the Game**: Click "Start Game" to begin
2. **Select Tiles**: Use keyboard letters A-J to select tiles
3. **View Input**: Your selections appear in the input area at the bottom
4. **Submit**: After selecting 3 tiles, the combination is automatically checked
5. **Track Progress**: View correct combinations and your score
6. **Time Management**: Complete as many combinations as possible within 3 minutes

## 🛠️ Technical Stack

- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS
- **Architecture**: Modern React patterns with hooks and functional components

## 📁 Project Structure

```
devils-plant/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main game page
├── components/            # React components
│   └── GameBoard.tsx      # Main game board component
├── types/                 # TypeScript type definitions
│   └── game.ts           # Game-related types
├── GAME_CONTEXT.md        # Detailed game rules and context
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Features

- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Controls**: Intuitive A-J key selection
- **Real-time Feedback**: Immediate visual feedback for selections
- **Timer System**: 3-minute countdown with bonus point system
- **Score Tracking**: Real-time score updates
- **Solution History**: Track all correct combinations found
- **Modern UI**: Clean, glassmorphism design with smooth animations

## 🔧 Customization

### Adding Custom Tiles
Modify the `generateTiles()` function in `app/page.tsx` to change tile generation logic.

### Adjusting Game Rules
Update the `GameConfig` interface and related logic to modify:
- Time limit
- Bonus point intervals
- Number of tiles
- Tiles per combination

### Styling Changes
Modify `app/globals.css` to customize the visual appearance of the game.

## 🐛 Debug Mode

During development, the game shows calculations for debugging purposes. This feature is automatically removed in production builds.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Future Enhancements

- Sound effects and music
- Multiple difficulty levels
- Leaderboard system
- Achievement system
- Custom tile themes
- Multiplayer mode 