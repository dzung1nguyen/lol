'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'

import { type PostStore, createPostStore } from '@/stores/post-store'

export const PostStoreContext = createContext<StoreApi<PostStore> | null>(
  null,
)

PostStoreContext.Provider

export interface PostStoreProviderProps {
  children: ReactNode
}

export const PostStoreProvider = ({
  children,
}: PostStoreProviderProps) => {
  const storeRef = useRef<StoreApi<PostStore>>()
  if (!storeRef.current) {
    storeRef.current = createPostStore()
  }

  return (
    <PostStoreContext.Provider value={storeRef.current}>
      {children}
    </PostStoreContext.Provider>
  )
}

export const usePostStore = <T,>(
  selector: (store: PostStore) => T,
): T => {
  const postStoreContext = useContext(PostStoreContext)

  if (!postStoreContext) {
    throw new Error(`usePostStore must be use within PostStoreProvider`)
  }

  return useStore(postStoreContext, selector)
}
