import Phaser from 'phaser';

export default class Demo extends Phaser.Scene {
  private layers: Phaser.GameObjects.Layer[] = [];

  private spr_mapBackground!: Phaser.GameObjects.TileSprite;
  private spr_waves!: Phaser.GameObjects.TileSprite;
  private spr_compass!: Phaser.GameObjects.Sprite;

  private txt_label!: Phaser.GameObjects.Text;

  get waveTime(): number {
    return Math.sin((this.game.getTime() / 1000) * 1.6) * 12;
  }

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.atlas('game-atlas', 'assets/game-atlas/texture.png', 'assets/game-atlas/texture.json');
    this.load.atlas('islands', 'assets/game-atlas/islands.png', 'assets/game-atlas/islands.json');

    this.scale.on('resize', this.resize, this);
  }
  create() {
    let { width, height } = this.scale;

    // background
    const backgroundLayer = this.add.layer();
    this.layers.push(backgroundLayer);
    this.spr_mapBackground = this.add.tileSprite(0, 0, width, height, 'game-atlas', 'Море.фон2.png').setOrigin(0);
    backgroundLayer.add(this.spr_mapBackground);
    this.spr_waves = this.add.tileSprite(0, 0, width, height, 'game-atlas', 'волны1.2.png').setOrigin(0);
    backgroundLayer.add(this.spr_waves);

    // game
    const gameLayer = this.add.layer();
    this.layers.push(gameLayer);
    this.txt_label = this.add.text(10, 10, 'hi');
    gameLayer.add(this.txt_label);

    // island-1
    const island1 = this.add.sprite(100, 70, 'islands', 'остров1 (2).png').setInteractive({ cursor: 'pointer' });
    island1.setScale(0.5).setOrigin(0);
    // island1.input.alwaysEnabled = true;
    island1.on('pointerover', () => {
      island1.x -= 12;
      island1.y -= 12;
      island1.setScale(0.55)
    })
    island1.on('pointerout', () => {
      island1.x += 12;
      island1.y += 12;
      island1.setScale(0.5)
    });

    // foreground
    const foregroundLayer = this.add.layer();
    this.layers.push(foregroundLayer);

    this.spr_compass = this.add.sprite(10, 10, 'game-atlas', 'компас.png').setScale(0.2, 0.2).setOrigin(0, 0);
    foregroundLayer.add(this.spr_compass);


    this.applyScales();
  }
  update(time: number, delta: number): void {
    this.spr_waves.setTilePosition(this.waveTime, this.spr_waves.tilePositionY);
    // this.txt_label.setText([ `Wave=${this.waveTime}` ]);
  }

  resize(gameSize: Phaser.Structs.Size, baseSize: Phaser.Structs.Size, displaySize: Phaser.Structs.Size) {
    this.applyScales();
  }

  private applyScales(): void {
    const aspectDiff = this.scale.gameSize.width / this.scale.displaySize.width;
    let { width: gameWidth, height: gameHeight } = this.scale.gameSize;

    this.cameras.resize(gameWidth, gameHeight);

    this.spr_compass?.setScale(Math.min(0.4, Math.max(aspectDiff - 0.7, 0.3)));
    this.spr_mapBackground?.setTileScale(aspectDiff / 2);
    this.spr_waves?.setTileScale(aspectDiff / 2);
  }
}
