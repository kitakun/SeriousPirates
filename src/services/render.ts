import PiratesWorld from "../model/data/world";
import { drawCorner, drawCornerRect } from "../utils";

const MAP_OVERLAY_INTERNAL_FRAME_SIZE = { width: 666, height: 496 } as ISize;

export default class PiratesRender {
    // data
    private world!: PiratesWorld;

    // graphics
    private layers: Phaser.GameObjects.Layer[] = [];
    private _xyOffset: IVector2 = { x: 0, y: 0 };

    private spr_mapBackground!: Phaser.GameObjects.TileSprite;
    private spr_waves!: Phaser.GameObjects.TileSprite;
    private spr_compass!: Phaser.GameObjects.Sprite;

    private cache_objects!: DataToGraphicStruct[];

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

    public create(world: PiratesWorld, xyOffset: IVector2 = { x: 0, y: 0 }): void {
        this.world = world;
        this._xyOffset = xyOffset;
        this.cache_objects = [];

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

        // game world corner
        drawCornerRect(this.scene, this.world.worldSizeInPixels, this.scene.scale.gameSize, this.mapOverlaySize, 0x5F5F00);

        // game objects
        const gameLayer = this.scene.add.layer();
        this.layers.push(gameLayer);

        for (let dataIsland of this.world.islands) {
            const createdIslandGraphics = this.scene.add.sprite(
                this._xyOffset.x + dataIsland.position.x,
                this._xyOffset.y + dataIsland.position.y,
                'islands',
                dataIsland.tileName)
                .setOrigin(0, 1);

            this.cache_objects.push({
                data: dataIsland,
                graphics: gameLayer.add(createdIslandGraphics),
                type: GraphicTypeEnum.Sprite,
            });
        }

        for (let dataIsCity of this.world.cities) {
            const createdCityGraphics = this.scene.add.circle(
                this._xyOffset.x + dataIsCity.position.x + 16,
                this._xyOffset.y + dataIsCity.position.y - 32,
                32,
                0x6666ff
            )
                .setInteractive({ cursor: 'pointer' })
                .setAlpha(0.3)
                .setOrigin(0.5, 0.5);

            createdCityGraphics.on('pointerover', () => {
                createdCityGraphics.setScale(0.95)
            })
            createdCityGraphics.on('pointerout', () => {
                createdCityGraphics.setScale(1)
            });

            this.cache_objects.push({
                data: dataIsCity,
                graphics: gameLayer.add(createdCityGraphics),
                type: GraphicTypeEnum.Circle,
            });
        }

        for (let dataAboutObject of this.world.objects) {
            const createdCityGraphics = this.scene.add.circle(
                this._xyOffset.x + dataAboutObject.initialPosition.x + 16,
                this._xyOffset.y + dataAboutObject.initialPosition.y - 32,
                32,
                0x66ff66
            )
                .setOrigin(0.5, 0.5);

            this.cache_objects.push({
                data: createdCityGraphics,
                graphics: gameLayer.add(createdCityGraphics),
                type: GraphicTypeEnum.Circle,
            });
        }

        // foreground (UI stuff)
        this.scene.add.image(0, 0, 'mapOverlay').setOrigin(0, 0).setScrollFactor(0);

        // internal frame color (just to make it looks better)
        drawCorner(this.scene, { ...this._xyOffset, ...this.mapOverlaySize }, 0xb98530).setScrollFactor(0);

        this.spr_compass = this
            .scene
            .add
            .staticSprite(this._xyOffset.x + 10, this._xyOffset.y + 10, 'game-atlas', 'компас.png')
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

    private resize(gameSize: Phaser.Structs.Size, baseSize: Phaser.Structs.Size, displaySize: Phaser.Structs.Size) {
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

interface DataToGraphicStruct {
    graphics: Phaser.GameObjects.GameObject;
    data: IGameObject;
    type: GraphicTypeEnum;
}

enum GraphicTypeEnum {
    Unknown = 0,
    Sprite = 1,
    Circle = 2,
}