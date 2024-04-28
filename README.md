# state-observable-class

 state-observable-class is an NPM package that enables the creation of reactive React components by observing state changes in custom classes. 
 
 This package provides a hook `useStateObservableClass` that automatically refreshes React components when the state in the observed class changes.

## Requirements

- React 18 or higher

## Installation

To install the package, use the following command in your project:

```bash
npm install state-observable-class
```

## Live demo

For a complete example of how to use this package, please refer to the provided CodeSandbox project here:
[State Observable Class Example](https://codesandbox.io/p/sandbox/state-observable-class-kpkltn)

## Usage

A class that can be observed by the hook need to follow a few rules:
* It has to extends `StateObservableClassBase` which is delivered in this package
* It has to pass it's initial state to the `super()` in its constructor
* An interface or a type describing the state is needed
* It has to update its state by calling `this.updateState({ changedProperty: 'value' })`. The method comes from the base class.

An example of such a class can look as follows:

```typescript
import { StateObservableClassBase } from "state-observable-class";
import sleep from "await-sleep";

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
    // Class state updates are done by calling updateState() with properties that has changed
    this.updateState({ isStarting: true });

    try {
      await sleep(2500);

      this.updateState({ isStarted: true });
    } catch (error) {
      this.updateState({ isFailed: true });
    } finally {
      this.updateState({ isStarting: false });
    }
  }
}

export default new LoginListener();
```

This class is ready to be used in a component. React will refresh all components observing its state. You can also directly call all its methods.

```tsx
import React from "react";
import { useStateObservableClass } from "state-observable-class";

import loginListener from "./loginListener";

export default function Component1() {
  const loginListenerState = useStateObservableClass(loginListener);

  const canStart =
    !loginListenerState.isStarting &&
    !loginListenerState.isStarted &&
    !loginListenerState.isFailed;

  return (
    <>
      <h1>Component 1</h1>
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
```