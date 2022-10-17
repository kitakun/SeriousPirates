import Phaser from 'phaser';
import GameScene from './scenes/HelloWorld';

const gameConfig = {
  type: Phaser.WEBGL,
  parent: 'game',
  backgroundColor: '#33A5E7',
  scale: {
    width: 800,
    height: 600,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  },
} as Phaser.Types.Core.GameConfig;

new Phaser.Game({ ...gameConfig, scene: [GameScene] });