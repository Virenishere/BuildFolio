/**
 * Pinecone Vector Provider (stub — ready to activate)
 *
 * To activate:
 * 1. npm install @pinecone-database/pinecone
 * 2. Set PINECONE_API_KEY, PINECONE_INDEX, PINECONE_ENVIRONMENT in .env
 * 3. Set VECTOR_PROVIDER=pinecone in .env
 * 4. Uncomment the implementation below
 * 5. Replace retrieveContext() calls in retriever.ts with this provider
 *
 * The embeddings are generated via Gemini's text-embedding model so we don't
 * need a separate embedding service.
 */
import {
  IVectorProvider,
  VectorDocument,
  QueryOptions,
  QueryResult,
} from "./vector.interface";

export class PineconeProvider implements IVectorProvider {
  private readonly indexName: string;
  private readonly apiKey: string;

  constructor() {
    this.indexName = process.env.PINECONE_INDEX ?? "buildfolio-resumes";
    this.apiKey = process.env.PINECONE_API_KEY ?? "";
  }

  async upsert(_documents: VectorDocument[]): Promise<void> {
    // TODO: Uncomment and implement when activating Pinecone
    //
    // const { Pinecone } = await import("@pinecone-database/pinecone");
    // const pc = new Pinecone({ apiKey: this.apiKey });
    // const index = pc.index(this.indexName);
    // const vectors = await Promise.all(
    //   documents.map(async (doc) => ({
    //     id: doc.id,
    //     values: await this.embed(doc.content),
    //     metadata: { ...doc.metadata, content: doc.content },
    //   }))
    // );
    // await index.upsert(vectors);
    throw new Error("PineconeProvider.upsert not yet activated. See comments.");
  }

  async query(_queryText: string, _options?: QueryOptions): Promise<QueryResult[]> {
    // TODO: Uncomment and implement when activating Pinecone
    //
    // const { Pinecone } = await import("@pinecone-database/pinecone");
    // const pc = new Pinecone({ apiKey: this.apiKey });
    // const index = pc.index(this.indexName);
    // const embedding = await this.embed(queryText);
    // const result = await index.query({
    //   vector: embedding,
    //   topK: options?.topK ?? 5,
    //   filter: options?.filter,
    //   includeMetadata: true,
    // });
    // return (result.matches ?? []).map((m) => ({
    //   id: m.id,
    //   score: m.score ?? 0,
    //   content: (m.metadata?.content as string) ?? "",
    //   metadata: (m.metadata as Record<string, string>) ?? {},
    // }));
    throw new Error("PineconeProvider.query not yet activated. See comments.");
  }

  async deleteByResumeId(_resumeId: string): Promise<void> {
    throw new Error("PineconeProvider.deleteByResumeId not yet activated.");
  }

  async ping(): Promise<boolean> {
    return false;
  }

  // private async embed(text: string): Promise<number[]> {
  //   const { gemini } = await import("../config/gemini");
  //   const result = await gemini.models.embedContent({
  //     model: "text-embedding-004",
  //     contents: text,
  //   });
  //   return result.embeddings?.[0]?.values ?? [];
  // }
}
