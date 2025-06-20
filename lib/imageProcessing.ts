import { ImageAnnotatorClient } from '@google-cloud/vision';
import sharp from 'sharp';

const vision = new ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}'),
});

export interface ImageAnalysis {
  style?: string;
  colors: string[];
  features: string[];
  roomType?: string;
  brightness: number;
  vector: number[];
}

export async function analyzeImage(imageUrl: string): Promise<ImageAnalysis> {
  try {
    // Download and process image
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    
    // Optimize image for analysis
    const optimizedBuffer = await sharp(Buffer.from(buffer))
      .resize(800, 800, { fit: 'inside' })
      .toBuffer();

    // Perform image analysis
    const [result] = await vision.annotateImage({
      image: { content: optimizedBuffer.toString('base64') },
      features: [
        { type: 'LABEL_DETECTION' },
        { type: 'IMAGE_PROPERTIES' },
        { type: 'OBJECT_LOCALIZATION' },
        { type: 'SAFE_SEARCH_DETECTION' },
      ],
    });

    // Extract relevant information
    const labels = result.labelAnnotations || [];
    const properties = result.imagePropertiesAnnotation;
    const objects = result.localizedObjectAnnotations || [];

    // Determine room type
    const roomType = determineRoomType(labels);

    // Extract colors
    const colors = extractColors(properties);

    // Calculate brightness
    const brightness = calculateBrightness(properties);

    // Extract features
    const features = extractFeatures(labels, objects);

    // Determine style
    const style = determineStyle(labels, features);

    // Generate image vector (placeholder - replace with actual vector generation)
    const vector = generateImageVector(labels, objects, properties);

    return {
      style,
      colors,
      features,
      roomType,
      brightness,
      vector,
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

function determineRoomType(labels: any[]): string | undefined {
  const roomTypes = ['kitchen', 'bathroom', 'bedroom', 'living room', 'dining room'];
  const relevantLabels = labels
    .filter(label => roomTypes.includes(label.description.toLowerCase()))
    .sort((a, b) => b.score - a.score);

  return relevantLabels[0]?.description;
}

function extractColors(properties: any): string[] {
  if (!properties?.dominantColors?.colors) return [];
  
  return properties.dominantColors.colors
    .map((color: any) => {
      const { red, green, blue } = color.color;
      return `rgb(${red}, ${green}, ${blue})`;
    })
    .slice(0, 5); // Get top 5 colors
}

function calculateBrightness(properties: any): number {
  if (!properties?.dominantColors?.colors) return 0;
  
  const colors = properties.dominantColors.colors;
  const brightness = colors.reduce((acc: number, color: any) => {
    const { red, green, blue } = color.color;
    return acc + (red + green + blue) / 3;
  }, 0) / colors.length;

  return brightness / 255; // Normalize to 0-1
}

function extractFeatures(labels: any[], objects: any[]): string[] {
  const features = new Set<string>();

  // Add relevant labels
  labels.forEach(label => {
    if (label.score > 0.7) { // Only include high-confidence labels
      features.add(label.description);
    }
  });

  // Add detected objects
  objects.forEach(obj => {
    if (obj.score > 0.7) {
      features.add(obj.name);
    }
  });

  return Array.from(features);
}

function determineStyle(labels: any[], features: string[]): string {
  const styleKeywords = {
    modern: ['modern', 'contemporary', 'minimalist'],
    traditional: ['traditional', 'classic', 'vintage'],
    industrial: ['industrial', 'loft', 'warehouse'],
    rustic: ['rustic', 'farmhouse', 'country'],
  };

  const styleScores = Object.entries(styleKeywords).map(([style, keywords]) => {
    const score = keywords.reduce((acc, keyword) => {
      const matches = [...labels, ...features].filter(item => 
        item.toLowerCase().includes(keyword)
      ).length;
      return acc + matches;
    }, 0);
    return { style, score };
  });

  const bestMatch = styleScores.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  return bestMatch.score > 0 ? bestMatch.style : 'unknown';
}

function generateImageVector(labels: any[], objects: any[], properties: any): number[] {
  // This is a placeholder - replace with actual vector generation
  // You might want to use a pre-trained model or service for this
  return Array(512).fill(0).map(() => Math.random());
} 