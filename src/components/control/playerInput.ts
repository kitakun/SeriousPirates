import Camera from "./camera";
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
        private readonly scene: Phaser.Scenes.ScenePlugin,
        private readonly input: Phaser.Input.InputPlugin,
        private readonly camera: Camera,
    ) {
        if (this.systems.game.device.os.desktop) {
            this._playerInput = new PlayerInputPc(this.input);
        }
        else {
            this._playerInput = new PlayerInputMobile(this.input, this.scene, this.camera);
        }
    }


    public update(time: number, delta: number): void {
        this._playerInput.update(time, delta);
    }

    public on(event: InputEventsEnum, act: Function) {
        return this._playerInput.on(event, act);
    }
}

export enum PlayerControlType {
    Unknown = 0,
    Pc = 1,
    Mobile = 2,
}

export enum InputEventsEnum {
    Unknown = 0,
    Click = 1,
}