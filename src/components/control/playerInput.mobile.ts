import Camera from "./camera";
import { IPlayerInput } from "./IPlayerInput";
import { InputEventsEnum, PlayerControlType } from "./playerInput";
import PirateEvents from "../../utils/pirateEvents";

const ZERO = { x: 0, y: 0 };

export default class PlayerInputMobile implements IPlayerInput {
    private readonly _events = new PirateEvents<InputEventsEnum>();
    private _isHoldClick = false;
    private _holdFrom = 0;

    public get controlType(): PlayerControlType {
        return PlayerControlType.Mobile;
    }

    public get direction(): IVector2 {
        const directionToReturn = this._direction;
        this._direction = ZERO;
        return directionToReturn;
    }

    private _direction: IVector2 = ZERO;
    private _position: IVector2 = ZERO;

    constructor(
        private readonly input: Phaser.Input.InputPlugin,
        private readonly scene: Phaser.Scenes.ScenePlugin,
        private readonly camera: Camera,
    ) {
        console.log("Will use Mobile controls (touch)");

        this.input.on("pointermove", this.onPointerMove.bind(this));
    }

    public update(time: number, delta: number): void {
        const prevIsHoldClick = this._isHoldClick;
        this._isHoldClick = this.input.activePointer.leftButtonDown();
        if (this._isHoldClick && this._holdFrom === 0) {
            this._holdFrom = time;
        }

        if (this._isHoldClick !== prevIsHoldClick) {
            const { x: curX, y: curY } = this.input.activePointer.position;
            this._events.emit(InputEventsEnum.Click, this._isHoldClick, (time - this._holdFrom) / 1000, { x: curX, y: curY });
        }

        if (!this._isHoldClick && this._holdFrom > 0) {
            this._holdFrom = 0;
        }
    }

    public on(event: InputEventsEnum, act: Function): () => void {
        return this._events.on(event, act);
    }

    private onPointerMove(p: Phaser.Input.Pointer) {
        if (!p.isDown) {
            this._direction = ZERO;
            return;
        }

        this._direction = {
            x: (p.x - p.prevPosition.x) / (p?.camera?.zoom ?? 1) * -0.4,
            y: (p.y - p.prevPosition.y) / (p?.camera?.zoom ?? 1) * -0.4
        }

        this._position = {
            x: this._position.x - this._direction.x,
            y: this._position.y - this._direction.y,
        }
    }
}
