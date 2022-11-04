import CityDefinition from "../model/data/cityDefinition";
import IslandDefinition from "../model/data/islandDefinition";
import { GameObjectDefinition } from "../model/data/objectDefinition";
import WorldDefinition from "../model/data/worldDefinition";
import { base64ToByteArray } from "../utils";
import ImageCollection from "./imageCollection";

export const parseTiledMapToWorld = (mapName: string, tilesetsCacheNames: string[], cache: Phaser.Cache.BaseCache): WorldDefinition => {
    const map: Tiled.Map = cache.get(mapName);
    const tilesets: Tiled.TilesetObject[] = tilesetsCacheNames.map(m => cache.get(m));

    const world = new WorldDefinition(
        map.properties?.find(f => f.name === 'name')?.value,
        { width: map.width, height: map.height },
        { width: map.tilewidth, height: map.tileheight },
    );

    const parsedTilesets = tilesets.map(m => parseTileset(m, map));

    for (const layer of map.layers) {
        switch (layer.name) {
            case 'collision':
                {
                    const rawData = base64ToByteArray(layer.data);

                    world.collisionData.push(...rawData);
                }
                break;

            case 'islands':
                {
                    const rawData = base64ToByteArray(layer.data);
                    const filteredData = removeEmptyValuesFromArray(rawData, layer.width);
                    // TODO get right name somehow
                    const islandsSprites = parsedTilesets.find(f => f.name === 'map1_tileset_islands1.json');
                    for (let data of filteredData) {
                        const tileName = islandsSprites?.images.find(f => f.gid === data.val)?.image;
                        if (!tileName)
                            continue;

                        const newIslandData = new IslandDefinition(tileName, { x: Math.floor(data.x * world.tileSize.width), y: Math.floor(data.y * world.tileSize.height) });

                        world.islands.push(newIslandData);
                    }
                }
                break;

            default:
                {
                    const objects = layer.objects;
                    if (objects && objects.length > 0) {
                        for (const parsedObject of objects) {
                            switch (parsedObject.class) {
                                case 'City':
                                    world.cities.push(new CityDefinition(
                                        parsedObject.name,
                                        {
                                            x: parsedObject.x,
                                            y: parsedObject.y
                                        }
                                    ));
                                    break;

                                case 'Ship':
                                    world.objects.push(new GameObjectDefinition(
                                        parsedObject.name,
                                        parsedObject.class,
                                        {
                                            x: parsedObject.x,
                                            y: parsedObject.y
                                        },
                                        parsedObject.properties
                                    ));
                                    break;
                            }
                        }
                    } else {
                        console.warn(`Layer=${layer.name} don't contains objects and it's neither collision nor islands. What should I do with it?`);
                    }
                }
                break;
        }
    }

    return world;
}

const removeEmptyValuesFromArray = (data: number[], width: number) => {
    const importantValues = [];

    let xIndex = -1;
    let yIndex = 0;
    for (let index = 0; index < data.length; index++) {
        xIndex++;
        if (xIndex >= width) {
            yIndex++;
            xIndex = 0;
        }

        const currentValue = data[index];

        if (currentValue) {
            importantValues.push({
                x: xIndex,
                y: yIndex,
                val: ParseGID(data[index])
            });
        }
    }

    return importantValues;
}

export const internalTiledToArrays = (input: { width: number, height: number, data: string }) => {
    const rowData = Array.from(Array(input.height), () => new Array(input.width)) as Number[][];

    for (let y = 0; y < input.width; y++) {
        for (let x = 0; x < input.height; x++) {
            try {
                rowData[y][x] = input.data[x * 63 + y].charCodeAt(0);
            } catch {
                console.error(`Failed at x=${x} y=${y}`);
            }
        }
    }

    return rowData;
}

const FLIPPED_HORIZONTAL = 0x80000000;
const FLIPPED_VERTICAL = 0x40000000;
const FLIPPED_ANTI_DIAGONAL = 0x20000000;

function ParseGID(gid: number) {
    gid = gid & ~(FLIPPED_HORIZONTAL | FLIPPED_VERTICAL | FLIPPED_ANTI_DIAGONAL);
    // * huge piece of code was removed, because don't need it
    return gid;
}

function parseTileset(tileSet: Tiled.TilesetObject, mapOwner: Tiled.Map) {
    // * tile name should be equals to filename!
    const mapOwnerObject = mapOwner.tilesets.find(f => f.source === tileSet.name) as Tiled.Tileset;
    if (!mapOwnerObject)
        throw new Error(`Can't find ${tileSet.name} in map!`);

    const newCollection = new ImageCollection(
        tileSet.name,
        mapOwnerObject.firstgid,
        tileSet.tilewidth,
        tileSet.tileheight,
        tileSet.margin,
        tileSet.spacing,
        tileSet.properties);

    let maxId = 0;

    for (let t = 0; t < tileSet.tiles.length; t++) {
        let tile = tileSet.tiles[t];

        var imageName = tile.image.replace(/^.*[\\\/]/, '');
        var tileId = parseInt(tile.id as any, 10);
        var gid = mapOwnerObject.firstgid + tileId;
        newCollection.addImage(gid, imageName);

        maxId = Math.max(tileId, maxId);
    }

    newCollection.maxId = maxId;

    return newCollection;
}
