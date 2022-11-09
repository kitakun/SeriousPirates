import { GameObjectStruct } from "../../model/dynamic/gameWorld";
import IMovableGameObject from "../../types/gameobjects/IMovableGameObject";
import { lerp } from "../../utils/mathHelper";
import Camera from "../control/camera";
import { IGameComponent } from "./IGameComponent";
import { IUpdatable } from "./IUpdatable";

export default class PathfindMover implements IGameComponent, IUpdatable {

    private _pathIndex = 0;
    private _pathLerp = 0;
    private _pathToFollow: number[][] | null = null;
    private _startMoveFrom?: IVector2;

    constructor(
        private readonly camera: Camera,
        private readonly movableObject: GameObjectStruct<IMovableGameObject>,
    ) {

    }

    update(time: number, delta: number) {
        if (!this._pathToFollow)
            return;

        try {
            if (this._pathLerp < 1) {
                this._pathLerp += (delta / 1000) * this.movableObject.gameObject.moveSpeed;
                if (this._pathLerp > 1) {
                    this._pathLerp = 1;
                }

                const { x: fromXworld, y: fromYworld } = this._startMoveFrom!;

                const [toX, toY] = this._pathToFollow![this._pathIndex + 1];
                const toInWorld = this.camera.tilePosToWorld({
                    x: toX,
                    y: toY,
                });

                this.movableObject.gameObject.position = {
                    x: lerp(fromXworld, toInWorld.x, this._pathLerp),
                    y: lerp(fromYworld, toInWorld.y, this._pathLerp),
                };

                if (this._pathLerp === 1) {
                    this._pathIndex++;
                    this._startMoveFrom = this.movableObject.gameObject.position;
                    if (this._pathToFollow!.length - 1 <= this._pathIndex) {
                        this.stop();
                    } else {
                        // move to next point
                        this._pathLerp = 0;
                    }
                }
            }
        } catch (err) {
            console.error('failed in pathfind', err);
            this.stop();
        }
    }

    moveByPath(myPathway: number[][]) {
        if (myPathway.length > 1) {
            this._pathIndex = 0;
            this._pathLerp = 0;
            this._pathToFollow = myPathway;
            this._startMoveFrom = this.movableObject.gameObject.position;
        } else {
            this.stop();
        }
    }

    stop(): void {
        this._pathIndex = 0;
        this._pathLerp = 1;
        this._pathToFollow = null;
    }
}