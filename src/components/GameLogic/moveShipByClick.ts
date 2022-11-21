import { AStarFinder } from "astar-typescript";
import { GameObjectStruct } from "../../model/dynamic/gameWorld";
import { Ship } from "../../model/dynamic/ship";
import PiratesRender, { GameLayersOrderEnum } from "../../services/render";
import Camera from "../control/camera";
import PlayerInput, { InputEventsEnum } from "../control/playerInput";
import { IGameComponent } from "./IGameComponent";
import PathfindMover from "./pathfindMover";

/** Should we draw pathfind point from start to end? */
const DRAW_PATHFIND_PATH = true;

export default class MoveShipByClick implements IGameComponent {
    private lines: Phaser.GameObjects.GameObject[] = [];
    private gr_moveToIndicator?: Phaser.GameObjects.GameObject;

    private mover: PathfindMover;

    constructor(
        private readonly render: PiratesRender,
        private readonly control_input: PlayerInput,
        private readonly control_camera: Camera,
        private readonly control_pathfind: AStarFinder,
        private readonly ship: GameObjectStruct<Ship>,
    ) {
        this.mover = ship.gameComponents.find(f => f instanceof PathfindMover) as PathfindMover;
        if (!this.mover)
            throw new Error('Can\'t find PathfindMover component in ship')

        this.control_input.on(InputEventsEnum.Click, this.moveShip.bind(this));
        if (DRAW_PATHFIND_PATH) {
            this.mover.addPathIndexHasChanged(this.shipHasMovedByPath.bind(this))
            this.mover.addStopListener(this.shipHasStopped.bind(this))
        }
    }

    private moveShip(isHold: boolean, clickedFor: number, rawClickPos: IVector2) {
        let gamePos = { x: 0, y: 0 };
        let gameScreenPos = { x: 0, y: 0 };

        if (!isHold
            && clickedFor < 0.15
            && this.control_camera.tryScreenToGamaPosition(rawClickPos, gamePos)
            && this.control_camera.tryScreenToActualGameScreenPosition(rawClickPos, gameScreenPos)) {
            {
                if (!!this.gr_moveToIndicator) {
                    this.gr_moveToIndicator.destroy();
                    this.gr_moveToIndicator = void 0;
                }

                // final point indicator
                this.gr_moveToIndicator = this.render.addToLayer(
                    this
                        .render
                        .add
                        .circle(gamePos.x, gamePos.y, 5, 0x66ff66, 1)
                        .setDepth(10),
                    GameLayersOrderEnum.GameObjects);

                const clickedOnTile = this.control_camera.worldToTilePos(gameScreenPos);

                try {
                    const ignoreBoundsForPlayer = true;
                    const { x, y } = this.control_camera.worldToTilePos(this.ship.gameObject.position, ignoreBoundsForPlayer);

                    const myPathway = this.control_pathfind.findPath({ x, y }, clickedOnTile);

                    if (DRAW_PATHFIND_PATH) {
                        this.lines.forEach(lineGo => lineGo.destroy());
                        this.lines.length = 0;
                    }

                    // create pathfind path with dots
                    if (myPathway?.length) {
                        if (DRAW_PATHFIND_PATH) {
                            const tileSize = this.control_camera.tileSize;

                            for (let i = 0; i < myPathway.length; i++) {
                                const [x, y] = myPathway[i];
                                const wPos = this.control_camera.tilePosToWorld({ x, y });
                                const dot = this.render.addToLayer(this.render.add.circle(wPos.x + tileSize.width / 2, wPos.y + tileSize.height / 2, 5, 0xFF0000, 1), GameLayersOrderEnum.GameObjects);
                                this.lines.push(dot);
                            }
                        }

                        this.mover!.moveByPath(myPathway);
                    } else {
                        this.mover!.stop();
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    private shipHasMovedByPath(index: number): void {
        if (this.lines?.length > 0) {
            const elementToDelete = this.lines?.shift();
            elementToDelete?.destroy();
        }
    }

    private shipHasStopped(): void {
        this.lines.forEach(lineGo => lineGo.destroy());
        this.lines.length = 0;
    }
}