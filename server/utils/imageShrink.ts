import axios from 'axios';

interface ImageOptimizationResult {
    optimizedImage: Buffer;
    initialSize: number;
    optimizedSize: number;
}

export const optimizeImage = async (imageBuffer: Buffer): Promise<ImageOptimizationResult> => {
    try {
        const initialSize = imageBuffer.length;

        // TinyPNG API integration
        const response = await axios.post('https://api.tinify.com/shrink', imageBuffer, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`api:${process.env.TINYPNG_API_KEY}`).toString('base64')}`,
                'Content-Type': 'application/octet-stream'
            }
        });

        // Download optimized image
        const optimizedImageResponse = await axios.get(response.data.output.url, {
            responseType: 'arraybuffer'
        });

        const optimizedBuffer = Buffer.from(optimizedImageResponse.data);

        return {
            optimizedImage: optimizedBuffer,
            initialSize,
            optimizedSize: optimizedBuffer.length
        };
    } catch (error) {
        console.error('Image optimization failed:', error);
        throw new Error('Image optimization failed');
    }
};