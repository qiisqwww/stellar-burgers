import { configureStore } from '@reduxjs/toolkit';
import { feedReducer, fetchFeed, initialFeedsState } from './feeds-slice';
import * as api from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

jest.mock('../../utils/burger-api');

const setupStore = () =>
  configureStore({
    reducer: {
      feed: feedReducer
    }
  });

describe('feedSlice', () => {
  const mockOrder: TOrder = {
    _id: 'order-id',
    ingredients: ['1', '2'],
    status: 'done',
    name: 'Бургер',
    createdAt: '2025-05-26T12:00:00.000Z',
    updatedAt: '2025-05-26T12:30:00.000Z',
    number: 123
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('должен вернуть начальное состояние', () => {
    const state = feedReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialFeedsState);
  });

  test('pending: loading = true, error = null', () => {
    const action = { type: fetchFeed.pending.type };
    const state = feedReducer(initialFeedsState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fulfilled: корректно обновляет state', () => {
    const payload = {
      orders: [mockOrder],
      total: 100,
      totalToday: 10
    };
    const action = { type: fetchFeed.fulfilled.type, payload };
    const state = feedReducer({ ...initialFeedsState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(payload.orders);
    expect(state.total).toBe(payload.total);
    expect(state.totalToday).toBe(payload.totalToday);
  });

  test('rejected с payload: error = payload', () => {
    const action = { type: fetchFeed.rejected.type, payload: 'Ошибка' };
    const state = feedReducer({ ...initialFeedsState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });

  test('rejected без payload: error = default', () => {
    const action = { type: fetchFeed.rejected.type };
    const state = feedReducer({ ...initialFeedsState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch feed');
  });

  test('fetchFeed thunk: успех', async () => {
    const mockedData = {
      success: true,
      orders: [mockOrder],
      total: 111,
      totalToday: 11
    };

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
    jest
      .spyOn(api, 'getFeedsApi')
      .mockRejectedValue(new Error('Ошибка сервера'));

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
