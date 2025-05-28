import { configureStore } from '@reduxjs/toolkit';
import { feedReducer, fetchFeed, initialFeedsState } from './feeds-slice';
import * as api from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';

// Мокаем весь модуль API для контроля запросов в thunk
jest.mock('../../utils/burger-api');

// Утилита для создания тестового Redux store с нашим редьюсером
const setupStore = () =>
  configureStore({
    reducer: { feed: feedReducer },
  });

describe('feedSlice', () => {
  // Пример заказа для тестов
  const mockOrder: TOrder = {
    _id: 'order-id',
    ingredients: ['1', '2'],
    status: 'done',
    name: 'Бургер',
    createdAt: '2025-05-26T12:00:00.000Z',
    updatedAt: '2025-05-26T12:30:00.000Z',
    number: 123,
  };

  // Сбрасываем моки перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('должен вернуть начальное состояние', () => {
    // При undefined state и инициализационном экшене возвращаем initialFeedsState
    const state = feedReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialFeedsState);
  });

  test('pending: loading = true, error = null', () => {
    // При dispatch pending устанавливаем флаг загрузки и сбрасываем ошибку
    const action = { type: fetchFeed.pending.type };
    const state = feedReducer(initialFeedsState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fulfilled: корректно обновляет state', () => {
    // При успешном запросе обновляем заказы, total и totalToday
    const payload = { orders: [mockOrder], total: 100, totalToday: 10 };
    const action = { type: fetchFeed.fulfilled.type, payload };
    const state = feedReducer({ ...initialFeedsState, loading: true }, action);

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(payload.orders);
    expect(state.total).toBe(payload.total);
    expect(state.totalToday).toBe(payload.totalToday);
  });

  test('rejected с payload: error = payload', () => {
    // При падении с payload используем его как текст ошибки
    const action = { type: fetchFeed.rejected.type, payload: 'Ошибка' };
    const state = feedReducer({ ...initialFeedsState, loading: true }, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });

  test('rejected без payload: error = default', () => {
    // При падении без payload используем дефолтное сообщение
    const action = { type: fetchFeed.rejected.type };
    const state = feedReducer({ ...initialFeedsState, loading: true }, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch feed');
  });

  test('fetchFeed thunk: успех', async () => {
    // Мокаем API на успешный ответ
    const mockedData = { success: true, orders: [mockOrder], total: 111, totalToday: 11 };
    jest.spyOn(api, 'getFeedsApi').mockResolvedValue(mockedData);

    const store = setupStore();
    await store.dispatch(fetchFeed());

    const state = store.getState().feed;
    expect(state.orders).toEqual(mockedData.orders);
    expect(state.total).toBe(111);
    expect(state.totalToday).toBe(11);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('fetchFeed thunk: ошибка запроса', async () => {
    // Мокаем API на выброс ошибки
    jest.spyOn(api, 'getFeedsApi').mockRejectedValue(new Error('Ошибка сервера'));

    const store = setupStore();
    await store.dispatch(fetchFeed());

    const state = store.getState().feed;
    expect(state.orders).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalToday).toBe(0);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка сервера');
  });
});
