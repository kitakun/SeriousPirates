import GameWorld from "../../model/dynamic/gameWorld";

export default class IMovableGameObject implements IGameObject {
    protected _position: IVector2 = { x: 0, y: 0 };
    protected _direction: IVector2 = { x: 0, y: 0 };
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

    get direction(): IVector2 {
        return this._direction;
    }
    set direction(newValue: IVector2) {
        this._direction = newValue;
        this.onDirectionUpdated && this.onDirectionUpdated();
    }

    constructor(
        protected readonly gameWorld: GameWorld,
        initialPosition: IVector2,
    ) {
        this.position = initialPosition;
        setTimeout(() => this.position = initialPosition);
    }

    protected onPositionUpdated?(): void;
    protected onDirectionUpdated?(): void;
}