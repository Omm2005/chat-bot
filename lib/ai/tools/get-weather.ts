import { tool as createTool } from 'ai';
import { z } from 'zod';

// Geocoding function to get coordinates from city name
async function getCoordinatesFromCity(
  cityName: string,
): Promise<{ latitude: number; longitude: number }> {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`,
  );

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${cityName}" not found`);
  }

  const result = data.results[0];
  return {
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

const getWeather = createTool({
  description:
    'Get the current weather at a location. Can accept either coordinates or city name. If no location is provided, try to extract location from the conversation context.',
  inputSchema: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    cityName: z.string().optional(),
    context: z
      .string()
      .optional()
      .describe('Conversation context that might contain location information'),
  }),
  execute: async ({ latitude, longitude, cityName, context }: any) => {
    let finalLatitude = latitude;
    let finalLongitude = longitude;
    let finalCityName = cityName;

    // If no location provided but context is available, try to extract location from context
    if (!finalLatitude && !finalLongitude && !finalCityName && context) {
      // Look for common location patterns in the context
      const locationPatterns = [
        /(?:I live in|I'm in|I'm from|my location is|I'm located in)\s+([A-Za-z\s,]+)/i,
        /(?:weather in|weather at|weather for)\s+([A-Za-z\s,]+)/i,
        /(?:in|at|from)\s+([A-Za-z\s,]+?)(?:\s|$|,|\.)/i,
      ];

      for (const pattern of locationPatterns) {
        const match = context.match(pattern);
        if (match?.[1]) {
          finalCityName = match[1].trim().replace(/[.,]$/, '');
          break;
        }
      }
    }

    // If city name is provided, get coordinates from geocoding API
    if (finalCityName && !finalLatitude && !finalLongitude) {
      try {
        const coords = await getCoordinatesFromCity(finalCityName);
        finalLatitude = coords.latitude;
        finalLongitude = coords.longitude;
      } catch (error) {
        throw new Error(
          `Failed to get coordinates for city "${finalCityName}": ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    if (!finalLatitude || !finalLongitude) {
      throw new Error(
        'No valid location provided. Please specify a city name or coordinates.',
      );
    }

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${finalLatitude}&longitude=${finalLongitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const weatherData = await response.json();
    return weatherData;
  },
});

export default getWeather;
