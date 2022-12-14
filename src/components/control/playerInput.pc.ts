import PirateEvents from "../../utils/pirateEvents";
import { IPlayerInput } from "./IPlayerInput";
import { InputEventsEnum, PlayerControlType } from "./playerInput";

export default class PlayerInputPc implements IPlayerInput {
    private readonly _events = new PirateEvents<InputEventsEnum>();
    private _isHoldClick = false;

    public get controlType(): PlayerControlType {
        return PlayerControlType.Pc;
    }

    public get direction(): IVector2 {
        return this._direction;
    }

    private _direction: IVector2 = { x: 0, y: 0 };
    private _holdFrom = 0;

    // keyboard
    private readonly control_arrows!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(
        private readonly input: Phaser.Input.InputPlugin,
    ) {
        this.control_arrows = this.input.keyboard.createCursorKeys();
        console.log("Will use PC controls (keyboard+mouse)");
    }

    public update(time: number, delta: number): void {
        this._direction = this.getArrowsDirection();

        if (this._isHoldClick && this._holdFrom === 0) {
            this._holdFrom = time;
        }

        const prevIsHoldClick = this._isHoldClick;
        this._isHoldClick = this.input.activePointer.leftButtonDown();

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

    private getArrowsDirection(): IVector2 {
        let horizontal = 0;
        let vertical = 0;

        if (this.control_arrows?.left.isDown) {
            horizontal = -1;
        } else if (this.control_arrows?.right.isDown) {
            horizontal = 1;
        }

        if (this.control_arrows?.up.isDown) {
            vertical = -1;
        } else if (this.control_arrows?.down.isDown) {
            vertical = 1;
        }

        return { x: horizontal, y: vertical };
    }
}
