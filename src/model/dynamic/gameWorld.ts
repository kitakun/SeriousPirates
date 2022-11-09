import { IGameComponent } from "../../components/GameLogic/IGameComponent";
import { IUpdatable } from "../../components/GameLogic/IUpdatable";
import { GraphicTypeEnum } from "../../services/render";
import { IDefinitionGameObject } from "../data/IDefinitionGameObject";
import { GameObjectDefinition } from "../data/objectDefinition";
import WorldDefinition from "../data/worldDefinition";

export default class GameWorld implements IUpdatable {

    public readonly objects: GameObjectStruct<IGameObject>[] = [];

    constructor(
        public readonly worldDefinition: WorldDefinition
    ) {
    }

    update(time: number, delta: number): void {
        for (let object of this.objects) {
            if (object.gameComponents.length) {
                for (let objectComponent of object.gameComponents) {
                    if ((objectComponent as IUpdatable).update) {
                        (objectComponent as IUpdatable).update(time, delta);
                    }
                }
            }
        }
    }

    /**
     * Find firtOrDefault GameObject with constructor
     * @param filterType Final GameObject type
     * @returns FirstOrDefault GameObject of Type
     */
    findGameObject<T extends IGameObject>(filterType: Constructor<T>) {
        return this.objects.find(f => f.gameObject instanceof filterType);
    }

    findGameObjectByGameObject<T extends IGameObject>(filterType: Constructor<T>, withComponent: (val: IGameComponent) => boolean) {
        return this.objects.find(f => f.gameObject instanceof filterType
            && withComponent(f.gameObject)) as GameObjectStruct<T>;
    }

    /**
     * Find GameObject with property
     * @param filterType GameObject final class
     * @param withProperty property searcher
     * @returns GameObject
     */
    findGameObjectWithPropertry<T extends IGameObject>(filterType: Constructor<T>, withProperty: (val: Tiled.Property) => boolean): GameObjectStruct<T> {
        return this.objects.find(f => f.gameObject instanceof filterType
            && f.difinitionData instanceof GameObjectDefinition
            && f.difinitionData.properties?.find((f) => withProperty(f))) as GameObjectStruct<T>;
    }
}

export interface GameObjectStruct<T extends IGameObject> {
    gameComponents: IGameComponent[];
    graphics: Phaser.GameObjects.GameObject;
    difinitionData: IDefinitionGameObject;
    gameObject: T;
    type: GraphicTypeEnum;
}