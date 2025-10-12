export interface Ratebacks {
  discouraging: number;
  unhelpful: number;
  helpful: number;
  inspiring: number;
}

export interface AdviseScores {
  pronunciation_rate: number;
  knowledge_rate: number;
  explanation_rate: number;
}

export interface DataForStudent {
  last_interaction: Date;
  spent_total: number;
  time_spent: number;
  ratebacks: Ratebacks;
  advise_scores: AdviseScores;
}

export interface DataForAdvisor {
  last_interaction: Date;
  time_spent: number;
  ratebacks: Ratebacks;
  advise_scores: AdviseScores;
  income_total: number;
}

export interface StudentStats {
  data: DataForStudent;
}

export interface AdvisorStats {
  data: DataForAdvisor;
}

export interface UserForStats {
  id: number;
  last_interaction_date: Date;
  name: string;
  username: string;
}
