export default class PlayerInput {
    public get direction(): IVector2 {
        return this._direction;
    }

    private _direction: IVector2 = { x: 0, y: 0 };

    // keyboard
    private readonly control_arrows!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(private readonly input: Phaser.Input.InputPlugin) {
        this.control_arrows = this.input.keyboard.createCursorKeys();
    }

    public update(time: number, delta: number): void {
        this._direction = this.getArrowsDirection();
    }

    private getArrowsDirection(): IVector2 {
        let horizontal = 0;
        let vertical = 0;

        if (this.control_arrows?.left.isDown) {
            horizontal = -1;
        } else if (this.control_arrows?.right.isDown) {
            horizontal = 1;
        }

        if (this.control_arrows?.up.isDown) {
            vertical = -1;
        } else if (this.control_arrows?.down.isDown) {
            vertical = 1;
        }

        return { x: horizontal, y: vertical };
    }
}