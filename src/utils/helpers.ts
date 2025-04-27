/**
 * Decodes HTML entities in a string
 * @param text The text to decode
 * @returns The decoded text
 */
export const decodeHtmlEntities = (str?: string): string => {
  if (!str) return '';
  let txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
};

/**
 * Safely parses a string to an integer with fallback to 0
 * @param value The string value to parse
 * @returns The parsed integer or 0 if invalid
 */
export const safeParseInt = (value?: string): number => {
  if (!value) return 0;
  const parsed = parseInt(value);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Extracts the best image URL from an image object or array
 * @param image The image object, array, or string
 * @returns The best quality image URL
 */
export const getBestImageUrl = (image: any): string => {
  // Default image if no image provided
  const defaultImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABh0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzT7MfTgAAABZ0RVh0Q3JlYXRpb24gVGltZQAwMS8wOC8xMOr+6FIAAAPsSURBVHic7dyxjsIwFABBfOL/f9lXXIu2cC44ZqYGWysW2bFsN8MwjAFc2j79B8AnEwhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUA=';
  
  if (!image) return defaultImage;

  // Handle string URLs directly
  if (typeof image === 'string') return image;

  // Handle array of image objects
  if (Array.isArray(image) && image.length > 0) {
    // Try to find 500x500 image
    const highRes = image.find(img => img.quality === "500x500");
    if (highRes && highRes.url) return highRes.url;

    // Try to find 150x150 image
    const medRes = image.find(img => img.quality === "150x150");
    if (medRes && medRes.url) return medRes.url;

    // Fall back to first image
    if (image[0] && image[0].url) return image[0].url;
  }

  // Fallback
  return defaultImage;
};

export const getProxiedImageUrl = (url: any): string => {
  // If it's an array of image objects, extract the best URL
  if (Array.isArray(url)) {
    return getBestImageUrl(url);
  }
  
  // Default image if no URL provided
  if (!url) return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABh0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzT7MfTgAAABZ0RVh0Q3JlYXRpb24gVGltZQAwMS8wOC8xMOr+6FIAAAPsSURBVHic7dyxjsIwFABBfOL/f9lXXIu2cC44ZqYGWysW2bFsN8MwjAFc2j79B8AnEwhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUA=';
  
  // Ensure url is a string
  const urlStr = String(url);
  
  // If it's already a data URI, return as is
  if (urlStr.startsWith('data:')) return urlStr;
  
  // If it's a relative URL, return as is
  if (urlStr.startsWith('/')) return urlStr;
  
  // Direct return of URL, browsers can handle CORS for img tags
  return urlStr;
}; 