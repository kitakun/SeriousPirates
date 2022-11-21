import { InputEventsEnum, PlayerControlType } from "./playerInput";

export interface IPlayerInput {
    get controlType(): PlayerControlType;
    get direction(): IVector2;

    update(time: number, delta: number): void;

    on(event: InputEventsEnum, act: Function): () => void;
}