declare module Tiled {

    export interface Object {
        class: string;
        height: number;
        id: number;
        name: string;
        point: boolean;
        properties: Property[];
        rotation: number;
        visible: boolean;
        width: number;
        x: number;
        y: number;
    }

    export interface Layer {
        compression: string;
        data: string;
        encoding: string;
        height: number;
        id: number;
        name: string;
        opacity: number;
        type: string;
        visible: boolean;
        width: number;
        x: number;
        y: number;
        locked?: boolean;
        draworder: string;
        objects: Object[];
        offsetx?: number;
        offsety?: number;
    }

    export interface Tileset {
        firstgid: number;
        source: string;
    }

    export interface Property {
        name: string;
        type: string;
        value: any;
    }

    export interface Map {
        compressionlevel: number;
        height: number;
        infinite: boolean;
        layers: Layer[];
        nextlayerid: number;
        nextobjectid: number;
        orientation: string;
        renderorder: string;
        tiledversion: string;
        tileheight: number;
        tilesets: Tileset[];
        tilewidth: number;
        type: string;
        version: string;
        width: number;
        properties: Property[];
    }

    export interface TilesetObject {
        columns: number;
        grid: Grid;
        margin: number;
        name: string;
        spacing: number;
        tilecount: number;
        tiledversion: string;
        tileheight: number;
        tiles: Tile[];
        tilewidth: number;
        type: string;
        version: string;
        properties: any;
    }

    export interface Grid {
        height: number;
        orientation: string;
        width: number;
    }

    export interface Tile {
        id: number;
        image: string;
        imageheight: number;
        imagewidth: number;
    }
}

