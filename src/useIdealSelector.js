import React from 'react';

function shallowEqual(objA, objB) {
  if (objA === objB) return true;
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (let key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key) || objA[key] !== objB[key]) {
      return false;
    }
  }
  return true;
}

const canUseSyncExternalStore = typeof React.useSyncExternalStore === 'function';

export function useIdealSelector(store, selector, equalityFn = shallowEqual) {
  const latestSelectedRef = React.useRef(selector(store.getState()));

  const getSnapshot = React.useCallback(() => latestSelectedRef.current, []);

  const subscribe = React.useCallback(
    (callback) => {
      return store.subscribe(() => {
        const newSelected = selector(store.getState());
        if (!equalityFn(latestSelectedRef.current, newSelected)) {
          latestSelectedRef.current = newSelected;
          callback();
        }
      });
    },
    [store, selector, equalityFn]
  );

  if (canUseSyncExternalStore) {
    return React.useSyncExternalStore(subscribe, getSnapshot);
  } else {
    const [selected, setSelected] = React.useState(latestSelectedRef.current);

    React.useEffect(() => {
      const checkForUpdates = () => {
        const newSelected = selector(store.getState());
        if (!equalityFn(latestSelectedRef.current, newSelected)) {
          latestSelectedRef.current = newSelected;
          setSelected(newSelected);
        }
      };
      const unsubscribe = store.subscribe(checkForUpdates);
      checkForUpdates();
      return unsubscribe;
    }, [store, selector, equalityFn]);

    return selected;
  }
}