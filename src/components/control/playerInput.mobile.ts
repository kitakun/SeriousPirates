import { IPlayerInput } from "./IPlayerInput";
import { PlayerControlType } from "./playerInput";

const ZERO = { x: 0, y: 0 };

export default class PlayerInputMobile implements IPlayerInput {
    private readonly _events = new Map<InputEventsEnum, Function[]>();
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

        if (this._isHoldClick !== prevIsHoldClick && this._events.has(InputEventsEnum.Click)) {
            const { x: curX, y: curY } = this.input.activePointer.position;
            this._events.get(InputEventsEnum.Click)?.forEach(cb => cb(this._isHoldClick, (time - this._holdFrom) / 1000, { x: curX, y: curY }));
        }

        if (!this._isHoldClick && this._holdFrom > 0) {
            this._holdFrom = 0;
        }
    }

    public addListenOnClick(callback: (isHold: boolean, holdedFor: number, pos: { x: number, y: number }) => void): void {
        if (!this._events.has(InputEventsEnum.Click)) {
            this._events.set(InputEventsEnum.Click, []);
        }

        this._events.get(InputEventsEnum.Click)?.push(callback);
    }

    private onPointerMove(p: Phaser.Input.Pointer) {
        if (!p.isDown) {
            this._direction = ZERO;
            return;
        }

        this._direction = {
            x: (p.x - p.prevPosition.x) / (p?.camera?.zoom ?? 1) * -0.3,
            y: (p.y - p.prevPosition.y) / (p?.camera?.zoom ?? 1) * -0.3
        }

        this._position = {
            x: this._position.x - this._direction.x,
            y: this._position.y - this._direction.y,
        }
    }
}

enum InputEventsEnum {
    Unknown = 0,
    Click = 1,
}