import type { ComponentProps } from 'react';
import { useLang } from '@rspress/core/runtime';
import { HomeLayout as DefaultHomeLayout } from '@rspress/core/theme-original';
import { HomePipeline } from './components/HomePipeline';

export * from '@rspress/core/theme-original';

export function HomeLayout({ afterFeatures, ...props }: ComponentProps<typeof DefaultHomeLayout>) {
  const lang = useLang();

  return (
    <DefaultHomeLayout
      {...props}
      afterFeatures={
        <>
          {afterFeatures}
          <HomePipeline lang={lang === 'zh' ? 'zh' : 'en'} />
        </>
      }
    />
  );
}
