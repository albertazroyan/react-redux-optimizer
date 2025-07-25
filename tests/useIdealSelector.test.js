import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useIdealSelector } from '../src/useIdealSelector';

function createMockStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setState: (newState) => {
      state = newState;
      listeners.forEach((l) => l());
    },
  };
}

test('useIdealSelector updates selected state correctly', () => {
  const store = createMockStore({ value: 0 });

  const { result } = renderHook(() =>
    useIdealSelector(store, (state) => state.value)
  );

  expect(result.current).toBe(0);

  act(() => {
    store.setState({ value: 1 });
  });

  expect(result.current).toBe(1);

  act(() => {
    store.setState({ value: 1 });
  });

  expect(result.current).toBe(1);
});