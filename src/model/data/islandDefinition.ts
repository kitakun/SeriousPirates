import { IDefinitionGameObject } from "./IDefinitionGameObject";

export default class IslandDefinition implements IDefinitionGameObject {
    constructor(
        public readonly tileName: string,
        public readonly position: IVector2,
    ) {
    }
}