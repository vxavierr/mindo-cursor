
export interface LearningEntry {
  id: string;
  numeroId: number;
  title: string;
  content: string;
  context?: string;
  tags: string[];
  createdAt: string;
  step: number;
  reviews: Array<{ 
    date: string; 
    questions?: string[]; 
    answers?: string[]; 
    step?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }>;
}

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: LearningEntry[];
  onCompleteReview: (entryId: string, difficulty: 'easy' | 'medium' | 'hard', questions: string[], answers: string[]) => void;
}
