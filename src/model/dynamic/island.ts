import GameWorld from "./gameWorld";

export default class Island implements IGameObject {
    constructor(
        protected readonly gameWorld: GameWorld,
    ) {
    }
}