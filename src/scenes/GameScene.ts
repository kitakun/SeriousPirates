import Phaser from 'phaser';
import Camera from '../components/camera';
import PlayerInput from '../components/control/playerInput';
import PiratesWorld from '../data/world';
import { parseTiledMapToWorld } from '../services/loader';
import { drawCornerRect } from '../utils';

export default class GameScene extends Phaser.Scene {
  private world!: PiratesWorld;

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

    this.load.json('glBlocks', 'assets/maps/map1_tileset_blockColl.json');
    this.load.json('islandBlocks', 'assets/maps/map1_tileset_islands1.json');
    this.load.json('map', 'assets/maps/map1.json');

    this.load.tilemapTiledJSON('mapj', 'assets/maps/map3embeded.json');

    this.scale.on('resize', this.resize, this);
  }
  create() {
    this.world = parseTiledMapToWorld('map', ['glBlocks', 'islandBlocks'], this.game.cache.json);
    console.log('got world', this.world);

    // controls
    this.control_camera = new Camera(this.game, this.scale, this.cameras.main, this.world.worldSizeInPixels);
    this.control_input = new PlayerInput(this.input);

    // background
    this.spr_mapBackground = this
      .add
      .tileSprite(0, 0, this.world.worldSizeInPixels.width, this.world.worldSizeInPixels.height, 'game-atlas', 'Море.фон2.png')
      .setOrigin(0);

    this.spr_waves = this
      .add
      .tileSprite(0, 0, this.world.worldSizeInPixels.width, this.world.worldSizeInPixels.height, 'game-atlas', 'волны1.2.png')
      .setOrigin(0);

    this.layers.push(this.add.layer([this.spr_mapBackground, this.spr_waves]).disableInteractive());

    // game
    drawCornerRect(this, this.world.worldSizeInPixels, 0x5F5F00);

    const gameLayer = this.add.layer();
    this.layers.push(gameLayer);

    this.txt_label = this.add.text(120, 10, 'hi').setScrollFactor(0);
    gameLayer.add(this.txt_label);


    for (let dataIsland of this.world.islands) {
      const createdIslandGraphics = this.add.sprite(
        dataIsland.position.x,
        dataIsland.position.y,
        'islands',
        dataIsland.tileName)
        .setInteractive({ cursor: 'pointer' })
        .setOrigin(0, 1);

      gameLayer.add(createdIslandGraphics);
      console.log(`spawn=${dataIsland.tileName} on pos=${JSON.stringify(dataIsland.position)}`)
    }

    for (let dataIsCity of this.world.cities) {
      const createdCityGraphics = this.add.circle(
        dataIsCity.position.x,
        dataIsCity.position.y,
        32,
        0x6666ff)
        .setInteractive({ cursor: 'pointer' })
        .setOrigin(0, 1);

      gameLayer.add(createdCityGraphics);
      console.log(`spawn=${dataIsCity.name} on pos=${JSON.stringify(dataIsCity.position)}`)
    }

    // island-1
    /*const island1 = this.add.sprite(130, 120, 'islands', 'остров1 (2).png').setInteractive({ cursor: 'pointer' });
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
    });*/

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
      `world=${this.world.worldName}`
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
