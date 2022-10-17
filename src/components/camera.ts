export default class Camera {
    private _x: number = 0;
    private _y: number = 0;

    private _bounds: IRectangle;

    public AllowedOffset: number = 100;

    constructor(
        private readonly game: Phaser.Game,
        private readonly scale: Phaser.Scale.ScaleManager,
        private readonly camera: Phaser.Cameras.Scene2D.Camera,
        worldSize: ISize) {

        this.camera.setSize(this.game.scale.width, this.game.scale.height);
        this._bounds = {
            x: 0,
            y: 0,
            width: worldSize.width,
            height: worldSize.height
        };
        this.camera.setBounds(this._bounds.x, this._bounds.y, this._bounds.width + 10, this._bounds.height);
        this.camera.setZoom(1);
    }

    public setPosition(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public updatePosition(x: number, y: number) {
        const { width: gameWidth, height: gameHeight } = this.scale.gameSize;
        this._x = Phaser.Math.Clamp(this._x + x, this._bounds.x, this._bounds.width - gameWidth - this.AllowedOffset);
        this._y = Phaser.Math.Clamp(this._y + y, this._bounds.y, this._bounds.height - gameHeight - this.AllowedOffset);
    }

    public update(time: number, delta: number): void {
        // mouse offset
        const xCoef = (this.game.input.activePointer.position.x / this.scale.gameSize.width);
        const yCoef = (this.game.input.activePointer.position.y / this.scale.gameSize.height);

        this.camera.setScroll(
            this._x + xCoef * this.AllowedOffset,
            this._y + yCoef * this.AllowedOffset
        )
    }
}