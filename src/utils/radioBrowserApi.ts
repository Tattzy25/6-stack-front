/**
 * Radio Browser API Integration
 * Docs: https://api.radio-browser.info
 * 
 * Tricks for best stations:
 * - Filter bitrate >= 120kbps (quality threshold)
 * - Sort by votes (community quality signal)
 * - Filter lastcheckok=1 (working streams only)
 * - Use clickcount for popularity
 * - Fallback between servers
 */

export interface RadioStation {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  votes: number;
  clickcount: number;
  bitrate: number;
  codec: string;
  lastcheckok: number;
  lastchecktime: string;
}

// Fallback servers (prioritized)
const API_SERVERS = [
  'https://fi1.api.radio-browser.info',
  'https://de2.api.radio-browser.info',
];

let currentServerIndex = 0;

/**
 * Get current API server with fallback
 */
function getApiServer(): string {
  return API_SERVERS[currentServerIndex];
}

/**
 * Fallback to next server if request fails
 */
function fallbackToNextServer(): void {
  currentServerIndex = (currentServerIndex + 1) % API_SERVERS.length;
  console.log(`Falling back to server: ${getApiServer()}`);
}

/**
 * Make API request with server fallback
 */
async function apiRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
  const queryString = new URLSearchParams(params).toString();
  const url = `${getApiServer()}${endpoint}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TaTTTy/1.0', // Speaking HTTP agent string
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Request failed to ${getApiServer()}:`, error);
    
    // Try next server
    fallbackToNextServer();
    
    // Retry once with fallback server
    const fallbackUrl = `${getApiServer()}${endpoint}${queryString ? `?${queryString}` : ''}`;
    const fallbackResponse = await fetch(fallbackUrl, {
      headers: {
        'User-Agent': 'TaTTTy/1.0',
        'Content-Type': 'application/json',
      },
    });

    if (!fallbackResponse.ok) {
      throw new Error(`Fallback request also failed: ${fallbackResponse.status}`);
    }

    return await fallbackResponse.json();
  }
}

/**
 * Get top quality radio stations with smart filtering
 * 
 * TRICKS APPLIED:
 * - Minimum 120kbps bitrate (quality threshold)
 * - Only working streams (lastcheckok=1)
 * - Sorted by votes (community quality signal)
 * - High clickcount (popular = reliable)
 * - Limit to manageable number
 */
export async function getTopStations(
  limit: number = 500,
  minBitrate: number = 120
): Promise<RadioStation[]> {
  try {
    // Get stations with quality filters
    const stations = await apiRequest<RadioStation[]>('/json/stations/search', {
      limit: limit.toString(),
      order: 'votes', // Sort by community votes (best quality indicator)
      reverse: 'true', // Highest votes first
      hidebroken: 'true', // Hide broken streams
      has_extended_info: 'true', // Only stations with full metadata
    });

    // Additional filtering for best quality
    const filteredStations = stations.filter(station => {
      return (
        station.bitrate >= minBitrate && // Quality threshold
        station.lastcheckok === 1 && // Working stream
        station.votes >= 1 && // Has community approval
        station.url_resolved && // Has valid stream URL
        station.codec // Has codec info (shows it's real stream)
      );
    });

    // Sort by combination of votes and clicks (best quality + popularity)
    filteredStations.sort((a, b) => {
      const scoreA = a.votes * 2 + (a.clickcount / 1000);
      const scoreB = b.votes * 2 + (b.clickcount / 1000);
      return scoreB - scoreA;
    });

    return filteredStations.slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch radio stations:', error);
    return getFallbackStations();
  }
}

/**
 * Get stations by genre with quality filtering
 */
export async function getStationsByGenre(
  genre: string,
  limit: number = 50,
  minBitrate: number = 120
): Promise<RadioStation[]> {
  try {
    const stations = await apiRequest<RadioStation[]>('/json/stations/bytag/' + encodeURIComponent(genre), {
      limit: limit.toString(),
      order: 'votes',
      reverse: 'true',
      hidebroken: 'true',
    });

    return stations.filter(station => 
      station.bitrate >= minBitrate && 
      station.lastcheckok === 1
    );
  } catch (error) {
    console.error(`Failed to fetch ${genre} stations:`, error);
    return [];
  }
}

