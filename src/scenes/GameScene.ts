import Phaser from 'phaser';
import Camera from '../components/control/camera';
import PlayerInput from '../components/control/playerInput';
import { GameObjectDefinition } from '../model/data/objectDefinition';
import WorldDefinition from '../model/data/worldDefinition';
import { Ship } from '../model/dynamic/ship';
import { parseTiledMapToWorld } from '../services/loader';
import PiratesRender, { GameLayersOrderEnum } from '../services/render';

export default class GameScene extends Phaser.Scene {
  // data
  private world!: WorldDefinition;

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
    console.log('Here constructed world', this.world);

    const xyOffset = {
      x: (this.scale.gameSize.width - this.render.mapOverlaySize.width) / 2,
      y: (this.scale.gameSize.height - this.render.mapOverlaySize.height) / 2,
    } as IVector2;

    // graphics
    this.render.create(this.world, xyOffset);

    // debug stuff
    this.txt_label = this.render.addToLayer(this.add.text(120, 10, 'hi').setScrollFactor(0).setColor('black'), GameLayersOrderEnum.UI);

    // controls
    this.control_camera = new Camera(
      this.game,
      this.scale,
      this.cameras.main,
      this.world.worldSizeInPixels,
      {
        x: xyOffset.x,
        y: xyOffset.y,
        width: this.render.mapOverlaySize.width,
        height: this.render.mapOverlaySize.height,
      });
    this.control_input = new PlayerInput(this.input);
    this.control_input.onClick((isHold, rawClickPos) => {
      let gamePos = { x: 0, y: 0 };
      let gameScreenPos = { x: 0, y: 0 };

      if (isHold
        && this.control_camera.tryScreenToGamaPosition(rawClickPos, gamePos)
        && this.control_camera.tryScreenToActualGameScreenPosition(rawClickPos, gameScreenPos)) {
        {
          this.render.addToLayer(this.add.circle(gamePos.x, gamePos.y, 5, 0x66ff66, 1), GameLayersOrderEnum.UI);

          this.txt_label.setText([
            `Click on tile=${JSON.stringify(this.world.worldToTilePos(gameScreenPos))}`
          ]);
        }
      }
    });

    // get player ship
    const ship = this.render.findGraphicByCondition(f => f instanceof GameObjectDefinition && f.properties?.find(p => p.name === 'isPlayer')?.value);
    const { x, y } = (ship?.data as GameObjectDefinition).initialPosition;
    this.control_camera.lookAt(x, y);
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

  }
}
