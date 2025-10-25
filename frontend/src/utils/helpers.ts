/**
 * Utility helper functions
 */

/**
 * Format BPM value for display
 */
export const formatBpm = (bpm: number | null): string => {
  if (bpm === null || bpm === 0) return '--';
  return bpm.toFixed(1);
};

/**
 * Get signal quality color
 */
export const getSignalQualityColor = (quality: number): string => {
  if (quality >= 0.8) return '#52c41a'; // green
  if (quality >= 0.5) return '#faad14'; // orange
  return '#ff4d4f'; // red
};

/**
 * Get signal quality text
 */
export const getSignalQualityText = (quality: number): string => {
  if (quality >= 0.8) return 'Excellent';
  if (quality >= 0.5) return 'Good';
  if (quality >= 0.3) return 'Fair';
  return 'Poor';
};

/**
 * Download blob as file
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Format duration in seconds to readable string
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format timestamp to readable date
 */
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};
