import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface State {
  menus: any[];
}

interface Action {
  updateMenus: (menus) => void;
}

export const useGlobalStore = create<State & Action>()(
  devtools(
    persist(
      (set, get) => ({
        menus: [],
        updateMenus: (menus) => {
          set({ menus });
        },
      }),
      {
        name: 'userStore',
        storage: createJSONStorage(() => localStorage),
        // 只持久化某个字段
        partialize: (state) => ({ menus: state.menus }),
      },
    ),
    { name: 'globalStore' },
  ),
);
