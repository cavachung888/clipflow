
/**
 * Extracts the URL from the dirty text copied from Douyin.
 */
export const extractUrlFromText = (text: string): string | null => {
  // Strictly matches the base URL (v.douyin.com/ID) and ignores trailing slashes/params
  const urlRegex = /(https?:\/\/(?:www\.|v\.)?douyin\.com\/[A-Za-z0-9]+)/;
  const match = text.match(urlRegex);
  return match ? match[1] : null;
};

/**
 * Fetches video data using the provided API.
 */
export const fetchDouyinVideo = async (url: string): Promise<{ videoUrl: string; title: string; cover: string }> => {
  try {
    // Clean the URL just in case (remove trailing slashes or params if needed)
    const cleanUrl = url.split('?')[0].replace(/\/$/, '');
    const apiUrl = `https://api.bugpk.com/api/douyin?url=${encodeURIComponent(cleanUrl)}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to connect to extraction service');
    }

    const data = await response.json();
    
    // Handle API specific errors
    if (data.code !== 200 && data.msg !== 'success') {
       console.warn("Douyin API Raw Error:", data.msg);
       // The API sometimes returns weird messages like "1无法找到数据...", we mask this for the user
       throw new Error('Could not retrieve video information from this link.');
    }

    const videoData = data.data || data;
    
    return {
      videoUrl: videoData.video_url || videoData.play_addr || videoData.url,
      title: videoData.desc || videoData.title || 'Douyin Video',
      cover: videoData.cover || videoData.poster || ''
    };
  } catch (error) {
    console.error("Douyin API Error:", error);
    // Always guide user to manual upload on failure, as free APIs are unstable
    throw new Error("Link extraction unavailable. Please click 'Upload Video File' to use your local video file.");
  }
};

/**
 * Downloads the video file as a Blob.
 */
export const downloadVideoAsBlob = async (videoUrl: string): Promise<Blob> => {
  try {
    // CORS is the main enemy here for client-side only apps.
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error('Failed to download video stream');
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Video Download Error:", error);
    throw new Error("Browser blocked the download (CORS). Please save the video manually and use the 'Upload' button.");
  }
};
