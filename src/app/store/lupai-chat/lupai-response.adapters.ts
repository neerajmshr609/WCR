// Adapter functions to convert between WebSocket types and Lupai types

import {
  RetrieverItem,
  Organization,
  LanguageInfo,
  DomainInfo,
} from '../../services/multi-agent-websocket.service';

import {
  LupaiRetrieverItem,
  LupaiOrganization,
  LupaiLanguageInfo,
  LupaiDomainInfo,
} from './lupai-response.types';

/**
 * Convert WebSocket RetrieverItem to LupaiRetrieverItem
 * Note: WebSocket RetrieverItem has limited data, so we'll map what's available and provide defaults
 */
export function adaptRetrieverItem(item: RetrieverItem): LupaiRetrieverItem {
  return {
    document_name: 'source-data', // Not available in WebSocket type
    text: '', // Not available in WebSocket type
    text_with_context: null, // Not available in WebSocket type
    document_metadata: {
      source_url: undefined,
      source_author: undefined,
      source_name: undefined,
      source_domain: undefined,
      page: null,
      section: undefined,
      subsection: null,
      sub_subsection: null,
    },
    node_id: `node_${item.chunk_id}`, // Generate from chunk_id
    parent_node_id: '', // Not available
    chunk_size: 0, // Not available in current interface
    chunk_id: item.chunk_id,
    keyword_score: item.keyword_score,
    vector_score: item.vector_score,
    relative_hybrid_score: item.relative_hybrid_score,
    collection_metadata: {
      name: (item.collection_metadata?.name as string) || '',
      language: (item.collection_metadata?.language as string) || 'en',
      documents: (item.collection_metadata?.documents as any[]) || [],
      collector: (item.collection_metadata?.collector as string) || '',
      source_name: (item.collection_metadata?.source_name as string) || '',
      source_author: (item.collection_metadata?.source_author as string) || '',
      source_url: (item.collection_metadata?.source_url as string) || '',
      source_domain: (item.collection_metadata?.source_domain as string) || '',
      source_type: (item.collection_metadata?.source_type as string) || '',
      source_region: (item.collection_metadata?.source_region as string) || '',
      source_date: (item.collection_metadata?.source_date as string) || '',
      source_description:
        (item.collection_metadata?.source_description as string) || '',
    },
    child_node_ids: item.child_node_ids?.map((id) => String(id)) || [],
  };
}

/**
 * Convert WebSocket Organization to LupaiOrganization
 */
export function adaptOrganization(org: Organization): LupaiOrganization {
  return {
    name: org.name || '',
    description: org.description || '',
    website: org.website || '',
    score: org.score || 0,
  };
}

/**
 * Convert WebSocket LanguageInfo to LupaiLanguageInfo
 */
export function adaptLanguageInfo(lang: LanguageInfo): LupaiLanguageInfo {
  return {
    language_code: lang.language_code || 'en',
    language_name: lang.language_name || 'English',
  };
}

/**
 * Convert WebSocket DomainInfo to LupaiDomainInfo
 */
export function adaptDomainInfo(domain: DomainInfo): LupaiDomainInfo {
  return {
    domain: domain.domain || 'General',
    is_valid: domain.is_valid ?? true,
  };
}

/**
 * Convert arrays of WebSocket items to Lupai items
 */
export function adaptRetrieverItems(
  items: RetrieverItem[],
): LupaiRetrieverItem[] {
  return items.map(adaptRetrieverItem);
}

export function adaptOrganizations(orgs: Organization[]): LupaiOrganization[] {
  return orgs.map(adaptOrganization);
}
