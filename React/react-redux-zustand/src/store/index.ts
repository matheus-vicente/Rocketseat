import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { player } from "./slices/player";

export const store = configureStore({
  reducer: {
    player,
  },
});

export type StoreType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<StoreType> = useSelector;
export const useAppDispatch: () => AppDispatchType = useDispatch;
