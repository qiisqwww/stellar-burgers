import { test, describe, expect } from '@jest/globals';

// Импортируем главный редьюсер, объединяющий все слайсы приложения
import { rootReducer } from './root-reducer';

// Начальные состояния каждого слайса для сравнения
import { initialUserState } from './slices/user-slice';
import { initialFeedsState } from './slices/feeds-slice';
import { initialOrderState } from './slices/orders-slice';
import { initialIngredientsState } from './slices/ingredients-slice';
import { initialConstructorFeedsState } from './slices/constructor-slice';

describe('Root reducer: начальное состояние', () => {
  test('возвращает весь стейт с начальными значениями при неизвестном экшене', () => {
    // При передаче undefined state и случайного экшена ожидаем конкатенацию всех initialState
    const fakeAction = { type: 'SOME_RANDOM_ACTION' };
    const result = rootReducer(undefined, fakeAction);

    expect(result).toEqual({
      user: initialUserState,
      feed: initialFeedsState,
      orders: initialOrderState,
      ingredients: initialIngredientsState,
      constructorBurger: initialConstructorFeedsState,
    });
  });
});
