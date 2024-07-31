import { useState, useRef } from 'react';
import type { Dispatch, SetStateAction, MutableRefObject } from 'react';

const useSyncState = <T>(defaultValue?: T): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>] => {
  const refValue = useRef<T>(defaultValue!);
  const [value, setValue] = useState<T>(defaultValue!);

  const set: Dispatch<SetStateAction<T>> = (v) => {
    refValue.current = v as T;
    setValue(v);
  };

  return [value, set, refValue!];
};

export default useSyncState;
