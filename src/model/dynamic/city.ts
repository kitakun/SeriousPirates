import GameWorld from "./gameWorld";

export default class City implements IGameObject {
    constructor(
        protected readonly gameWorld: GameWorld,
    ) {
    }
}