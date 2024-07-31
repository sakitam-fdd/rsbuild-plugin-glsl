import { debounce } from 'lodash-es';
import { useState, useCallback, useEffect, useRef, useImperativeHandle } from 'react';

function observerDomResize(dom, callback) {
  const MutationObserver =
    window.MutationObserver || (window as any).WebKitMutationObserver || (window as any).MozMutationObserver;

  const observer = new MutationObserver(callback);

  observer.observe(dom, {
    attributes: true,
    attributeFilter: ['style'],
    attributeOldValue: true,
  });

  return observer;
}

export default function useAutoResize(ref) {
  const [state, setState] = useState({ width: 0, height: 0 });

  const domRef = useRef(null);

  const setWH = useCallback(() => {
    if (domRef && domRef.current) {
      const { clientWidth, clientHeight } = domRef.current;

      setState({ width: clientWidth, height: clientHeight });
    }
  }, []);

  useImperativeHandle(ref, () => ({ setWH }), [setWH]);

  useEffect(() => {
    const debounceSetWHFun = debounce(setWH, 100);

    debounceSetWHFun();

    const domObserver = observerDomResize(domRef.current, debounceSetWHFun);

    window.addEventListener('resize', debounceSetWHFun);

    return () => {
      domObserver.disconnect();
      domObserver.takeRecords();

      window.removeEventListener('resize', debounceSetWHFun);
    };
  }, [setWH]);

  return { ...state, domRef, setWH };
}
