<script setup lang="ts">
import Phaser from 'phaser';
import AwaitLoaderPlugin from 'phaser3-rex-plugins/plugins/awaitloader-plugin';
import GameScene from '../scenes/gameScene';
import { registerCustomComponents } from "../components";

registerCustomComponents();

const gameConfig = {
    type: Phaser.WEBGL,
    parent: 'game',
    backgroundColor: '#33A5E7',
    scale: {
        width: 1920,
        height: 1080,
        mode: Phaser.Scale.FIT,
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

</script>

<template>
    <h1>Pirates</h1>

    <div id="game"> </div>
</template>