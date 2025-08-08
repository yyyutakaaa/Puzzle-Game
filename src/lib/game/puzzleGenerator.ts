import { Grid, Cell, Position, Difficulty } from '@/types/game';

export class PuzzleGenerator {
  private gridSize: number;
  private difficulty: Difficulty;
  private maxNumber: number;

  constructor(difficulty: Difficulty = 'easy') {
    this.difficulty = difficulty;
    this.gridSize = this.getGridSizeByDifficulty(difficulty);
    this.maxNumber = this.getMaxNumberByDifficulty(difficulty);
  }

  private getGridSizeByDifficulty(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy': return 4;
      case 'medium': return 6;
      case 'hard': return 8;
      case 'expert': return 10;
      default: return 4;
    }
  }

  private getMaxNumberByDifficulty(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 20;
      case 'hard': return 30;
      case 'expert': return 50;
      default: return 10;
    }
  }

  generatePuzzle(): Grid {
    const cells: Cell[][] = this.initializeGrid();
    const numbers = this.generateNumbers();
    const path = this.generatePath();
    
    // Place numbers along the path
    this.placeNumbers(cells, path, numbers);
    
    // Add obstacles based on difficulty
    this.addObstacles(cells);
    
    // Add special elements
    if (this.difficulty !== 'easy') {
      this.addSpecialElements(cells);
    }

    return {
      size: this.gridSize,
      cells,
      startNumber: 1,
      endNumber: numbers[numbers.length - 1],
      currentPath: []
    };
  }

  private initializeGrid(): Cell[][] {
    const cells: Cell[][] = [];
    for (let i = 0; i < this.gridSize; i++) {
      cells[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        cells[i][j] = {
          value: null,
          isConnected: false,
          isVisited: false
        };
      }
    }
    return cells;
  }

  private generateNumbers(): number[] {
    const count = Math.floor(this.gridSize * this.gridSize * 0.4);
    const numbers: number[] = [1];
    
    for (let i = 1; i < count; i++) {
      numbers.push(numbers[i - 1] + Math.floor(Math.random() * 3) + 1);
    }
    
    return numbers;
  }

  private generatePath(): Position[] {
    const path: Position[] = [];
    const visited = new Set<string>();
    const current: Position = {
      row: Math.floor(Math.random() * this.gridSize),
      col: Math.floor(Math.random() * this.gridSize)
    };
    
    path.push({ ...current });
    visited.add(`${current.row},${current.col}`);
    
    const directions = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 }
    ];
    
    let attempts = 0;
    const maxAttempts = this.gridSize * this.gridSize * 2;
    
    while (path.length < Math.floor(this.gridSize * this.gridSize * 0.4) && attempts < maxAttempts) {
      const validMoves: Position[] = [];
      
      for (const dir of directions) {
        const newPos = {
          row: current.row + dir.row,
          col: current.col + dir.col
        };
        
        if (this.isValidPosition(newPos) && !visited.has(`${newPos.row},${newPos.col}`)) {
          validMoves.push(newPos);
        }
      }
      
      if (validMoves.length > 0) {
        const nextPos = validMoves[Math.floor(Math.random() * validMoves.length)];
        path.push({ ...nextPos });
        visited.add(`${nextPos.row},${nextPos.col}`);
        current.row = nextPos.row;
        current.col = nextPos.col;
      } else {
        break;
      }
      
      attempts++;
    }
    
    return path;
  }

  private isValidPosition(pos: Position): boolean {
    return pos.row >= 0 && pos.row < this.gridSize && 
           pos.col >= 0 && pos.col < this.gridSize;
  }

  private placeNumbers(cells: Cell[][], path: Position[], numbers: number[]): void {
    for (let i = 0; i < Math.min(path.length, numbers.length); i++) {
      const pos = path[i];
      cells[pos.row][pos.col].value = numbers[i];
    }
  }

  private addObstacles(cells: Cell[][]): void {
    const obstacleCount = Math.floor(this.gridSize * this.gridSize * 0.15);
    let placed = 0;
    
    while (placed < obstacleCount) {
      const row = Math.floor(Math.random() * this.gridSize);
      const col = Math.floor(Math.random() * this.gridSize);
      
      if (cells[row][col].value === null && !cells[row][col].isBlocked) {
        cells[row][col].isBlocked = true;
        placed++;
      }
    }
  }

  private addSpecialElements(cells: Cell[][]): void {
    // Add one-way cells
    const oneWayCount = Math.floor(this.gridSize * 0.5);
    const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
    
    for (let i = 0; i < oneWayCount; i++) {
      const row = Math.floor(Math.random() * this.gridSize);
      const col = Math.floor(Math.random() * this.gridSize);
      
      if (cells[row][col].value === null && !cells[row][col].isBlocked) {
        cells[row][col].isOneWay = directions[Math.floor(Math.random() * directions.length)];
      }
    }
    
    // Add teleport pairs
    if (this.difficulty === 'hard' || this.difficulty === 'expert') {
      const teleportPairs = Math.floor(this.gridSize * 0.25);
      
      for (let i = 0; i < teleportPairs; i++) {
        const pos1 = this.getRandomEmptyPosition(cells);
        const pos2 = this.getRandomEmptyPosition(cells);
        
        if (pos1 && pos2) {
          cells[pos1.row][pos1.col].isTeleport = true;
          cells[pos1.row][pos1.col].teleportTo = pos2;
          cells[pos2.row][pos2.col].isTeleport = true;
          cells[pos2.row][pos2.col].teleportTo = pos1;
        }
      }
    }
  }

  private getRandomEmptyPosition(cells: Cell[][]): Position | null {
    const emptyPositions: Position[] = [];
    
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (cells[row][col].value === null && !cells[row][col].isBlocked && !cells[row][col].isTeleport) {
          emptyPositions.push({ row, col });
        }
      }
    }
    
    if (emptyPositions.length === 0) return null;
    
    return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  }

  validateSolution(grid: Grid, path: Position[]): boolean {
    if (path.length === 0) return false;
    
    const startCell = grid.cells[path[0].row][path[0].col];
    if (startCell.value !== grid.startNumber) return false;
    
    let currentNumber = grid.startNumber;
    
    for (let i = 1; i < path.length; i++) {
      const prevPos = path[i - 1];
      const currentPos = path[i];
      
      // Check if move is valid
      if (!this.isValidMove(grid, prevPos, currentPos)) {
        return false;
      }
      
      const cell = grid.cells[currentPos.row][currentPos.col];
      if (cell.value !== null) {
        if (cell.value <= currentNumber) return false;
        currentNumber = cell.value;
      }
    }
    
    const lastCell = grid.cells[path[path.length - 1].row][path[path.length - 1].col];
    return lastCell.value === grid.endNumber;
  }

  private isValidMove(grid: Grid, from: Position, to: Position): boolean {
    // Check adjacent
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    
    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      const fromCell = grid.cells[from.row][from.col];
      const toCell = grid.cells[to.row][to.col];
      
      // Check blocked
      if (toCell.isBlocked) return false;
      
      // Check one-way
      if (fromCell.isOneWay) {
        const direction = this.getDirection(from, to);
        if (fromCell.isOneWay !== direction) return false;
      }
      
      return true;
    }
    
    // Check teleport
    const fromCell = grid.cells[from.row][from.col];
    if (fromCell.isTeleport && fromCell.teleportTo) {
      return fromCell.teleportTo.row === to.row && fromCell.teleportTo.col === to.col;
    }
    
    return false;
  }

  private getDirection(from: Position, to: Position): 'up' | 'down' | 'left' | 'right' | null {
    if (to.row < from.row) return 'up';
    if (to.row > from.row) return 'down';
    if (to.col < from.col) return 'left';
    if (to.col > from.col) return 'right';
    return null;
  }
}