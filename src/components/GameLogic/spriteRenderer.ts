

export default class SpriteRenderer extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, name: string) {
        super(scene, x, y, name);

        this.displayHeight = 128;
        this.displayWidth = 128;

        this.setDepth(100);

        this.play(`${name}-anim`);
    }
}