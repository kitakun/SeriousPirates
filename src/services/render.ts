import { DEFAULT_GAME_MAP_ATLAS, DEFAULT_UI_OVERLAY_RESOURCE } from "../constants/render.constants";
import { PADDING } from "../constants/view";
import CityDefinition from "../model/data/cityDefinition";
import { IDefinitionGameObject } from "../model/data/IDefinitionGameObject";
import IslandDefinition from "../model/data/islandDefinition";
import { GameObjectDefinition } from "../model/data/objectDefinition";
import City from "../model/dynamic/city";
import GameWorld from "../model/dynamic/gameWorld";
import Island from "../model/dynamic/island";
import { drawCorner, drawCornerRect, CornerGraphic, CornerRectGraphic } from "../utils";
import PirateEvents from "../utils/pirateEvents";
import { createGameObjectGraphic, fillGameObjectState } from "./gameObjects";

const DEFAULT_GAME_SIZE: ISize = { width: 800, height: 600 };
const MAP_OVERLAY_INTERNAL_FRAME_SIZE: ISize = { width: 666, height: 496 };
const DEFAULT_MAP_ATLAS = DEFAULT_GAME_MAP_ATLAS;

export default class PiratesRender {

    // data
    private world!: GameWorld;
    private _events = new PirateEvents<RenderEventsEnum>([RenderEventsEnum.OnResize]);
    public get events(): PirateEvents<RenderEventsEnum> {
        return this._events;
    }

    // graphics
    private layers: Phaser.GameObjects.Layer[] = [];
    private _xyOffset: IVector2 = { x: 0, y: 0 };
    public get XyOffset() {
        return this._xyOffset;
    }

    private spr_mapBackground!: Phaser.GameObjects.TileSprite;
    private spr_waves!: Phaser.GameObjects.TileSprite;
    private spr_compass!: Phaser.GameObjects.Sprite;
    private spr_ui_mapOverlay!: Phaser.GameObjects.Image;
    private spr_internalGameFrame!: CornerGraphic;
    private spr_gameRectFrame!: CornerRectGraphic;

    public get waveTime(): number {
        return Math.sin((this.scene.game.getTime() / 1000) * 1.6) * 12;
    }
    public get mapOverlaySize(): ISize {
        const actualGameSize = this.scene.scale.gameSize;
        const x = actualGameSize.width / DEFAULT_GAME_SIZE.width;
        const y = actualGameSize.height / DEFAULT_GAME_SIZE.height;
        return {
            width: MAP_OVERLAY_INTERNAL_FRAME_SIZE.width * x,
            height: MAP_OVERLAY_INTERNAL_FRAME_SIZE.height * y,
        };
    }

    constructor(
        private readonly scene: Phaser.Scene,
    ) {
    }

    public get add(): Phaser.GameObjects.GameObjectFactory {
        return this.scene.add;
    }

    public preload(world: GameWorld): void {
        this.world = world;
        this._xyOffset = {
            x: Math.floor((this.scene.scale.gameSize.width - this.mapOverlaySize.width) / 2),
            y: Math.floor((this.scene.scale.gameSize.height - this.mapOverlaySize.height) / 2),
        };

        // static data
        this.scene.load.image(DEFAULT_UI_OVERLAY_RESOURCE.key, DEFAULT_UI_OVERLAY_RESOURCE.url);

        // reusable sprites
        this.scene.load.atlas(DEFAULT_MAP_ATLAS.key, DEFAULT_MAP_ATLAS.url, DEFAULT_MAP_ATLAS.jsonUrl);

        this.scene.scale.on('resize', this.resize, this);

        this.internalGameObjectsFacade(
            (island) => {
                console.log('Should preload island object', island)
            },
            (city) => {
                console.log('Should preload city object', city)
            },
            (gameObject) => {
                const createdObjectGraphics = createGameObjectGraphic(this.world, gameObject, this.scene);
                createdObjectGraphics.preload();
            }
        )
    }

