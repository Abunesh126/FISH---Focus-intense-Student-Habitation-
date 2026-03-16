export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string | null;
  created_at?: string;
  updated_at?: string;
  completed_at?: string | null;
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
