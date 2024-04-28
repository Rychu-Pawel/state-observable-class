import "global-jsdom/register";

import React from "react";

import test from "ava";

import { cleanup, render, fireEvent, screen } from '@testing-library/react';

import TestComponent from './example/testComponent.js';
import sleep from "./example/sleep.js";
import loginListener from "./example/loginListener.js";

test.afterEach(() => {
    cleanup();
    loginListener.reset();
});

test.serial(`loads and displays start button`, async t => {
    // ARRANGE & ACT
    render(<TestComponent />);

    // ASSERT
    const button: HTMLButtonElement = screen.getByRole(`button`);

    t.is(button.innerHTML, `Start!`);

    t.falsy(screen.queryByText(`Starting...`));
    t.falsy(screen.queryByText(`Listening started...`));
    t.falsy(screen.queryByText(`Error!`));
});

test.serial(`have starting after clicking the button`, async t => {
    // ARRANGE
    render(<TestComponent />);

    // ACT
    const button: HTMLButtonElement = screen.getByRole(`button`);
    fireEvent.click(button);

    // ASSERT
    t.truthy(screen.queryByText(`Starting...`));
    t.falsy(screen.queryByText(`Listening started...`));
    t.falsy(screen.queryByText(`Error!`));
});

test.serial(`have started after 3 seconds`, async t => {
    t.timeout(3500);

    // ARRANGE
    render(<TestComponent />);

    // ACT
    const button: HTMLButtonElement = screen.getByRole(`button`);
    fireEvent.click(button);

    await sleep(3000);

    // ASSERT
    t.falsy(screen.queryByText(`Starting...`));
    t.truthy(screen.queryByText(`Listening started...`));
    t.falsy(screen.queryByText(`Error!`));
});

test.serial(`Is back to original state after clicking the button and then reset`, async t => {
    t.timeout(3500);

    // ARRANGE
    render(<TestComponent />);

    // ACT
    const button: HTMLButtonElement = screen.getByRole(`button`);
    fireEvent.click(button);

    await sleep(3000);

    loginListener.reset();

    await sleep(0);

    // ASSERT
    const buttonAfterReset: HTMLButtonElement = screen.getByRole(`button`);

    t.is(buttonAfterReset.innerHTML, `Start!`);

    t.falsy(screen.queryByText(`Starting...`));
    t.falsy(screen.queryByText(`Listening started...`));
    t.falsy(screen.queryByText(`Error!`));
});