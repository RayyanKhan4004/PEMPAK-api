import cloudinary from '../config/cloudinary';

export interface UploadResponse {
    url: string;
    public_id: string;
}


/**
 * Uploads an image to Cloudinary
 * @param file Image file buffer or base64 string
 * @param folder Optional folder name in Cloudinary
 * @returns Promise with upload response containing url and public_id
 */
export async function uploadImage(file: string | Buffer, folder = 'pempak'): Promise<UploadResponse> {
    try {
        const uploadOptions = {
            folder,
            resource_type: 'auto' as const,
            transformation: [
                { quality: 'auto:best' },
                { fetch_format: 'auto' }
            ]
        };

        let uploadResponse;

        // If it's a Buffer, upload directly using upload_stream
        if (Buffer.isBuffer(file)) {
            uploadResponse = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(file);
            });
        } 
        // If it's already a data URL, upload directly
        else if (file.startsWith('data:')) {
            uploadResponse = await cloudinary.uploader.upload(file, uploadOptions);
        } 
        // If it's a plain string, treat as base64
        else {
            uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${file}`, uploadOptions);
        }

        return {
            url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id,
        };
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
        throw new Error('Failed to upload image');
    }
}

/**
 * Deletes an image from Cloudinary
 * @param public_id The public_id of the image to delete
 * @returns Promise indicating success
 */
export async function deleteImage(public_id: string): Promise<boolean> {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        return result.result === 'ok';
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw new Error('Failed to delete image');
    }
}