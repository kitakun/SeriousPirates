import { AStarFinder } from "astar-typescript";
import { GameObjectStruct } from "../../model/dynamic/gameWorld";
import { Ship } from "../../model/dynamic/ship";
import PiratesRender, { GameLayersOrderEnum } from "../../services/render";
import Camera from "../control/camera";
import PlayerInput from "../control/playerInput";
import { IGameComponent } from "./IGameComponent";
import PathfindMover from "./pathfindMover";

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

        this.control_input.onClick(this.moveShip.bind(this));
    }

    private moveShip(isHold: boolean, rawClickPos: IVector2) {
        let gamePos = { x: 0, y: 0 };
        let gameScreenPos = { x: 0, y: 0 };

        if (isHold
            && this.control_camera.tryScreenToGamaPosition(rawClickPos, gamePos)
            && this.control_camera.tryScreenToActualGameScreenPosition(rawClickPos, gameScreenPos)) {
            {
                if (!!this.gr_moveToIndicator) {
                    this.gr_moveToIndicator.destroy();
                    this.gr_moveToIndicator = void 0;
                }

                // final point indicator
                this.gr_moveToIndicator = this.render.addToLayer(this.render.add.circle(gamePos.x, gamePos.y, 5, 0x66ff66, 1), GameLayersOrderEnum.UI);

                const clickedOnTile = this.control_camera.worldToTilePos(gameScreenPos);

                try {
                    const ignoreBoundsForPlayer = true;
                    const { x, y } = this.control_camera.worldToTilePos(this.ship.gameObject.position, ignoreBoundsForPlayer);

                    const myPathway = this.control_pathfind.findPath({ x, y }, clickedOnTile);

                    this.lines.forEach(lineGo => lineGo.destroy());

                    if (myPathway?.length) {
                        for (let i = 0; i < myPathway.length; i++) {
                            const [x, y] = myPathway[i];
                            const wPos = this.control_camera.tilePosToWorld({ x, y });
                            const dot = this.render.addToLayer(this.render.add.circle(wPos.x, wPos.y, 5, 0xFF0000, 1), GameLayersOrderEnum.UI);
                            this.lines.push(dot);
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
}