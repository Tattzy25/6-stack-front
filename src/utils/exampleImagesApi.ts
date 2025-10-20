/**
 * Example Images API - Fetch example tattoo images from Neon database
 */

import { env } from './env';

const API_BASE_URL = env.apiBaseUrl;

export interface ExampleImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url?: string;
  category: 'freestyle' | 'couples' | 'coverup' | 'extend';
  style?: string;
  tags?: string[];
  is_featured?: boolean;
}

/**
 * Get random examples by category
 */
export async function getRandomExamples(
  category?: string,
  limit: number = 6
): Promise<ExampleImage[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/api/examples/random?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.examples || [];
  } catch (error) {
    console.error('Failed to fetch random examples:', error);
    // Return fallback data
    return getFallbackExamples(category, limit);
  }
}

/**
 * Get featured examples
 */
export async function getFeaturedExamples(): Promise<ExampleImage[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/examples/featured`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.examples || [];
  } catch (error) {
    console.error('Failed to fetch featured examples:', error);
    return getFallbackExamples(undefined, 12);
  }
}

/**
 * Get all examples by category
 */
export async function getExamplesByCategory(
  category: string,
  limit?: number
): Promise<ExampleImage[]> {
  try {
    const params = new URLSearchParams({ category });
    if (limit) params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/api/examples?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.examples || [];
  } catch (error) {
    console.error('Failed to fetch examples by category:', error);
    return getFallbackExamples(category, limit);
  }
}

/**
 * Increment view count for an example
 */
export async function incrementViewCount(exampleId: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/examples/${exampleId}/view`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Failed to increment view count:', error);
  }
}

/**
 * Fallback examples (if database is down)
 */
function getFallbackExamples(category?: string, limit: number = 6): ExampleImage[] {
  const fallbacks: ExampleImage[] = [
    {
      id: 'fallback-1',
      title: 'Minimalist Mountain',
      description: 'Clean line art mountain range',
      image_url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800',
      category: 'freestyle',
      style: 'minimalist',
      tags: ['linework', 'nature', 'small'],
      is_featured: true,
    },
    {
      id: 'fallback-2',
      title: 'Geometric Wolf',
      description: 'Angular geometric wolf design',
      image_url: 'https://images.unsplash.com/photo-1598371611808-d4b1e6c68c57?w=800',
      category: 'freestyle',
      style: 'geometric',
      tags: ['geometric', 'animal', 'medium'],
      is_featured: true,
    },
    {
      id: 'fallback-3',
      title: 'Lock & Key',
      description: 'Matching lock and key set',
      image_url: 'https://images.unsplash.com/photo-1610830626484-1504b6b4a1b9?w=800',
      category: 'couples',
      style: 'minimalist',
      tags: ['matching', 'romantic', 'small'],
      is_featured: true,
    },
    {
      id: 'fallback-4',
      title: 'Floral Cover',
      description: 'Large peony covering old tribal',
      image_url: 'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=800',
      category: 'coverup',
      style: 'floral',
      tags: ['flowers', 'colorful', 'large'],
      is_featured: true,
    },
    {
      id: 'fallback-5',
      title: 'Sleeve Addition',
      description: 'Extending shoulder piece to full sleeve',
      image_url: 'https://images.unsplash.com/photo-1565058142-a2c0c5de6b73?w=800',
      category: 'extend',
      style: 'mixed',
      tags: ['sleeve', 'floral', 'large'],
      is_featured: true,
    },
    {
      id: 'fallback-6',
      title: 'Japanese Koi',
      description: 'Traditional Japanese koi fish',
      image_url: 'https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=800',
      category: 'freestyle',
      style: 'japanese',
      tags: ['japanese', 'colorful', 'large'],
      is_featured: true,
    },
  ];

  let filtered = fallbacks;
  
  if (category) {
    filtered = fallbacks.filter(ex => ex.category === category);
  }

  return filtered.slice(0, limit);
}
