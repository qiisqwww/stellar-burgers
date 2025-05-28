import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredients-slice';
import { feedReducer } from './slices/feeds-slice';
import { ordersReducer } from './slices/orders-slice';
import { userReducer } from './slices/user-slice';
import { constructorReducer } from './slices/constructor-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  orders: ordersReducer,
  user: userReducer,
  constructorBurger: constructorReducer
});

export type RootState = ReturnType<typeof rootReducer>;
