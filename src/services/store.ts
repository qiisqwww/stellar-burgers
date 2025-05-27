import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';
import {
  TypedUseSelectorHook,
  useDispatch as useDispatchHook,
  useSelector as useSelectorHook
} from 'react-redux';

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export const useDispatch = (): AppDispatch => useDispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorHook;

export default store;
