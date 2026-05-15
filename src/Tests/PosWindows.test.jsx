import posReducer, { createNewWindow } from "../features_State/posSlice";
import { expect, test } from "vitest";

test("createNewWindow with explicit id adds a window and sets activeWindowId", () => {
    const initialState = { windows: [], activeWindowId: null };
    const next = posReducer(initialState, createNewWindow("test-window-1"));

    expect(next.windows).toHaveLength(1);
    expect(next.activeWindowId).toBe("test-window-1");
    expect(next.windows[0].id).toBe("test-window-1");
    expect(next.windows[0].items).toEqual([]);
});

test("createNewWindow without id generates a window id and prevents duplicates", () => {
    const initialState = { windows: [], activeWindowId: null };

    const stateA = posReducer(initialState, createNewWindow());


    
    // should have created one window
    expect(stateA.windows).toHaveLength(1);
    const generatedId = stateA.activeWindowId;
    expect(typeof generatedId).toBe("string");
    expect(generatedId.startsWith("window-")).toBe(true);

    // dispatching createNewWindow with the same generated id should not create duplicates
    const stateB = posReducer(stateA, createNewWindow(generatedId));
    expect(stateB.windows).toHaveLength(1);
    expect(stateB.activeWindowId).toBe(generatedId);
});