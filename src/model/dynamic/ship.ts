import IMovableGameObject from "../../types/gameobjects/IMovableGameObject";

export class Ship extends IMovableGameObject {
    protected override onPositionUpdated(): void {
        const myData = this.gameWorld.findGameObjectByGameObject(Ship, go => go === this);

        const circle = myData.graphics as Phaser.GameObjects.Arc;
        const { x, y } = this.position;
        circle.setPosition(x, y);
    }
}