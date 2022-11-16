import { IPlayerInput } from "./IPlayerInput";
import PlayerInputMobile from "./playerInput.mobile";
import PlayerInputPc from "./playerInput.pc";

export default class PlayerInput implements IPlayerInput {
    private readonly _playerInput: IPlayerInput;

    // ! idk how to clear direction at frame ends,
    // ! so mobile controls will clear it at method call via get
    public get direction(): IVector2 {
        return this._playerInput.direction;
    }
    public get controlType(): PlayerControlType {
        return this._playerInput.controlType;
    }

    constructor(
        private readonly systems: Phaser.Scenes.Systems,
        private readonly input: Phaser.Input.InputPlugin,
    ) {
        if (this.systems.game.device.os.desktop) {
            this._playerInput = new PlayerInputPc(this.input);
        }
        else {
            this._playerInput = new PlayerInputMobile(this.input);
        }
    }


    public update(time: number, delta: number): void {
        this._playerInput.update(time, delta);
    }

    public addListenOnClick(callback: (isHold: boolean, holdedFor: number, pos: { x: number, y: number }) => void): void {
        this._playerInput.addListenOnClick(callback);
    }
}

export enum PlayerControlType {
    Unknown = 0,
    Pc = 1,
    Mobile = 2,
}