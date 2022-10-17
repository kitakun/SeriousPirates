import Phaser from 'phaser';
import Camera from '../components/camera';
import PlayerInput from '../components/control/playerInput';
import { drawCornerRect } from '../utils';

export default class GameScene extends Phaser.Scene {
  private layers: Phaser.GameObjects.Layer[] = [];

  private spr_mapBackground!: Phaser.GameObjects.TileSprite;
  private spr_waves!: Phaser.GameObjects.TileSprite;
  private spr_compass!: Phaser.GameObjects.Sprite;

  private txt_label!: Phaser.GameObjects.Text;

  private control_camera!: Camera;
  private control_input!: PlayerInput;

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
    const worldSize = { width: 960, height: 2048 } as ISize;

    // controls
    this.control_camera = new Camera(this.game, this.scale, this.cameras.main, worldSize);
    this.control_input = new PlayerInput(this.input);

    // background
    this.spr_mapBackground = this
      .add
      .tileSprite(0, 0, worldSize.width, worldSize.height, 'game-atlas', 'Море.фон2.png')
      .setOrigin(0);

    this.spr_waves = this
      .add
      .tileSprite(0, 0, worldSize.width, worldSize.height, 'game-atlas', 'волны1.2.png')
      .setOrigin(0);

    this.layers.push(this.add.layer([this.spr_mapBackground, this.spr_waves]).disableInteractive());

    // game
    drawCornerRect(this, worldSize, 0x5F5F00);

    const gameLayer = this.add.layer();
    // this.layers.push(gameLayer);
    this.txt_label = this.add.text(120, 10, 'hi').setScrollFactor(0);
    gameLayer.add(this.txt_label);

    // island-1
    const island1 = this.add.sprite(130, 120, 'islands', 'остров1 (2).png').setInteractive({ cursor: 'pointer' });
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
    this.spr_compass = this
      .add
      .staticSprite(10, 10, 'game-atlas', 'компас.png')
      .setScale(0.2, 0.2)
      .setOrigin(0, 0);

    this.layers.push(this.add.layer(this.spr_compass).disableInteractive());

    this.applyScales();
  }
  update(time: number, delta: number): void {
    // logic
    this.control_camera.update(time, delta);
    this.control_input.update(time, delta);

    // graphic
    this.spr_waves.setTilePosition(this.waveTime, this.spr_waves.tilePositionY);

    // controls
    const CAMERA_MOVE_SPEED = 10;
    this.control_camera.updatePosition(
      this.control_input.direction.x * CAMERA_MOVE_SPEED,
      this.control_input.direction.y * CAMERA_MOVE_SPEED)

    this.txt_label.setText([
      `curs=${1}`
    ]);
  }

  resize(gameSize: Phaser.Structs.Size, baseSize: Phaser.Structs.Size, displaySize: Phaser.Structs.Size) {
    this.applyScales();
  }

  private applyScales(): void {
    const aspectDiff = this.scale.gameSize.width / this.scale.displaySize.width;
    let { width: gameWidth, height: gameHeight, aspectRatio } = this.scale.gameSize;

    this.cameras.resize(gameWidth, gameHeight);

    this.spr_compass?.setScale(Math.min(0.4, Math.max(aspectDiff - 0.7, 0.3)));
    this.spr_mapBackground?.setTileScale(aspectDiff / 4 * aspectRatio);
    this.spr_waves?.setTileScale(aspectDiff / 4 * aspectRatio);
  }
}
