/**
 * Weaviate Vector Provider (stub — ready to activate)
 *
 * To activate:
 * 1. npm install weaviate-ts-client
 * 2. Set WEAVIATE_URL, WEAVIATE_API_KEY in .env
 * 3. Set VECTOR_PROVIDER=weaviate in .env
 * 4. Uncomment the implementation below
 *
 * Weaviate advantage: built-in BM25 hybrid search (keyword + vector) which
 * complements our existing keyword retriever nicely during transition.
 */
import {
  IVectorProvider,
  VectorDocument,
  QueryOptions,
  QueryResult,
} from "./vector.interface";

export class WeaviateProvider implements IVectorProvider {
  private readonly url: string;
  private readonly apiKey: string;
  private readonly className = "ResumeSection";

  constructor() {
    this.url = process.env.WEAVIATE_URL ?? "http://localhost:8080";
    this.apiKey = process.env.WEAVIATE_API_KEY ?? "";
  }

  async upsert(_documents: VectorDocument[]): Promise<void> {
    // TODO: Uncomment and implement when activating Weaviate
    //
    // const weaviate = await import("weaviate-ts-client");
    // const client = weaviate.default.client({
    //   scheme: "https",
    //   host: this.url,
    //   apiKey: new weaviate.default.ApiKey(this.apiKey),
    // });
    // const batcher = client.batch.objectsBatcher();
    // documents.forEach((doc) => {
    //   batcher.withObject({
    //     class: this.className,
    //     id: doc.id,
    //     properties: { content: doc.content, ...doc.metadata },
    //   });
    // });
    // await batcher.do();
    throw new Error("WeaviateProvider.upsert not yet activated. See comments.");
  }

  async query(_queryText: string, _options?: QueryOptions): Promise<QueryResult[]> {
    throw new Error("WeaviateProvider.query not yet activated. See comments.");
  }

  async deleteByResumeId(_resumeId: string): Promise<void> {
    throw new Error("WeaviateProvider.deleteByResumeId not yet activated.");
  }

  async ping(): Promise<boolean> {
    return false;
  }
}
