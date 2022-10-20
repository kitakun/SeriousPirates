export class PirateGameObject {
    constructor(
        public readonly name: string,
        public readonly className: string,
        public readonly initialPosition: IVector2,
        public readonly properties: Tiled.Property[],
    ) {
    }
}