export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  value: number | null;
  isBlocked?: boolean;
  isOneWay?: 'up' | 'down' | 'left' | 'right';
  isTeleport?: boolean;
  teleportTo?: Position;
  multiplier?: number;
  energyCost?: number;
  isConnected?: boolean;
  isVisited?: boolean;
}

export interface Grid {
  size: number;
  cells: Cell[][];
  startNumber: number;
  endNumber: number;
  currentPath: Position[];
}

export interface GameState {
  grid: Grid;
  currentNumber: number;
  moves: number;
  score: number;
  energy: number;
  isCompleted: boolean;
  difficulty: Difficulty;
  level: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface PlayerStats {
  totalGamesPlayed: number;
  totalGamesWon: number;
  bestScore: number;
  totalMoves: number;
  averageMovesPerGame: number;
  currentStreak: number;
  bestStreak: number;
  achievements: Achievement[];
  level: number;
  experience: number;
  rank: string;
}

export interface DailyChallenge {
  id: string;
  date: string;
  grid: Grid;
  difficulty: Difficulty;
  targetScore: number;
  timeLimit?: number;
  completed: boolean;
  leaderboard: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  score: number;
  moves: number;
  time: number;
  rank: number;
}