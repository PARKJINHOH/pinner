
import imageCompression from 'browser-image-compression';


/**
 * 이미지를 압축합니다.
 *
 * @param {File} imageFile
 * @return {File}
 */
export default async function compressImage(imageFile) {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    }
    const compressedFile = new File([await imageCompression(imageFile, options)], imageFile.name);
    // console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
    // console.log(`compressedFile size ${imageFile.arrayBuffer().size} to ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

    return compressedFile; // write your own logic
}
