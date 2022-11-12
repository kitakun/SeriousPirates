import { IDefinitionGameObject } from "./IDefinitionGameObject";

export class GameObjectDefinition implements IDefinitionGameObject {
    constructor(
        public readonly name: string,
        public readonly className: string,
        public readonly initialPosition: IVector2,
        public readonly properties: Tiled.Property[],
    ) {
    }
}