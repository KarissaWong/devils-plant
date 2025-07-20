# Devil's Plant - Game Context & Requirements

## Game Overview
A web-based arithmetic game where players select 3 tiles in sequence to reach a target number within a 3-minute time limit.

## Core Gameplay Rules

### Objective
- Select exactly 3 tiles in sequence to reach the target number
- Score as many points as possible within the time limit
- Each tile can only be used once per 3-tile combination

### Scoring System
- **Correct Answer**: +1 point
- **Incorrect Answer**: -1 point
- **Bonus Points**: +1 point every 20 seconds if all solutions are exhausted but time remains

### Time Limit
- 3 minutes per round
- Game ends when time expires
- No more points can be earned after time runs out

## Tile System

### Tile Format
- Each tile displays: Operator + Number (e.g., +5, -5, ×5, ÷5)
- 10 tiles total, labeled A through J
- Players select tiles by pressing corresponding keyboard letters
- **Important**: All tile numbers and target numbers must be 10 or less

### Calculation Rules
1. **First Tile**: Operator is ignored, only the number value is used
2. **Order of Operations**: Multiplication (×) and Division (÷) take priority over Addition (+) and Subtraction (-)
3. **Tile Usage**: Each tile can only be used once per 3-tile combination

### Calculation Examples
- Tiles: "5 +", "3 ×", "2 +" → 5+(3×2) = 11
- Tiles: "-5 ×5 +5" → 5×5+5 = 30 (first operator ignored)
- Tiles: "A(-8)", "E(-6)", "F(÷5)" → 8-6÷5 = 9

## Game Example

### Target Number: 9
**Available Tiles:**
- A = -8
- B = +7
- C = ÷9
- D = +9
- E = -6
- F = ÷5
- G = ×6
- H = ÷4
- I = ×3
- J = +1

**Valid Solutions:**
- IJG = 3+1×6 = 9
- GJI = 6×1+3 = 9
- EFB = 6÷5+7 = 9
- AEF = 8-6÷5 = 9

## User Interface Features

### Input System
- Keyboard-based tile selection (A-J)
- Input display shows:
  - Letters typed so far
  - Corresponding tile values
  - Both displayed together responsively

### Feedback System
- **Correct Answers**: Input display disappears, correct combination appears in growing list on the side
- **Incorrect Answers**: Clear feedback, input resets
- **Debug Mode**: Show calculations during development (removed in production)

### Visual Elements
- 10 tiles with numbers, operators, and keyboard indicators
- Target number display
- Timer display
- Score display
- Input area
- Correct answers list

## Technical Requirements

### Technology Stack
- Modern web framework (React/Next.js preferred)
- Responsive design for all screen sizes
- Keyboard input handling
- Real-time timer functionality

### Code Quality
- Follow best practices
- Maintainable and readable code
- Proper documentation
- Clean architecture

### Performance
- Smooth gameplay experience
- Responsive UI interactions
- Efficient calculation engine

## Game Flow
1. Game starts with 3-minute timer
2. Player sees 10 tiles and target number
3. Player types 3 letters to select tiles
4. System calculates result and provides feedback
5. If correct: score increases, combination saved
6. If incorrect: score decreases, input resets
7. New target and tiles generated for next round
8. Game continues until time expires or all solutions found
9. Final score displayed 