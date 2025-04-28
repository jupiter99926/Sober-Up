/**
 * Represents physiological data from a wearable device.
 */
export interface WearableData {
  /**
   * The user's heart rate in beats per minute.
   */
  heartRate: number;
  /**
   * The user's sleep duration in hours.
   */
  sleepDuration: number;
}

/**
 * Asynchronously retrieves wearable data for a user.
 *
 * @returns A promise that resolves to a WearableData object containing heart rate and sleep duration.
 */
export async function getWearableData(): Promise<WearableData> {
  // TODO: Implement this by calling an API.

  // Simulating data for now
  console.warn("getWearableData is returning mock data. Implement actual API call.");
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  return {
    heartRate: Math.floor(Math.random() * (90 - 60 + 1)) + 60, // Random heart rate between 60 and 90
    sleepDuration: Math.round((Math.random() * (8.5 - 6) + 6) * 10) / 10, // Random sleep between 6 and 8.5 hours
  };
}
