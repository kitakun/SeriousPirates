import { GameObjectDefinition } from "../model/data/objectDefinition";
import { Ship } from "../model/dynamic/ship";

export const fillGameObjectState = (objectDefinition: GameObjectDefinition): IGameObject => {
    switch (objectDefinition.className) {
        case 'ship':
        case 'Ship':
            return new Ship({
                x: objectDefinition.initialPosition.x,
                y: objectDefinition.initialPosition.y,
            });
    }

    return {};
}