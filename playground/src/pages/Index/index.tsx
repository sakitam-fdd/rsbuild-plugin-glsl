import type { FC } from 'react';
import useSyncState from '@/hooks/useSyncState';
import styles from './index.module.less';

const Main: FC = () => {
  const [config, setConfig, configRef] = useSyncState<Record<string, any>>({});

  return (
    <div className={styles.wrap}>
      {process.env.APP_TITLE}
    </div>
  );
};

export default Main;
