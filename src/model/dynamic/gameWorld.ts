import { GraphicTypeEnum } from "../../services/render";
import { IDefinitionGameObject } from "../data/IDefinitionGameObject";
import { GameObjectDefinition } from "../data/objectDefinition";
import WorldDefinition from "../data/worldDefinition";

export default class GameWorld {

    public readonly objects: GameObjectStruct<IGameObject>[] = [];

    constructor(
        public readonly worldDefinition: WorldDefinition
    ) {
    }

    /**
     * Find firtOrDefault GameObject with constructor
     * @param filterType Final GameObject type
     * @returns FirstOrDefault GameObject of Type
     */
    findGameObject<T extends IGameObject, TFilter extends T>(filterType: Constructor<TFilter>) {
        return this.objects.find(f => f.gameObject instanceof filterType);
    }

    /**
     * Find GameObject with property
     * @param filterType GameObject final class
     * @param withProperty property searcher
     * @returns GameObject
     */
    findGameObjectWithPropertry<T extends IGameObject, TFilter extends T>(filterType: Constructor<TFilter>, withProperty: (val: Tiled.Property) => boolean): GameObjectStruct<T> {
        return this.objects.find(f => f.gameObject instanceof filterType
            && f.difinitionData instanceof GameObjectDefinition
            && f.difinitionData.properties?.find((f) => withProperty(f))) as GameObjectStruct<T>;
    }
}

export interface GameObjectStruct<T extends IGameObject> {
    graphics: Phaser.GameObjects.GameObject;
    difinitionData: IDefinitionGameObject;
    gameObject: T;
    type: GraphicTypeEnum;
}