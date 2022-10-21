const PADDING = 10;

export default class Camera {
    private _x: number = 0;
    private _y: number = 0;

    private _bounds: IRectangle;
    private _pan: IVector2 = { x: 0, y: 0 };

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

    public lookAt(x: number, y: number) {
        const { width: gameWidth, height: gameHeight } = this.gameSize;
        const { width: viewWidth, height: viewHeight } = this.scale.gameSize;


        this._x = Phaser.Math.Clamp(
            x - this._bounds.width / 2 - this.AllowedOffset / 2,
            0,
            gameWidth - viewWidth - this.AllowedOffset + PADDING);
        this._y = Phaser.Math.Clamp(
            y - this._bounds.height / 2 - this.AllowedOffset / 2,
            0,
            gameHeight - viewHeight - this.AllowedOffset + PADDING);
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
        this._pan = {
            x: Math.min(1, Math.max(0, mousePosX - this._bounds.x) / actualGameScreenX) * this.AllowedOffset,
            y: Math.min(1, Math.max(0, mousePosY - this._bounds.y) / actualGameScreenY) * this.AllowedOffset,
        };

        this.camera.setScroll(
            this._x + this._pan.x,
            this._y + this._pan.y
        )
    }

    // helpers

    /**
     * Convert raw click to in game field in pixels
     * @param clickPos cursor click position [from (x:0,y:0) to (x:gameWidth, y:gameHeight)]
     * @param gamePos *out ref parameter* - actual in game position in pixels
     * @returns true - if player clicks in game screen
     */
    public tryScreenToGamaPosition(clickPos: IVector2, gamePos: IVector2): boolean {
        const convertedPos = {
            x: clickPos.x + this._x + this._pan.x,
            y: clickPos.y + this._y + this._pan.y,
        }

        if (convertedPos.x > this._bounds.x
            && convertedPos.y > this._bounds.y
            && convertedPos.y < this.gameSize.height - this._bounds.y
            && convertedPos.x < this.gameSize.width - this._bounds.x) {
            Object.assign(gamePos, convertedPos);
            return true;
        }

        return false;
    }

    /** 
     * convert screen-click-point 
     * [from (x:0,y0): to (x:width,y:height)]
     * to game frame [from (x:120,y:120) to (x:width-120, y:height-120)]
    */
    public tryScreenToActualGameScreenPosition(clickPos: IVector2, gamePos: IVector2): boolean {
        const convertedPos = {
            x: clickPos.x - this._bounds.x + this._pan.x + this._x,
            y: clickPos.y - this._bounds.y + this._pan.y + this._y,
        }
        const { width: gameWidth, height: gameHeight } = this.scale.gameSize;

        if (clickPos.x < gameWidth - this._bounds.x
            && clickPos.y < gameHeight - this._bounds.y) {
            Object.assign(gamePos, convertedPos);
            return true;
        }

        return false;
    }
}