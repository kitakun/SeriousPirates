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