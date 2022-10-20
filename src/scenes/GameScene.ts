import Phaser from 'phaser';
import Camera from '../components/control/camera';
import PlayerInput from '../components/control/playerInput';
import PiratesWorld from '../data/world';
import { parseTiledMapToWorld } from '../services/loader';
import PiratesRender, { GameLayersOrderEnum } from '../services/render';

export default class GameScene extends Phaser.Scene {
  // data
  private world!: PiratesWorld;

  // graphics
  private render!: PiratesRender;
  private txt_label!: Phaser.GameObjects.Text;

  // controls
  private control_camera!: Camera;
  private control_input!: PlayerInput;

  constructor() {
    super('GameScene');
    this.render = new PiratesRender(this);
  }

  preload() {
    this.render.preload();
    this.load.atlas('islands', 'assets/game-atlas/islands.png', 'assets/game-atlas/islands.json');

    this.load.json('glBlocks', 'assets/maps/map1_tileset_blockColl.json');
    this.load.json('islandBlocks', 'assets/maps/map1_tileset_islands1.json');
    this.load.json('map', 'assets/maps/map1.json');
  }
  create() {
    // data
    this.world = parseTiledMapToWorld('map', ['glBlocks', 'islandBlocks'], this.game.cache.json);

    // graphics
    this.render.create(this.world);

    // debug stuff
    this.txt_label = this.render.addToLayer(this.add.text(120, 10, 'hi').setScrollFactor(0).setColor('black'), GameLayersOrderEnum.UI);

    // controls
    this.control_camera = new Camera(
      this.game,
      this.scale,
      this.cameras.main,
      this.world.worldSizeInPixels,
      {
        x: (this.scale.gameSize.width - this.render.mapOverlaySize.width) / 2,
        y: (this.scale.gameSize.height - this.render.mapOverlaySize.height) / 2,
        width: this.render.mapOverlaySize.width,
        height: this.render.mapOverlaySize.height,
      });
    this.control_input = new PlayerInput(this.input);
  }

  update(time: number, delta: number): void {
    // logic
    this.control_camera.update(time, delta);
    this.control_input.update(time, delta);

    // graphic
    this.render.update(time, delta);

    // controls
    const CAMERA_MOVE_SPEED = 10;
    this.control_camera.updatePosition(
      this.control_input.direction.x * CAMERA_MOVE_SPEED,
      this.control_input.direction.y * CAMERA_MOVE_SPEED)

    this.txt_label.setText([
      `world=${JSON.stringify(this.control_camera.position)}`
    ]);
  }
}
