export function base64ToByteArray(base64String: string): number[] {
    try {
        const byteCharacters = atob(base64String);
        const bytesLength = byteCharacters.length;
        const byteArrays = new Array<number>(bytesLength);
        
        // Interpret binaryString as an array of bytes representing
        // little-endian encoded uint32 values.
        for (var j = 0; j < byteCharacters.length; j += 4) {
            byteArrays[j / 4] = (
                byteCharacters.charCodeAt(j) |
                byteCharacters.charCodeAt(j + 1) << 8 |
                byteCharacters.charCodeAt(j + 2) << 16 |
                byteCharacters.charCodeAt(j + 3) << 24
            ) >>> 0;
        }

        return byteArrays;
    } catch (e) {
        console.log("Couldn't convert to byte array: " + e);
        throw e;
    }
}