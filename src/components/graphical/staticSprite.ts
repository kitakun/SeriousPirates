export default class StaticSprite extends Phaser.GameObjects.Sprite {
    public static readonly registeredName = 'staticSprite';
}

export const register = () =>
    Phaser.GameObjects.GameObjectFactory.register(
        StaticSprite.registeredName,
        function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number) {
            // just for me, because I'm learning
            return new StaticSprite(this.scene, x, y, texture, frame).setScrollFactor(0)
        });