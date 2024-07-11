import LaravelApiRequest from "@/utils/LaravelApiRequest";
import { createStore } from "zustand/vanilla";

export type PostState = {
  activeCategory?: Model.Category;
  categories: Model.Category[];
  players: any;
  search: string;
  sourceType: string;
};

export type PostActions = {
  setCategories: (categories: Model.Category[]) => void;
  getCategories: (locale: string) => void;
  addPlayerRef: (playerRef: any) => void;
  clearPlayersRef: () => void;
  setSourceType: (value: string) => void;
  setPostSearch: (value: string) => void;
  setActiveCategory: (code?: string) => void;
};

export type PostStore = PostState & PostActions;

export const defaultInitState: PostState = {
  activeCategory: undefined,
  categories: [],
  players: [],
  search: "",
  sourceType: "all",
};

export const createPostStore = (initState: PostState = defaultInitState) => {
  return createStore<PostStore>()((set) => ({
    ...initState,
    setCategories: (categories: Model.Category[]) => {
      set(() => ({ categories: categories }));
    },
    getCategories: async (locale: string) => {
      const { data } = await LaravelApiRequest.locale(locale).get(
        "/api/categories"
      );
      const categories: Model.Category[] = data?.categories ?? [];
      set(() => ({ categories: categories }));
    },

    addPlayerRef: (playerRef: any) => {
      set((state) => ({ players: [...state.players, playerRef] }));
    },

    clearPlayersRef: () => {
      set(() => ({ players: [] }));
    },

    setSourceType: async (value: string) => {
      set(() => ({ sourceType: value }));
    },
    setPostSearch: async (value: string) => {
      set(() => ({ search: value?.trim() ?? "" }));
    },
    setActiveCategory: async (code?: string) => {
      set((state) => {
        const category = code
          ? state.categories.find((option) => option.code === code)
          : undefined;
        return { activeCategory: category ?? undefined };
      });
    },
  }));
};
