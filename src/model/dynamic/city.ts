import PirateEvents from "../../utils/pirateEvents";
import GameWorld from "./gameWorld";

export enum CityEvents {
    Unknown = 0,
    OnClick = 1,
    OnHover = 2,
}

export default class City implements IGameObject {
    private readonly _events = new PirateEvents<CityEvents>();
    public get events() {
        return this._events;
    }

    constructor(
        protected readonly gameWorld: GameWorld,
    ) {
    }

    public onCreated(): void {
        this.setClickable(true);
    }

    private _clickableFunctions = new Map<string, Function>();

    public setClickable(isClickable: boolean) {
        const myData = this.gameWorld.findGameObjectByGameObject(City, go => go === this);
        if (!myData)
            return;

        if (isClickable) {
            myData.graphics?.setInteractive({ cursor: 'pointer' });

            if (myData?.graphics instanceof Phaser.GameObjects.Arc) {
                const arcGraphics = myData.graphics as Phaser.GameObjects.Arc;
                if (this._clickableFunctions.has('pointerover'))
                    return;

                this._clickableFunctions.set('pointerover', () => {
                    arcGraphics.setScale(0.95);
                    this._events.emit(CityEvents.OnHover, true);
                });
                this._clickableFunctions.set('pointerout', () => {
                    arcGraphics.setScale(1);
                    this._events.emit(CityEvents.OnHover, false);
                });
                this._clickableFunctions.set('pointerdown', () => {
                    this._events.emit(CityEvents.OnClick, this);
                    arcGraphics.setScale(0.90);
                });
                this._clickableFunctions.set('pointerup', () => {
                    arcGraphics.setScale(1);
                });

                // register them
                this._clickableFunctions.forEach((value: Function, key: string) => arcGraphics.on(key, value));
            }

        } else {
            myData?.graphics?.setInteractive({ cursor: 'default' });

            if (myData.graphics instanceof Phaser.GameObjects.Arc) {
                const arcGraphics = myData.graphics as Phaser.GameObjects.Arc;

                this._clickableFunctions.forEach((value: Function, key: string) => {
                    arcGraphics.off(key, value);
                });
                this._clickableFunctions.clear();
            }
        }
    }
}