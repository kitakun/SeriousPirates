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
    public readonly collisionData: number[] = [];

    constructor(
        public readonly worldName: string = 'DefaultWorldName',
        public readonly worldSize: ISize = DEFAULT_WORLD_SIZE,
        public readonly tileSize: ISize = { width: 32, height: 32 },
        public readonly tilesCount: ISize = { width: 32, height: 32 },
    ) {
    }

    // TODO remove to service/helper/etc from model
    
}