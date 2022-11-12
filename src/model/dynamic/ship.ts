import IMovableGameObject from "../../types/gameobjects/IMovableGameObject";

export class Ship extends IMovableGameObject {
    protected override onPositionUpdated(): void {
        const myData = this.gameWorld.findGameObjectByGameObject(Ship, go => go === this);

        const objectWithPossition = myData.graphics as unknown as IPhaserWithPosition;
        if (objectWithPossition && !!objectWithPossition.setPosition) {
            const { x, y } = this.position;
            objectWithPossition.setPosition(x, y);
        }
    }

    protected override onDirectionUpdated(): void {
        const myData = this.gameWorld.findGameObjectByGameObject(Ship, go => go === this);

        const objectWithPossition = myData.graphics as unknown as IPhaserWithPosition;
        if (objectWithPossition && objectWithPossition.flipX !== undefined) {
            const { x } = this.direction;
            objectWithPossition.flipX = x < 0;
        }
    }
}

interface IPhaserWithPosition {
    setPosition: (x: number, y: number) => void;
    get flipX(): boolean;
    set flipX(val: boolean);
}