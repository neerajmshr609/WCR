// TypeScript interfaces for Lupai response structure

export interface LupaiUserQuery {
  user_query: string;
  user_context: {
    origin_country: string;
    time_in_germany: string;
    age: string;
  };
  location: string;
}

export interface LupaiStatusDisplay {
  status: string | null;
  display_message: string | null;
}

export interface LupaiLanguageInfo {
  language_code: string;
  language_name: string;
}

export interface LupaiDomainInfo {
  domain: string;
  is_valid: boolean;
}

export interface LupaiImprovedQuery {
  query: string;
  warning: string;
}

export interface LupaiSensitiveTopic {
  topic: string;
  warning: string;
}

export interface LupaiRetrieverItem {
  document_name: string;
  text: string;
  text_with_context?: string | null;
  document_metadata: {
    source_url?: string;
    source_author?: string;
    source_name?: string;
    source_domain?: string;
    page?: number | null;
    section?: string;
    subsection?: string | null;
    sub_subsection?: string | null;
  };
  node_id: string;
  parent_node_id: string;
  chunk_size: number;
  chunk_id: number;
  keyword_score: number;
  vector_score: number;
  relative_hybrid_score: number;
  collection_metadata: {
    name: string;
    language: string;
    documents: any[];
    collector: string;
    source_name: string;
    source_author: string;
    source_url: string;
    source_domain: string;
    source_type: string;
    source_region: string;
    source_date: string;
    source_description: string;
  };
  child_node_ids: string[];
}

export interface LupaiOrganization {
  name: string;
  description: string;
  website: string;
  score: number;
}

export interface LupaiAssistantResponse {
  answer: string;
  improved_answer: string;
  answer_found: boolean;
}

export interface LupaiResponse {
  assistant_response: LupaiAssistantResponse | null;
  retriever_items: LupaiRetrieverItem[];
  status: string | null;
  status_display: LupaiStatusDisplay;
  language: LupaiLanguageInfo | null;
  domain: LupaiDomainInfo | null;
  improved_query: LupaiImprovedQuery | null;
  sensitive_topic: LupaiSensitiveTopic | null;
  intent: string | null;
  topics: string[] | null;
  organizations: LupaiOrganization[] | null;
  is_final_response: boolean;
  is_clarification: boolean;
  error: string | null;
}

export interface LupaiProgressUpdate {
  status: string;
  status_display: LupaiStatusDisplay;
  is_final_response: boolean;
}

// Combined response that includes both the query and response
export interface LupaiConversationTurn {
  user_query: LupaiUserQuery;
  responses: LupaiResponse[];
}

// Processing stages enum for better type safety
export enum LupaiProcessingStage {
  LANGUAGE_DETECTOR = 'language_detector',
  DOMAIN_DETECTOR = 'domain_detector',
  RETRIEVER = 'retriever',
  QUERY_OPTIMIZER = 'query_optimizer',
  SENSITIVE_TOPIC_DETECTOR = 'sensitive_topic_detector',
  INTENT_DETECTOR = 'intent_detector',
  CLARIFICATION_DECIDER = 'clarification_decider',
  CLARIFICATION_REQUESTER = 'clarification_requester',
  CLARIFICATION_CHECKPOINT = 'clarification_checkpoint',
  ASSISTANT = 'assitant', // Note: this matches the JSON typo
  ANSWER_IMPROVER = 'answer_improver',
  TOPIC_DETECTOR = 'topic_detector',
  NEW_IMMIGRATION_LAW_FIXER = 'new_immigration_law_fixer',
  ORGANIZATION_RECOMMENDER = 'organization_recommender',
  RESPONSE_SENSITIZER = 'response_sensitizer',
  OUTPUT_PARSER = 'output_parser',
}

// Status messages for each stage
export const STAGE_DISPLAY_MESSAGES: Record<LupaiProcessingStage, string> = {
  [LupaiProcessingStage.LANGUAGE_DETECTOR]: 'Detecting language...',
  [LupaiProcessingStage.DOMAIN_DETECTOR]: 'Analyzing domain...',
  [LupaiProcessingStage.RETRIEVER]:
    'Searching for sources to answer question...',
  [LupaiProcessingStage.QUERY_OPTIMIZER]: 'Optimizing query...',
  [LupaiProcessingStage.SENSITIVE_TOPIC_DETECTOR]:
    'Checking for sensitive topics...',
  [LupaiProcessingStage.INTENT_DETECTOR]: 'Understanding intent...',
  [LupaiProcessingStage.CLARIFICATION_DECIDER]:
    'Deciding if clarification needed...',
  [LupaiProcessingStage.CLARIFICATION_REQUESTER]:
    'Identifying missing information to provide response...',
  [LupaiProcessingStage.CLARIFICATION_CHECKPOINT]:
    'Processing clarification...',
  [LupaiProcessingStage.ASSISTANT]: 'Generating response...',
  [LupaiProcessingStage.ANSWER_IMPROVER]: 'Improving response...',
  [LupaiProcessingStage.TOPIC_DETECTOR]: 'Detecting topics...',
  [LupaiProcessingStage.NEW_IMMIGRATION_LAW_FIXER]:
    'Checking consistency with changes in migration law...',
  [LupaiProcessingStage.ORGANIZATION_RECOMMENDER]:
    'Finding helpful organizations...',
  [LupaiProcessingStage.RESPONSE_SENSITIZER]: 'Improving response tone...',
  [LupaiProcessingStage.OUTPUT_PARSER]: 'Finalizing response...',
};
