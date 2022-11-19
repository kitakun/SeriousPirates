import Phaser from 'phaser';
import AwaitLoaderPlugin from 'phaser3-rex-plugins/plugins/awaitloader-plugin';
import { registerCustomComponents } from "./components";
import GameScene from './scenes/gameScene';

registerCustomComponents();

const gameConfig = {
  type: Phaser.WEBGL,
  parent: 'game',
  backgroundColor: '#33A5E7',
  scale: {
    // width: 800,
    // height: 600,
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  },
  plugins: {
    global: [
      {
        key: 'rexAwaitLoader',
        plugin: AwaitLoaderPlugin,
        start: true
      },
    ]
  }
} as Phaser.Types.Core.GameConfig;

new Phaser.Game({ ...gameConfig, scene: [GameScene] });