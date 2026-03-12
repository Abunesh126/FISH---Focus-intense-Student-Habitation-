export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  due_date?: string;
}

export interface LeaderboardEntry {
  id: number;
  username: string;
  score: number;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  updated_at: string;
}
