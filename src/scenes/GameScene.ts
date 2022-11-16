import { AStarFinder } from 'astar-typescript';
import Awaitloader from 'phaser3-rex-plugins/plugins/awaitloader.js';
import Phaser from 'phaser';
import Camera from '../components/control/camera';
import PlayerInput from '../components/control/playerInput';
import MoveShipByClick from '../components/GameLogic/moveShipByClick';
import PathfindMover from '../components/GameLogic/pathfindMover';
import GameWorld from '../model/dynamic/gameWorld';
import { Ship } from '../model/dynamic/ship';
import { parseTiledMapToWorld } from '../services/loader';
import PiratesRender, { GameLayersOrderEnum } from '../services/render';
import { collisionDataToMatrix } from "../utils/pathfind";
import { asyncJsonLoader } from '../utils/async';

export default class GameScene extends Phaser.Scene {
  // data
  private world!: GameWorld;

  // graphics
  private render!: PiratesRender;
  private debug_text!: Phaser.GameObjects.Text;

  // controls
  private control_camera!: Camera;
  private control_input!: PlayerInput;
  private control_pathfind!: AStarFinder;

  constructor() {
    super('GameScene');
    this.render = new PiratesRender(this);
  }

  preload() {
    const xyOffset = {
      x: Math.floor((this.scale.gameSize.width - this.render.mapOverlaySize.width) / 2),
      y: Math.floor((this.scale.gameSize.height - this.render.mapOverlaySize.height) / 2),
    } as IVector2;



    this.load.rexAwait(async (successCallback: Function, failureCallback: Function) => {
      try {
        await asyncJsonLoader(this.load.json('glBlocks', 'assets/maps/map1_tileset_blockColl.json'));
        await asyncJsonLoader(this.load.json('islandBlocks', 'assets/maps/map1_tileset_islands1.json'));

        const loadedWorld = await parseTiledMapToWorld('assets/maps/map1.json', ['glBlocks', 'islandBlocks'], this.game.cache.json, this.load);

        // data
        this.world = new GameWorld(loadedWorld);

        // preloading
        this.load.atlas('islands', 'assets/game-atlas/islands.png', 'assets/game-atlas/islands.json');

        // graphic-preloading
        this.render.preload(this.world, xyOffset);

        successCallback();
      } catch (err) {
        failureCallback(err);
      }
    });
  }
  create() {
    // graphics
    this.render.create();

    // controls
    this.control_camera = new Camera(
      this.game,
      this.scale,
      this.cameras.main,
      this.control_input,
      this.world.worldDefinition.worldSizeInPixels,
      this.world.worldDefinition.tileSize,
      {
        x: this.render.XyOffset.x,
        y: this.render.XyOffset.y,
        width: this.render.mapOverlaySize.width,
        height: this.render.mapOverlaySize.height,
      });
    this.control_input = new PlayerInput(this.sys, this.input);

    this.control_pathfind = new AStarFinder({
      grid: {
        matrix: collisionDataToMatrix(this.world.worldDefinition)
      }
    })

    // debug
    this.debug_text = this.render.addToLayer(this.add.text(25, 25, 'hello').setColor('black').setScrollFactor(0, 0), GameLayersOrderEnum.UI);

    // get player ship
    const ship = this.world.findGameObjectWithPropertry(Ship, p => p.name === 'isPlayer' && !!p.value);
    this.control_camera.lookAtObject(ship.gameObject);

    ship.gameComponents.push(new PathfindMover(
      this.control_camera,
      ship));
    // control player ship with click
    ship.gameComponents.push(new MoveShipByClick(
      this.render,
      this.control_input,
      this.control_camera,
      this.control_pathfind,
      ship,
    ));
  }

  update(time: number, delta: number): void {
    // logic
    this.control_camera.update(time, delta);
    this.control_input.update(time, delta);

    // graphic
    this.render.update(time, delta);

    // controls
    const CAMERA_MOVE_SPEED = 10;
    const controlDirection = this.control_input.direction;
    this.control_camera.updatePosition(
      controlDirection.x * CAMERA_MOVE_SPEED,
      controlDirection.y * CAMERA_MOVE_SPEED)

    // game
    this.world.update(time, delta);

    this.debug_text.setText([`x=${this.control_input.direction.x} y=${this.control_input.direction.y}`])
  }
}
