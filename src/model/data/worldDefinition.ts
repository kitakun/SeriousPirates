import { TILE_SIZE } from "../../constants";
import CityDefinition from "./cityDefinition";
import IslandDefinition from "./islandDefinition";
import { GameObjectDefinition } from "./objectDefinition";

const DEFAULT_WORLD_SIZE = { width: 960, height: 1240 };

export default class WorldDefinition {
    public get worldSizeInPixels(): ISize {
        return {
            width: this.worldSize.width * this.tileSize.width,
            height: this.worldSize.height * this.tileSize.height,
        }
    }

    public readonly islands: IslandDefinition[] = [];
    public readonly cities: CityDefinition[] = [];
    public readonly objects: GameObjectDefinition[] = [];

    constructor(
        public readonly worldName: string = 'DefaultWorldName',
        public readonly worldSize: ISize = DEFAULT_WORLD_SIZE,
        public readonly tileSize: ISize = { width: 32, height: 32 },
        public readonly tilesCount: ISize = { width: 32, height: 32 },
    ) {
    }

    public worldToTilePos(pos: IVector2): IVector2 {
        return {
            x: Number((pos.x / this.tileSize.width).toFixed()),
            y: Number((pos.y / this.tileSize.height).toFixed()),
        }
    }
}