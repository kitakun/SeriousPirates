import SpriteRenderer from "../components/GameLogic/spriteRenderer";
import { GameObjectDefinition } from "../model/data/objectDefinition";
import GameWorld from "../model/dynamic/gameWorld";
import { Ship } from "../model/dynamic/ship";

export const fillGameObjectState = (gameWorld: GameWorld, objectDefinition: GameObjectDefinition): IGameObject => {
    switch (objectDefinition.className) {
        case 'ship':
        case 'Ship':
            return new Ship(gameWorld,
                {
                    x: objectDefinition.initialPosition.x,
                    y: objectDefinition.initialPosition.y,
                });
    }

    return {};
}

export const createGameObjectGraphic = (gameWorld: GameWorld, objectDefinition: GameObjectDefinition, scene: Phaser.Scene): GraphicObjectFactory => {
    switch (objectDefinition.className) {
        case 'ship':
        case 'Ship':
            const PLAYER_SHIP_NAME = 'player-ship1';
            return {
                createObject: () => {
                    const animFrames = scene.textures.get(PLAYER_SHIP_NAME).getFrameNames();

                    scene.anims.create({
                        key: `${PLAYER_SHIP_NAME}-anim`,
                        frames: animFrames.map(m => ({ key: PLAYER_SHIP_NAME, frame: m })),
                        frameRate: 4,
                        repeat: -1
                    });

                    return new SpriteRenderer(scene, 0, 0, PLAYER_SHIP_NAME);
                },
                preload: () => {
                    scene.load.atlas(PLAYER_SHIP_NAME, `assets/ships/${PLAYER_SHIP_NAME}.png`, `assets/ships/${PLAYER_SHIP_NAME}.json`);
                }
            };

        default:
            return {
                createObject() {
                    return scene.add
                        .circle(
                            0,
                            0,
                            8,
                            0x66ff66
                        )
                        .setOrigin(0.5, 0.5)
                },
                preload() {

                },
            };
    }
}

type GraphicObjectFactory = {
    /** Create graphic game object */
    createObject: () => Phaser.GameObjects.GameObject;

    /** Preload object graphics */
    preload: () => void;
}