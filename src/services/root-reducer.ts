import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredients-slice';
import { feedReducer } from './slices/feeds-slice';
import { ordersReducer } from './slices/orders-slice';
import { userReducer } from './slices/user-slice';
import { constructorReducer } from './slices/constructor-slice';

export const rootReducer = combineReducers({
  user: userReducer,
  orders: ordersReducer,
  ingredients: ingredientsReducer,
  feed: feedReducer,
  constructorBurger: constructorReducer
});

export type RootState = ReturnType<typeof rootReducer>;