    public create(): void {
        // background
        this.spr_mapBackground = this
            .scene
            .add
            .tileSprite(
                0,
                0,
                Math.max(this.world.worldDefinition.worldSizeInPixels.width + this._xyOffset.x + PADDING, this.scene.scale.displaySize.width),
                Math.max(this.world.worldDefinition.worldSizeInPixels.height + this._xyOffset.y + PADDING, this.scene.scale.displaySize.height),
                DEFAULT_MAP_ATLAS.key,
                'Море.фон2.png')
            .setOrigin(0);

        this.spr_waves = this
            .scene
            .add
            .tileSprite(
                0,
                0,
                Math.max(this.world.worldDefinition.worldSizeInPixels.width + this._xyOffset.x + PADDING, this.scene.scale.displaySize.width),
                Math.max(this.world.worldDefinition.worldSizeInPixels.height + this._xyOffset.y + PADDING, this.scene.scale.displaySize.height),
                DEFAULT_MAP_ATLAS.key,
                'волны1.2.png')
            .setOrigin(0)
            .setTileScale(0.4);

        this.layers.push(this.scene.add.layer([this.spr_mapBackground, this.spr_waves]).disableInteractive());

        // game world corner
        this.spr_gameRectFrame = drawCornerRect(
            this.scene,
            this.world.worldDefinition.worldSizeInPixels,
            this.scene.scale.gameSize,
            this.mapOverlaySize,
            0x5F5F00);

        // game objects
        const gameLayer = this.scene.add.layer();
        this.layers.push(gameLayer);

        this.internalGameObjectsFacade(
            (dataIsland) => {
                const createdIslandGraphics = this.scene.add.sprite(
                    this._xyOffset.x + dataIsland.position.x,
                    this._xyOffset.y + dataIsland.position.y + this.world.worldDefinition.tileSize.height,
                    'islands',
                    dataIsland.tileName)
                    .setOrigin(0, 1);

                this.world.objects.push({
                    difinitionData: dataIsland,
                    graphics: gameLayer.add(createdIslandGraphics),
                    gameObject: new Island(this.world),
                    type: GraphicTypeEnum.Sprite,
                    gameComponents: [],
                });
            },
            (dataIsCity) => {
                const createdCityGraphics = this.scene.add.circle(
                    this._xyOffset.x + dataIsCity.position.x,
                    this._xyOffset.y + dataIsCity.position.y + this.world.worldDefinition.tileSize.height * 0.5,
                    this.world.worldDefinition.tileSize.width,
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

                this.world.objects.push({
                    difinitionData: dataIsCity,
                    graphics: gameLayer.add(createdCityGraphics),
                    gameObject: new City(this.world),
                    type: GraphicTypeEnum.Circle,
                    gameComponents: [],
                });
            },
            (dataAboutObject) => {
                const createdObjectGraphics = createGameObjectGraphic(this.world, dataAboutObject, this.scene);

                this.world.objects.push({
                    difinitionData: dataAboutObject,
                    graphics: gameLayer.add(createdObjectGraphics.createObject()),
                    gameObject: fillGameObjectState(this.world, dataAboutObject),
                    type: GraphicTypeEnum.Circle,
                    gameComponents: [],
                });
            });

        // foreground (UI stuff)
        this.spr_ui_mapOverlay = this.scene.add.image(0, 0, DEFAULT_UI_OVERLAY_RESOURCE.key).setOrigin(0, 0).setScrollFactor(0);

        // internal frame color (just to make it looks better)
        this.spr_internalGameFrame = drawCorner(this.scene, { ...this._xyOffset, ...this.mapOverlaySize }, 0xb98530).setScrollFactor(0);

        this.spr_compass = this
            .scene
            .add
            .staticSprite(this._xyOffset.x + 10, this._xyOffset.y + 10, DEFAULT_MAP_ATLAS.key, 'компас.png')
            .setScale(1)
            .setOrigin(0, 0);

        this.layers.push(this.scene.add.layer(this.spr_compass).disableInteractive());

        this.applyScales();
    }

    public update(time: number, delta: number): void {
        this.spr_waves.setTilePosition(this.waveTime, this.spr_waves.tilePositionY);
    }

    public addToLayer<T extends Phaser.GameObjects.GameObject>(go: T, layer: GameLayersOrderEnum): T {
        this.layers[layer].add(go);
        go.on('destroy', () => this.layers[layer].remove(go));
        return go;
    }

    private resize(gameSize: Phaser.Structs.Size, baseSize: Phaser.Structs.Size, displaySize: Phaser.Structs.Size) {
        this.applyScales();
    }

    public applyScales(): void {
        this._xyOffset = {
            x: Math.floor((this.scene.scale.gameSize.width - this.mapOverlaySize.width) / 2),
            y: Math.floor((this.scene.scale.gameSize.height - this.mapOverlaySize.height) / 2),
        };

        const aspectDiff = this.scene.scale.gameSize.width / this.scene.scale.displaySize.height;

        let {
            width: gameWidth,
            height: gameHeight,
            aspectRatio
        } = this.scene.scale.gameSize;

        this.scene.cameras.resize(gameWidth, gameHeight);

        const compassSize = gameWidth < 780 ? 96 : 128;
        this.spr_compass?.setDisplaySize(compassSize, compassSize);

        this.spr_mapBackground?.setTileScale(aspectDiff / 4 * aspectRatio);
        this.spr_ui_mapOverlay?.setDisplaySize(gameWidth, gameHeight);
        this.spr_internalGameFrame?.redraw({ ...this._xyOffset, ...this.mapOverlaySize });
        this.spr_gameRectFrame?.redraw(
            this.world.worldDefinition.worldSizeInPixels,
            this.scene.scale.gameSize,
            this.mapOverlaySize);

        this.events.emit(RenderEventsEnum.OnResize);
    }

    private internalGameObjectsFacade(
        islandProcessor: facadeProcessor<IslandDefinition>,
        cityProcessor: facadeProcessor<CityDefinition>,
        objectProcessor: facadeProcessor<GameObjectDefinition>,
    ) {
        for (let dataIsland of this.world.worldDefinition.islands) {
            islandProcessor(dataIsland);
        }

        for (let dataIsCity of this.world.worldDefinition.cities) {
            cityProcessor(dataIsCity);
        }

        for (let dataAboutObject of this.world.worldDefinition.objects) {
            objectProcessor(dataAboutObject);
        }
    }
}

type facadeProcessor<T extends IDefinitionGameObject> = (gameObject: T) => void;

export enum GameLayersOrderEnum {
    Background = 0,
    GameObjects = 1,
    UI = 2,
}

export enum GraphicTypeEnum {
    Unknown = 0,
    Sprite = 1,
    Circle = 2,
}

export enum RenderEventsEnum {
    Unknown = 0,
    OnResize = 1,
}