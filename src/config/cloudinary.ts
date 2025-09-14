import { v2 as cloudinary } from 'cloudinary';

// Validate Cloudinary environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    console.error('Missing Cloudinary environment variables:');
    console.error('- CLOUDINARY_CLOUD_NAME:', cloudName ? '✓' : '✗');
    console.error('- CLOUDINARY_API_KEY:', apiKey ? '✓' : '✗');
    console.error('- CLOUDINARY_API_SECRET:', apiSecret ? '✓' : '✗');
    throw new Error('Cloudinary credentials are not properly configured. Please check your environment variables.');
}

try {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
    
    console.log('Cloudinary configured successfully');
} catch (error) {
    console.error('Failed to configure Cloudinary:', error);
    throw new Error('Failed to initialize Cloudinary configuration');
}

export default cloudinary;