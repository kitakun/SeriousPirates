import WorldDefinition from "../model/data/worldDefinition";

export const collisionDataToMatrix = (world: WorldDefinition): number[][] => {
    const result = new Array<Array<number>>(world.tilesCount.height);

    for (let row = 0; row < world.worldSize.height; row++) {
        result[row] = new Array<number>(world.worldSize.width);

        for (let column = 0; column < world.worldSize.width; column++) {
            result[row][column] = world.collisionData[column + row * world.worldSize.width] === 0
                ? 0
                : 1;
        }
    }

    return result;
}