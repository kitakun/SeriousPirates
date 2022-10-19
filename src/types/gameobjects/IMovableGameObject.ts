export default class IMovableGameObject implements IGameObject {
    protected _position: IVector2 = { x: 0, y: 0 };

    get position(): IVector2 {
        return this._position;
    }

    set position(value: IVector2) {
        this._position = value;
    }
}