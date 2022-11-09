import GameWorld from "../../model/dynamic/gameWorld";

export default class IMovableGameObject implements IGameObject {
    protected _position: IVector2 = { x: 0, y: 0 };
    public moveSpeed = 4;

    /**
     * Position in world WITH bounds offset!
     */
    get position(): IVector2 {
        return this._position;
    }

    set position(value: IVector2) {
        this._position = value;
        this.onPositionUpdated && this.onPositionUpdated();
    }

    constructor(
        protected readonly gameWorld: GameWorld,
        initialPosition: IVector2,
    ) {
        setTimeout(() => this.position = initialPosition);
    }

    protected onPositionUpdated?(): void;
}