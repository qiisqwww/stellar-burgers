import { expect, test, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { fetchIngredients, ingredientsReducer, initialIngredientsState } from './ingredients-slice';
import * as api from '../../utils/burger-api';
import type { TIngredient } from '../../utils/types';

// Мокаем весь модуль API, чтобы контролировать ответы в thunk
jest.mock('../../utils/burger-api');

// Утилита для создания тестового Redux store с нашим редьюсером
const setupStore = () =>
  configureStore({
    reducer: { ingredients: ingredientsReducer },
    preloadedState: { ingredients: initialIngredientsState },
  });

describe('Тесты thunk fetchIngredients', () => {
  test('при rejected с undefined payload устанавливается дефолтная ошибка', () => {
    // При отклонении без payload должно выставляться дефолтное сообщение об ошибке
    const store = setupStore();

    store.dispatch({
      type: fetchIngredients.rejected.type,
      payload: undefined,
      error: { message: 'some error' },
    });

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch ingredients');
  });

  test('fetchIngredients успешно получает ингредиенты', async () => {
    // Мокаем API для возврата списка ингредиентов
    const mockedData: TIngredient[] = [
      {
        _id: '1',
        name: 'Test Ingredient',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 7,
        calories: 50,
        price: 100,
        image: 'image.png',
        image_mobile: 'image_mobile.png',
        image_large: 'image_large.png',
      },
    ];
    jest.spyOn(api, 'getIngredientsApi').mockResolvedValue(mockedData);

    const store = setupStore();
    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.items).toEqual(mockedData);
  });

  test('fetchIngredients обрабатывает ошибку', async () => {
    // Мокаем API на выброс ошибки
    const errorMessage = 'Ошибка сети';
    jest.spyOn(api, 'getIngredientsApi').mockRejectedValue(new Error(errorMessage));

    const store = setupStore();
    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.items).toEqual([]);
  });
});
