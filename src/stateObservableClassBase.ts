export default class StateObservableClassBase<T> {
    protected state: T;

    #stateObservers = new Set<() => void>();

    constructor(initialState: T) {
        this.state = initialState;
    }

    getStateSnapshot(): Readonly<T> {
        return this.state;
    }

    protected updateState(updatedStateProperties: Partial<T>) {
        this.state = {
            ...this.state,
            ...updatedStateProperties,
        };

        this.notifyStateObservers();
    }

    protected notifyStateObservers() {
        this.#stateObservers.forEach(observer => observer());
    }

    addStateObserver(handler: () => void) {
        this.#stateObservers.add(handler);
    }

    removeStateObserver(handler: () => void) {
        this.#stateObservers.delete(handler);
    }
}