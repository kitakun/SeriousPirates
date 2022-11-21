import { GameObjectStruct } from "../../model/dynamic/gameWorld";
import IMovableGameObject from "../../types/gameobjects/IMovableGameObject";
import { lerp } from "../../utils/mathHelper";
import PirateEvents from "../../utils/pirateEvents";
import Camera from "../control/camera";
import { IGameComponent } from "./IGameComponent";
import { IUpdatable } from "./IUpdatable";

export enum PathfindMoverEvents {
    Unknown = 0,
    /** Subscribe on path index changes */
    PathIndexHasChanged = 1,
    /** Subscribe on pathfind stop event */
    StopListener = 2,
}

export default class PathfindMover implements IGameComponent, IUpdatable {

    private readonly _events = new PirateEvents<PathfindMoverEvents>();
    public get events() {
        return this._events;
    }

    private _pathIndex = 0;
    private _pathLerp = 0;
    public get pathLerp() {
        return this._pathLerp;
    }
    private _pathToFollow: number[][] | null = null;
    private _startMoveFrom?: IVector2;

    constructor(
        private readonly camera: Camera,
        private readonly movableObject: GameObjectStruct<IMovableGameObject>,
    ) {

    }

    public update(time: number, delta: number) {
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

                const prevWorldPos = this.movableObject.gameObject.position;
                const newWorldPos = {
                    x: lerp(fromXworld, toInWorld.x, this._pathLerp),
                    y: lerp(fromYworld, toInWorld.y, this._pathLerp),
                };

                this.movableObject.gameObject.position = newWorldPos;
                this.movableObject.gameObject.direction = {
                    x: newWorldPos.x - prevWorldPos.x,
                    y: newWorldPos.y - prevWorldPos.y,
                };

                if (this._pathLerp === 1) {
                    this._pathIndex++;
                    this._events.emit(PathfindMoverEvents.PathIndexHasChanged, this._pathIndex);
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

    public moveByPath(myPathway: number[][]) {
        if (myPathway.length > 1) {
            this._pathIndex = 0;
            this._pathLerp = 0;
            this._pathToFollow = myPathway;
            this._startMoveFrom = this.movableObject.gameObject.position;
        } else {
            this.stop();
        }
    }

    public stop(): void {
        this._pathIndex = 0;
        this._pathLerp = 1;
        this._pathToFollow = null;
        this._events.emit(PathfindMoverEvents.StopListener);
    }
}