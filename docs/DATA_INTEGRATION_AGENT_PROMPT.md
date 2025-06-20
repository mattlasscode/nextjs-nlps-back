# Data Integration Agent Prompt

## Context
You are working on **Fetchbar**, an AI-powered real estate search platform. The system allows real estate companies to integrate natural language search into their websites with a single line of code.

## Current State
- **Backend**: Next.js with Prisma ORM, PostgreSQL database
- **Vector Search**: Qdrant cluster configured and ready
- **Frontend**: Embed script ready for client websites
- **Mock Data**: Real estate listings exist in a separate mock website (Vitek)

## Missing Component: Data Integration Pipeline

### Objective
Build a complete data integration system that allows real estate clients (like Vitek) to:
1. Upload their property data (CSV, API, or database connection)
2. Process and validate the data
3. Generate text and image embeddings
4. Store data in PostgreSQL and vectors in Qdrant
5. Provide a unique API key for the client

### Technical Requirements

#### 1. Data Ingestion
- **Input Formats**: CSV, JSON, API endpoints, direct database connections
- **Validation**: Ensure required fields (title, description, price, location, bedrooms, bathrooms, squareFeet, propertyType, images)
- **Error Handling**: Graceful handling of malformed data, missing images, etc.
- **Batch Processing**: Handle large datasets efficiently

#### 2. Embedding Generation
- **Text Embeddings**: Use Hugging Face models (e.g., `intfloat/e5-small-v2`) for listing descriptions
- **Image Embeddings**: Use BLIP/CLIP models for property images
- **Vector Storage**: Store embeddings in Qdrant with metadata linking to PostgreSQL records
- **Performance**: Process embeddings asynchronously for large datasets

#### 3. API Key Management
- **Generation**: Create unique API keys for each client
- **Authentication**: Validate API keys in search requests
- **Rate Limiting**: Implement basic rate limiting per API key
- **Security**: Secure storage and transmission of API keys

#### 4. Data Models
```typescript
// Client/Organization
interface Client {
  id: string;
  name: string;
  apiKey: string;
  dataSource: DataSource;
  createdAt: Date;
}

// Data Source
interface DataSource {
  type: 'csv' | 'api' | 'database';
  config: any;
  lastSync: Date;
  status: 'active' | 'error' | 'syncing';
}

// Listing (already exists in Prisma schema)
interface Listing {
  id: string;
  clientId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  images: Image[];
  textVector: number[];
  imageVector: number[];
  features: string[];
  style: string;
  condition: string;
}
```

### Implementation Priorities

#### Phase 1: Basic CSV Import
1. Create CSV upload endpoint
2. Parse and validate CSV data
3. Store in PostgreSQL
4. Generate basic text embeddings
5. Store in Qdrant

#### Phase 2: Image Processing
1. Download and process property images
2. Generate image embeddings
3. Store image metadata and vectors

#### Phase 3: API Key System
1. Generate unique API keys
2. Implement authentication middleware
3. Update search API to use API keys

#### Phase 4: Advanced Features
1. Real-time data sync
2. Multiple data source types
3. Admin dashboard for data management

### Key Considerations
- **Scalability**: Design for multiple clients with large datasets
- **Error Recovery**: Handle failed imports and partial data
- **Monitoring**: Log processing status and errors
- **Security**: Validate and sanitize all input data
- **Performance**: Use background jobs for heavy processing

### Testing Strategy
1. Test with Vitek's mock data
2. Validate embedding quality
3. Test search relevance
4. Performance testing with larger datasets

### Success Criteria
- Client can upload CSV and get working search within 5 minutes
- Search results are relevant and fast (< 200ms)
- System can handle 10,000+ listings per client
- API key authentication works correctly

## Next Steps
1. Start with Phase 1 (CSV import)
2. Create basic admin interface for data upload
3. Implement embedding generation pipeline
4. Test end-to-end with Vitek data
5. Add API key management
6. Iterate based on testing results

---

**Remember**: This is for an MVP, so prioritize simplicity and speed over perfect optimization. The goal is to get a working system that can be improved later. 