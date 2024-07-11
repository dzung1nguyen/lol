import { createStore } from "zustand/vanilla";

export type GlobalState = {
  mobileMenu: boolean;
  loading: boolean;
  authenticated?: boolean;
  isHandelingLogin: boolean;
};

export type GlobalActions = {
  setLoading: (status: boolean) => void;
  setMobileMenu: (status: boolean) => void;
  setAuthenticated: (status: boolean) => void;
  setIsHandelingLogin: (status: boolean) => void;
};

export type GlobalStore = GlobalState & GlobalActions;

export const defaultInitState: GlobalState = {
  loading: false,
  mobileMenu: false,
  isHandelingLogin: false,
};

export const createGlobalStore = (
  initState: GlobalState = defaultInitState
) => {
  return createStore<GlobalStore>()((set) => ({
    ...initState,
    setLoading: (status: boolean) => set(() => ({ loading: status })),
    setMobileMenu: (status: boolean) => set(() => ({ mobileMenu: status })),
    setIsHandelingLogin: (status: boolean) =>
      set(() => ({ isHandelingLogin: status })),
    setAuthenticated: (status: boolean) =>
      set(() => ({ authenticated: status })),
  }));
};
