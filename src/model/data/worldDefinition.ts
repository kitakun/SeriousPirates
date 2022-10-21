import { TILE_SIZE } from "../../constants";
import CityDefinition from "./cityDefinition";
import IslandDefinition from "./islandDefinition";
import { GameObjectDefinition } from "./objectDefinition";

const DEFAULT_WORLD_SIZE = { width: 960, height: 1240 };

export default class WorldDefinition {
    public get worldSizeInPixels(): ISize {
        return {
            width: this.worldSize.width * TILE_SIZE,
            height: this.worldSize.height * TILE_SIZE,
        }
    }

    public readonly islands: IslandDefinition[] = [];
    public readonly cities: CityDefinition[] = [];
    public readonly objects: GameObjectDefinition[] = [];

    constructor(
        public readonly worldName: string = 'DefaultWorldName',
        public readonly worldSize: ISize = DEFAULT_WORLD_SIZE,
    ) {
    }
}