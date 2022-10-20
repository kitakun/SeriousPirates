const PADDING = 10;

export default class Camera {
    private _x: number = 0;
    private _y: number = 0;

    private _bounds: IRectangle;

    public AllowedOffset: number = 100;
    public get position(): IVector2 {
        return {
            x: this._x,
            y: this._y,
        }
    }

    constructor(
        private readonly game: Phaser.Game,
        private readonly scale: Phaser.Scale.ScaleManager,
        private readonly camera: Phaser.Cameras.Scene2D.Camera,
        private readonly gameSize: ISize,
        gameScreenRectangle: IRectangle) {

        this.camera.setSize(this.game.scale.width, this.game.scale.height);
        // x,y - actual game start from image, width+height - internal image screen frame size
        this._bounds = gameScreenRectangle;
        // camera to game world bounds
        this.camera.setBounds(0, 0, this.gameSize.width + PADDING, this.gameSize.height + PADDING);
        this.camera.setZoom(1);
    }

    public setPosition(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public updatePosition(x: number, y: number) {
        const { width: gameWidth, height: gameHeight } = this.gameSize;
        const { width: viewWidth, height: viewHeight } = this.scale.gameSize;

        this._x = Phaser.Math.Clamp(this._x + x, 0, gameWidth - viewWidth - this.AllowedOffset + PADDING);
        this._y = Phaser.Math.Clamp(this._y + y, 0, gameHeight - viewHeight - this.AllowedOffset + PADDING);
    }

    public update(time: number, delta: number): void {
        const { width: gameWidth, height: gameHeight } = this.scale.gameSize;
        const { x: mousePosX, y: mousePosY } = this.game.input.activePointer.position;

        const actualGameScreenX = gameWidth - (this._bounds.x * 2);
        const actualGameScreenY = gameHeight - (this._bounds.y * 2);

        // mouse offset
        const xCoef = Math.min(1, Math.max(0, mousePosX - this._bounds.x) / actualGameScreenX);
        const yCoef = Math.min(1, Math.max(0, mousePosY - this._bounds.y) / actualGameScreenY);

        this.camera.setScroll(
            this._x + xCoef * this.AllowedOffset,
            this._y + yCoef * this.AllowedOffset
        )
    }
}