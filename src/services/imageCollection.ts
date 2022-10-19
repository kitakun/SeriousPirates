export default class ImageCollection {
    public readonly firstgid: number;
    public readonly imageWidth: number;
    public readonly imageHeight: number;
    public readonly imageMargin: number;
    public readonly imageSpacing: number;
    public readonly properties: any;
    public readonly images: { gid: number, image: any }[] = [];
    public total: number = 0;
    public maxId: number = 0;

    constructor(
        public readonly name: string,
        firstgid: number,
        width: number,
        height: number,
        margin: number,
        spacing: number,
        properties: any) {
        if (width === undefined || width <= 0) {
            width = 32;
        }
        if (height === undefined || height <= 0) {
            height = 32;
        }
        if (margin === undefined) {
            margin = 0;
        }
        if (spacing === undefined) {
            spacing = 0;
        }

        this.firstgid = firstgid | 0;
        this.imageWidth = width | 0;
        this.imageHeight = height | 0;
        this.imageMargin = margin | 0;
        this.imageSpacing = spacing | 0;
        this.properties = properties || {};
    };

    public containsImageIndex(imageIndex: number): boolean {
        return (imageIndex >= this.firstgid && imageIndex < (this.firstgid + this.total));
    }

    public addImage(gid: number, image: any): ImageCollection {
        this.images.push({ gid: gid, image: image });
        this.total++;

        return this;
    }
}