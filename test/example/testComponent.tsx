import React from "react";

import { useStateObservableClass } from "../../src/index.js";

import loginListener from "./loginListener.js";

export default function TestComponent() {
    const loginListenerState = useStateObservableClass(loginListener);

    const canStart = !loginListenerState.isStarting
        && !loginListenerState.isStarted
        && !loginListenerState.isFailed;

    return (
        <>
            <h1>Test component</h1>
            {canStart && (
                // We are free to call loginListener methods
                <button onClick={() => loginListener.start()}>Start!</button>
            )}
            {loginListenerState.isStarting && <span>Starting...</span>}
            {loginListenerState.isStarted && <span>Listening started...</span>}
            {loginListenerState.isFailed && <span>Error!</span>}
        </>
    );
}
