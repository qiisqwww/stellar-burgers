import { expect, test, describe } from '@jest/globals';
import { fetchIngredients, ingredientsReducer } from './ingredients-slice';
import { configureStore } from '@reduxjs/toolkit';
import * as api from '../../utils/burger-api'; // импортируем модуль с API для моков

const setupStore = () =>
  configureStore({
    reducer: {
      ingredients: ingredientsReducer
    }
  });

describe('Тесты thunk fetchIngredients', () => {
  test('при rejected с undefined payload устанавливается дефолтная ошибка', () => {
    const store = setupStore();

    // Диспатчим rejected с payload === undefined
    store.dispatch({
      type: fetchIngredients.rejected.type,
      payload: undefined,
      error: { message: 'some error' }
    });

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch ingredients'); // вот эта ветка и покрывается
  });
  test('fetchIngredients успешно получает ингредиенты', async () => {
    const store = setupStore();

    // Мокаем getIngredientsApi чтобы вернуть тестовые данные
    const mockedData = [
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
        image_large: 'image_large.png'
      }
    ];
    jest.spyOn(api, 'getIngredientsApi').mockResolvedValue(mockedData);

    // Диспатчим thunk (он вызовет мок)
    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.items).toEqual(mockedData);
  });

  test('fetchIngredients обрабатывает ошибку', async () => {
    const store = setupStore();

    // Мокаем getIngredientsApi чтобы выбросить ошибку
    const errorMessage = 'Ошибка сети';
    jest
      .spyOn(api, 'getIngredientsApi')
      .mockRejectedValue(new Error(errorMessage));

    // Диспатчим thunk (он вызовет мок и упадет в catch)
    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.items).toEqual([]);
  });
});
