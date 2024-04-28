import { StateObservableClassBase } from "../../src/index.js";

import sleep from "./sleep.js";

// Declare class state interface so everything is strongly typed
export interface LoginListenerState {
    isStarting: boolean;
    isStarted: boolean;
    isFailed: boolean;
}

// Extend StateObservableClassBase<LoginListenerState>
class LoginListener extends StateObservableClassBase<LoginListenerState> {
    constructor() {
        const initialState: LoginListenerState = {
            isStarting: false,
            isStarted: false,
            isFailed: false,
        };

        // Pass initial state to the StateObservableClassBase constructor
        super(initialState);
    }

    async start() {
        // Update class state by calling updateState() with properties that has changed
        this.updateState({ isStarting: true });

        try {
            await sleep(2500);

            this.updateState({ isStarted: true });
        }
        catch (error) {
            this.updateState({ isFailed: true });
        }
        finally {
            this.updateState({ isStarting: false });
        }
    }

    reset() {
        this.updateState({
            isStarting: false,
            isStarted: false,
            isFailed: false,
        });
    }
}

export default new LoginListener();
