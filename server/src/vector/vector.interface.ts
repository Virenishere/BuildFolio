/**
 * IVectorProvider — the contract every vector DB adapter must implement.
 *
 * Architecture: By programming against this interface rather than any specific
 * SDK, we can swap Pinecone → Weaviate → Qdrant → Supabase Vector with a
 * one-line change in the DI/factory function. The RAG retriever only depends
 * on this interface, never on a concrete provider.
 *
 * Migration steps when adding a real vector DB:
 * 1. Implement this interface in a new provider file (e.g., pinecone.provider.ts)
 * 2. Call provider.upsert() during resume save/update to keep the index fresh
 * 3. Replace retrieveContext() in retriever.ts with provider.query()
 * 4. Set VECTOR_PROVIDER env var to select the active provider
 */
export interface VectorDocument {
  id: string;
  content: string;
  embedding?: number[];
  metadata: Record<string, string>;
}

export interface QueryOptions {
  topK?: number;
  filter?: Record<string, string>;
  includeMetadata?: boolean;
}

export interface QueryResult {
  id: string;
  score: number;
  content: string;
  metadata: Record<string, string>;
}

export interface IVectorProvider {
  /**
   * Embed and upsert documents into the vector index.
   * Should be called whenever a resume is created or updated.
   */
  upsert(documents: VectorDocument[]): Promise<void>;

  /**
   * Query the vector index for the most semantically similar documents.
   * @param queryText — the natural language query (will be embedded internally)
   * @param options — topK, metadata filters, etc.
   */
  query(queryText: string, options?: QueryOptions): Promise<QueryResult[]>;

  /**
   * Delete all vectors associated with a resume (called on resume delete).
   */
  deleteByResumeId(resumeId: string): Promise<void>;

  /**
   * Healthcheck — returns true if the provider is reachable.
   */
  ping(): Promise<boolean>;
}