/**
 * Get stations by country
 */
export async function getStationsByCountry(
  countrycode: string,
  limit: number = 50,
  minBitrate: number = 120
): Promise<RadioStation[]> {
  try {
    const stations = await apiRequest<RadioStation[]>('/json/stations/bycountrycodeexact/' + countrycode, {
      limit: limit.toString(),
      order: 'votes',
      reverse: 'true',
      hidebroken: 'true',
    });

    return stations.filter(station => 
      station.bitrate >= minBitrate && 
      station.lastcheckok === 1
    );
  } catch (error) {
    console.error(`Failed to fetch stations for ${countrycode}:`, error);
    return [];
  }
}

/**
 * Search stations by name
 */
export async function searchStations(
  query: string,
  limit: number = 50,
  minBitrate: number = 120
): Promise<RadioStation[]> {
  try {
    const stations = await apiRequest<RadioStation[]>('/json/stations/search', {
      name: query,
      limit: limit.toString(),
      order: 'votes',
      reverse: 'true',
      hidebroken: 'true',
    });

    return stations.filter(station => 
      station.bitrate >= minBitrate && 
      station.lastcheckok === 1
    );
  } catch (error) {
    console.error(`Failed to search stations for "${query}":`, error);
    return [];
  }
}

/**
 * Register a click (helps mark stations as popular)
 * Call this whenever user starts playing a station
 */
export async function registerClick(stationuuid: string): Promise<void> {
  try {
    await apiRequest(`/json/url/${stationuuid}`, {});
  } catch (error) {
    console.error('Failed to register click:', error);
  }
}

/**
 * Get popular genres/tags
 */
export async function getPopularTags(limit: number = 20): Promise<string[]> {
  try {
    const tags = await apiRequest<Array<{ name: string; stationcount: number }>>('/json/tags', {
      limit: limit.toString(),
      order: 'stationcount',
      reverse: 'true',
    });

    return tags.map(tag => tag.name);
  } catch (error) {
    console.error('Failed to fetch popular tags:', error);
    return ['rock', 'pop', 'jazz', 'electronic', 'classical'];
  }
}

/**
 * Fallback stations (high quality, known working streams)
 * Used if API is completely unavailable
 */
function getFallbackStations(): RadioStation[] {
  return [
    {
      stationuuid: 'fallback-1',
      name: 'SomaFM - Groove Salad',
      url: 'https://ice1.somafm.com/groovesalad-128-mp3',
      url_resolved: 'https://ice1.somafm.com/groovesalad-128-mp3',
      homepage: 'https://somafm.com',
      favicon: 'https://somafm.com/favicon.ico',
      tags: 'ambient,electronic,chillout',
      country: 'USA',
      countrycode: 'US',
      state: 'California',
      language: 'english',
      votes: 1000,
      clickcount: 50000,
      bitrate: 128,
      codec: 'MP3',
      lastcheckok: 1,
      lastchecktime: new Date().toISOString(),
    },
    {
      stationuuid: 'fallback-2',
      name: 'SomaFM - Drone Zone',
      url: 'https://ice1.somafm.com/dronezone-128-mp3',
      url_resolved: 'https://ice1.somafm.com/dronezone-128-mp3',
      homepage: 'https://somafm.com',
      favicon: 'https://somafm.com/favicon.ico',
      tags: 'ambient,drone,electronic',
      country: 'USA',
      countrycode: 'US',
      state: 'California',
      language: 'english',
      votes: 900,
      clickcount: 40000,
      bitrate: 128,
      codec: 'MP3',
      lastcheckok: 1,
      lastchecktime: new Date().toISOString(),
    },
    {
      stationuuid: 'fallback-3',
      name: 'SomaFM - Metal Detector',
      url: 'https://ice1.somafm.com/metal-128-mp3',
      url_resolved: 'https://ice1.somafm.com/metal-128-mp3',
      homepage: 'https://somafm.com',
      favicon: 'https://somafm.com/favicon.ico',
      tags: 'metal,rock,heavy',
      country: 'USA',
      countrycode: 'US',
      state: 'California',
      language: 'english',
      votes: 850,
      clickcount: 35000,
      bitrate: 128,
      codec: 'MP3',
      lastcheckok: 1,
      lastchecktime: new Date().toISOString(),
    },
  ];
}
