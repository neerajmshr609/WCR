export interface Review {
  negative_comment: string;
  positive_comment: string;
  instant_score: {
    pronunciation_rate: number;
    explanation_rate: number;
    knowledge_rate: number;
    politeness_rate: number;
  };
  skills: Array<{
    id: number;
    image: string;
    name: string;
  }>;
  user: {
    id: number;
    name: string;
  };
}
