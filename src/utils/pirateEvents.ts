export default class PirateEvents<T>{

    private readonly _events: Map<T, Function[]> = new Map();

    constructor(
        private readonly emitOnAddTypes: Array<T> = [],
    ) {
    }

    public on(eventType: T, act: Function) {
        if (!this._events.has(eventType)) {
            this._events.set(eventType, []);
        }

        this._events.get(eventType)?.push(act);

        // emit on add if we need to
        if (this.emitOnAddTypes.indexOf(eventType) >= 0) {
            act();
        }

        return () => {
            const eventsArr = this._events.get(eventType);
            this._events.set(eventType, eventsArr!.filter(f => f != act));
        };
    }

    public emit(data: T, param1: any = undefined, param2: any = undefined, param3: any = undefined, param4: any = undefined) {
        if (this._events.has(data)) {
            this._events.get(data)?.forEach(f => f(param1, param2, param3, param4));
        }
    }
}