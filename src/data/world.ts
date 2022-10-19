import { TILE_SIZE } from "../constants";
import City from "./city";
import Island from "./island";

const DEFAULT_WORLD_SIZE = { width: 960, height: 1240 };

export default class PiratesWorld {
    public get worldSizeInPixels(): ISize {
        return {
            width: this.worldSize.width * TILE_SIZE,
            height: this.worldSize.height * TILE_SIZE,
        }
    }

    public readonly islands: Island[] = [];
    public readonly cities: City[] = [];

    constructor(
        public readonly worldName: string = 'DefaultWorldName',
        public readonly worldSize: ISize = DEFAULT_WORLD_SIZE,
    ) {
    }
}