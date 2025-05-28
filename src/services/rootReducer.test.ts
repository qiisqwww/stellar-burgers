import { test, describe, expect } from '@jest/globals';
import { rootReducer } from './root-reducer';

import { initialUserState } from './slices/user-slice';
import { initialFeedsState } from './slices/feeds-slice';
import { initialOrderState } from './slices/orders-slice';
import { initialIngredientsState } from './slices/ingredients-slice';
import { initialConstructorFeedsState } from './slices/constructor-slice';

describe('Root reducer: начальное состояние', () => {
  test('возвращает начальное состояние, если передан неизвестный экшен', () => {
    const fakeAction = { type: 'SOME_RANDOM_ACTION' };

    const result = rootReducer(undefined, fakeAction);

    expect(result).toEqual({
      user: initialUserState,
      feed: initialFeedsState,
      orders: initialOrderState,
      ingredients: initialIngredientsState,
      constructorBurger: initialConstructorFeedsState
    });
  });
});
