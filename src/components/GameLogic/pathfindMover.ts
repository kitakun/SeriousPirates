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

    // events
    private _onPathIndexHasChangedEvents: Array<(index: number) => void> = [];
    private _onStopEvents: Array<() => void> = [];

    constructor(
        private readonly camera: Camera,
        private readonly movableObject: GameObjectStruct<IMovableGameObject>,
    ) {

    }

    /**
     * Subscribe on path index changes
     * @param cb action to call on index has changed
     * @returns Disposable method for unsubscription
     */
    public addPathIndexHasChanged(cb: (index: number) => void): IParametlessMethod {
        this._onPathIndexHasChangedEvents.push(cb);

        return () => this._onPathIndexHasChangedEvents.filter(f => f != cb);
    }

    /**
     * Subscribe on pathfind stop event
     * @param cb action to call on stop
     * @returns Disposable method for unsubscription
     */
    public addStopListener(cb: () => void): IParametlessMethod {
        this._onStopEvents.push(cb);

        return () => this._onStopEvents.filter(f => f != cb);
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
                    this._onPathIndexHasChangedEvents.forEach(f => f(this._pathIndex));
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
        this._onStopEvents.forEach(f => f());
    }
}