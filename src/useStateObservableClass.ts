import { useSyncExternalStore } from "react";

import StateObservableClassBase from "./stateObservableClassBase.js";

export default function useStateObservableClass(stateObservableClass: StateObservableClassBase<unknown>) {
    return useSyncExternalStore(callback => subscribe(callback, stateObservableClass), () => stateObservableClass.getStateSnapshot());
}

function subscribe(callback: () => void, stateObservableClass: StateObservableClassBase<unknown>) {
    stateObservableClass.addStateObserver(callback);
    return () => {
        stateObservableClass.removeStateObserver(callback);
    };
}