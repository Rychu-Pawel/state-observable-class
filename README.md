# state-observable-class

The `state-observable-class` is an NPM package designed to facilitate the creation of reactive React components. 

It does so by providing `useStateObservableClass` hook which observes changes in the state of custom classes and automatically refreshing the React components when any state changes occur.

## Requirements

- React 18 or higher

## Installation

To install the package, use the following command in your project:

```bash
npm install state-observable-class
```

## Live demo

For a practical demonstration of how to use this package, please refer to the CodeSandbox project provided here:
[State Observable Class Example](https://codesandbox.io/p/sandbox/state-observable-class-kpkltn)

## Usage

To be observed by the `useStateObservableClass` hook, a class must adhere to the following rules:
* It must extend `StateObservableClassBase`, which is included in this package.
* It must pass its initial state to super() in its constructor.
* An interface or type describing the state should be defined.
* It should update its state by calling this.updateState({ changedProperty: 'newValue' }), a method inherited from the base class.

Here is an example of how such a class might be structured:

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