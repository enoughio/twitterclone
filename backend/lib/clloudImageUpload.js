export const uploadImage = async (image, folderName) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `${folderName}/${timestamp}`;

    try {
        const uploadResult = await cloudinary.uploader.upload(image, {
            public_id: publicId,  // public_id is the name of the image in cloudinary 
            folder: folderName,  // folder name in cloudinary where the image will be stored 
        });
        return uploadResult.secure_url;
    } catch (error) {
        throw new Error(`Error uploading ${folderName} image: ${error.message}`);
    }
};


 // Helper function to delete Cloudinary images
 export const deleteCloudinaryImage = async (imageUrl) => {
    try {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error(`Error deleting Cloudinary image: ${error.message}`);
    }
};