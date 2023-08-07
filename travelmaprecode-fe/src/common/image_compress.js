
import imageCompression from 'browser-image-compression';


/**
 * @param {File} imageFile
 * @return {File}
 */
export default async function comp(imageFile) {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    }

    const compressedFile = await imageCompression(imageFile, options);
    // console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
    // console.log(`compressedFile size ${imageFile.arrayBuffer().size} to ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

    return compressedFile; // write your own logic
}
