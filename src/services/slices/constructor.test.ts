import { expect, test, describe, jest } from '@jest/globals';
import { nanoid } from '@reduxjs/toolkit';
import type { ConstructorState } from './constructor-slice';
import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  clearBun,
  setBun,
} from './constructor-slice';

// Мокаем nanoid для предсказуемых ID в тестах
jest.mock('@reduxjs/toolkit', () => {
  const actual = jest.requireActual<typeof import('@reduxjs/toolkit')>(
    '@reduxjs/toolkit'
  );
  return {
    ...actual,
    nanoid: jest.fn(() => 'mockedID'),
  };
});

describe('constructorReducer', () => {
  // Общий начальный стейт для всех тестов
  const initialState: ConstructorState = {
    bun: {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      id: '0',
    },
    ingredients: [
      {
        _id: '643d69a5c3f7b9001cfa0942',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
        id: '1',
      },
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        id: '2',
      },
    ],
  };

  test('добавление ингредиента', () => {
    // Проверяем, что к стейту добавляется новый ингредиент с сгенерированным ID
    const ingredient = {
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    };

    const expectedState: ConstructorState = {
      ...initialState,
      ingredients: [
        ...initialState.ingredients,
        { ...ingredient, id: 'mockedID' }, // Ожидаем присвоение мокированного ID
      ],
    };

    const newState = constructorReducer(initialState, addIngredient(ingredient));

    expect(nanoid).toHaveBeenCalled(); // Должен вызваться генератор ID
    expect(newState).toEqual(expectedState);
  });

  test('удаление ингредиента', () => {
    // Проверяем удаление по ID
    const idToRemove = '1';
    const expectedState: ConstructorState = {
      ...initialState,
      ingredients: initialState.ingredients.filter(i => i.id !== idToRemove),
    };

    const newState = constructorReducer(initialState, removeIngredient(idToRemove));
    expect(newState).toEqual(expectedState);
  });

  test('перемещение ингредиента', () => {
    // Проверяем перестановку элементов массива ingredients
    const expectedState: ConstructorState = {
      ...initialState,
      ingredients: [
        initialState.ingredients[1],
        initialState.ingredients[0],
      ],
    };

    const newState = constructorReducer(initialState, moveIngredient({ fromIndex: 0, toIndex: 1 }));
    expect(newState).toEqual(expectedState);
  });

  test('очистка конструктора', () => {
    // Проверяем сброс всего конструктора
    const expectedState: ConstructorState = {
      bun: null,
      ingredients: [],
    };

    const newState = constructorReducer(initialState, clearConstructor());
    expect(newState).toEqual(expectedState);
  });

  test('очистка булки', () => {
    // Проверяем удаление булки из стейта
    const expectedState: ConstructorState = {
      ...initialState,
      bun: null,
    };

    const newState = constructorReducer(initialState, clearBun());
    expect(newState).toEqual(expectedState);
  });

  test('установка булки', () => {
    // Проверяем установку новой булки с генерацией ID
    const newBun = {
      _id: '643d69a5c3f7b9001cfa0999',
      name: 'Новая булка',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 100,
      image: '',
      image_mobile: '',
      image_large: '',
    };

    const expectedState: ConstructorState = {
      ...initialState,
      bun: { ...newBun, id: 'mockedID' }, // Мокированный ID для булки
    };

    const newState = constructorReducer(initialState, setBun(newBun));
    expect(newState).toEqual(expectedState);
  });
});
