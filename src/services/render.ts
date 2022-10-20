import PiratesWorld from "../model/data/world";
import { drawCornerRect } from "../utils";

const MAP_OVERLAY_INTERNAL_FRAME_SIZE = { width: 666, height: 496 } as ISize;

export default class PiratesRender {
    // data
    private world!: PiratesWorld;

    // graphics
    private layers: Phaser.GameObjects.Layer[] = [];

    private spr_mapBackground!: Phaser.GameObjects.TileSprite;
    private spr_waves!: Phaser.GameObjects.TileSprite;
    private spr_compass!: Phaser.GameObjects.Sprite;

    public get waveTime(): number {
        return Math.sin((this.scene.game.getTime() / 1000) * 1.6) * 12;
    }
    public get mapOverlaySize(): ISize {
        return MAP_OVERLAY_INTERNAL_FRAME_SIZE;
    }

    constructor(
        private readonly scene: Phaser.Scene,
    ) {
    }

    public preload(): void {
        this.scene.load.image('mapOverlay', 'assets/UI/mapOverlay.png');

        // reusable sprites
        this.scene.load.atlas('game-atlas', 'assets/game-atlas/texture.png', 'assets/game-atlas/texture.json');

        this.scene.scale.on('resize', this.resize, this);
    }

    public create(world: PiratesWorld): void {
        this.world = world;

        // background
        this.spr_mapBackground = this
            .scene
            .add
            .tileSprite(0, 0, this.world.worldSizeInPixels.width, this.world.worldSizeInPixels.height, 'game-atlas', 'Море.фон2.png')
            .setOrigin(0);

        this.spr_waves = this
            .scene
            .add
            .tileSprite(0, 0, this.world.worldSizeInPixels.width, this.world.worldSizeInPixels.height, 'game-atlas', 'волны1.2.png')
            .setOrigin(0);

        this.layers.push(this.scene.add.layer([this.spr_mapBackground, this.spr_waves]).disableInteractive());

        // game objects
        drawCornerRect(this.scene, this.world.worldSizeInPixels, this.scene.scale.gameSize, this.mapOverlaySize, 0x5F5F00);

        const gameLayer = this.scene.add.layer();
        this.layers.push(gameLayer);

        for (let dataIsland of this.world.islands) {
            const createdIslandGraphics = this.scene.add.sprite(
                dataIsland.position.x,
                dataIsland.position.y,
                'islands',
                dataIsland.tileName)
                .setOrigin(0, 1);

            gameLayer.add(createdIslandGraphics);
            //  console.log(`spawn=${dataIsland.tileName} on pos=${JSON.stringify(dataIsland.position)}`)
        }

        for (let dataIsCity of this.world.cities) {
            const createdCityGraphics = this.scene.add.circle(
                dataIsCity.position.x + 16,
                dataIsCity.position.y - 32,
                32,
                0x6666ff)
                .setInteractive({ cursor: 'pointer' })
                .setAlpha(0.3)
                .setOrigin(0.5, 0.5);

            createdCityGraphics.on('pointerover', () => {
                createdCityGraphics.setScale(0.95)
            })
            createdCityGraphics.on('pointerout', () => {
                createdCityGraphics.setScale(1)
            });

            gameLayer.add(createdCityGraphics);
            // console.log(`spawn=${dataIsCity.name} on pos=${JSON.stringify(dataIsCity.position)}`)
        }

        // foreground (UI stuff)
        this.scene.add.image(0, 0, 'mapOverlay').setOrigin(0, 0).setScrollFactor(0);

        this.spr_compass = this
            .scene
            .add
            .staticSprite(10, 10, 'game-atlas', 'компас.png')
            .setScale(0.2, 0.2)
            .setOrigin(0, 0);

        this.layers.push(this.scene.add.layer(this.spr_compass).disableInteractive());

        this.applyScales();
    }

    public update(time: number, delta: number): void {
        this.spr_waves.setTilePosition(this.waveTime, this.spr_waves.tilePositionY);
    }

    public addToLayer<T extends Phaser.GameObjects.GameObject>(go: T, layer: GameLayersOrderEnum): T {
        this.layers[layer].add(go);

        return go;
    }

    resize(gameSize: Phaser.Structs.Size, baseSize: Phaser.Structs.Size, displaySize: Phaser.Structs.Size) {
        this.applyScales();
    }

    private applyScales(): void {
        const aspectDiff = this.scene.scale.gameSize.width / this.scene.scale.displaySize.width;
        let { width: gameWidth, height: gameHeight, aspectRatio } = this.scene.scale.gameSize;

        this.scene.cameras.resize(gameWidth, gameHeight);

        this.spr_compass?.setScale(Math.min(0.4, Math.max(aspectDiff - 0.7, 0.3)));
        this.spr_mapBackground?.setTileScale(aspectDiff / 4 * aspectRatio);
        this.spr_waves?.setTileScale(aspectDiff / 4 * aspectRatio);
    }
}

export enum GameLayersOrderEnum {
    Background = 0,
    GameObjects = 1,
    UI = 2,
}