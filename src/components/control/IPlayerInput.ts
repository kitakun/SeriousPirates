import { PlayerControlType } from "./playerInput";

export interface IPlayerInput {
    get controlType(): PlayerControlType;
    get direction(): IVector2;

    update(time: number, delta: number): void;

    addListenOnClick(callback: (isHold: boolean, holdedFor: number, pos: { x: number, y: number }) => void): void;
}