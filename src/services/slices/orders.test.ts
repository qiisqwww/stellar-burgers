import * as api from '../../utils/burger-api';
import { configureStore } from '@reduxjs/toolkit';
import {
  ordersReducer,
  fetchOrders,
  createOrder,
  fetchOrderByNumber,
  clearCurrentOrder,
  initialOrderState
} from './orders-slice';

import { TOrder } from '../../utils/types';

const setupStore = () =>
  configureStore({
    reducer: {
      orders: ordersReducer
    }
  });

describe('ordersSlice async thunks and reducers', () => {
  const mockOrder: TOrder = {
    _id: '1',
    status: 'done',
    name: 'Test order',
    createdAt: '2025-05-26T10:00:00.000Z',
    updatedAt: '2025-05-26T10:00:00.000Z',
    ingredients: ['ing1', 'ing2'],
    number: 123
  };

  // ----------- fetchOrders tests -----------
  describe('fetchOrders', () => {
    test('pending sets loading true and error null', () => {
      const store = setupStore();
      store.dispatch({ type: fetchOrders.pending.type });
      const state = store.getState().orders;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fulfilled sets orders and loading false', () => {
      const store = setupStore();
      store.dispatch({
        type: fetchOrders.fulfilled.type,
        payload: [mockOrder]
      });
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual([mockOrder]);
    });

    test('rejected sets error and loading false', () => {
      const store = setupStore();
      const errorMsg = 'Error fetching orders';
      store.dispatch({
        type: fetchOrders.rejected.type,
        payload: errorMsg
      });
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMsg);
    });

    test('rejected sets default error message when payload is undefined', () => {
      const store = setupStore();
      store.dispatch({
        type: fetchOrders.rejected.type
        // payload отсутствует
      });
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch orders');
    });
  });

  // ----------- createOrder tests -----------
  describe('createOrder', () => {
    test('pending sets loading true and error null', () => {
      const store = setupStore();
      store.dispatch({ type: createOrder.pending.type });
      const state = store.getState().orders;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fulfilled adds order, sets currentOrder and loading false', () => {
      const store = setupStore();
      store.dispatch({
        type: createOrder.fulfilled.type,
        payload: { order: mockOrder, name: 'Test' }
      });
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.orders[0]).toEqual(mockOrder);
      expect(state.currentOrder).toEqual(mockOrder);
    });

    test('rejected sets error and loading false', () => {
      const store = setupStore();
      const errorMsg = 'Error creating order';
      store.dispatch({
        type: createOrder.rejected.type,
        payload: errorMsg
      });
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMsg);
    });

    test('rejected sets default error message when payload is undefined', () => {
      const store = setupStore();
      store.dispatch({
        type: createOrder.rejected.type
        // payload отсутствует
      });
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to create order');
    });
  });

  // ----------- fetchOrderByNumber tests -----------
  describe('fetchOrderByNumber', () => {
    test('pending sets loading true and error null', () => {
      const store = setupStore();
      store.dispatch({ type: fetchOrderByNumber.pending.type });
      const state = store.getState().orders;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fulfilled resets currentOrder and sets loading false', () => {
      const store = setupStore();
      store.dispatch({
        type: fetchOrderByNumber.fulfilled.type,
        payload: [mockOrder]
      });
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      // Если логика действительно такова — currentOrder становится null
      expect(state.currentOrder).toBeNull();
    });

    test('rejected sets error and loading false', () => {
      const store = setupStore();
      const errorMsg = 'Error fetching order by number';
      store.dispatch({
        type: fetchOrderByNumber.rejected.type,
        payload: errorMsg
      });
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMsg);
    });

    test('rejected sets default error message when payload is undefined', () => {
      const store = setupStore();
      store.dispatch({
        type: fetchOrderByNumber.rejected.type
        // payload отсутствует
      });
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch order');
    });
  });

  // ----------- clearCurrentOrder reducer test -----------
  describe('clearCurrentOrder reducer', () => {
    test('sets currentOrder to null', () => {
      const store = setupStore();
      // Положим заказ в state
      store.dispatch({
        type: fetchOrders.fulfilled.type,
        payload: [mockOrder]
      });
      store.dispatch({
        type: createOrder.fulfilled.type,
        payload: { order: mockOrder, name: 'Test' }
      });
      // Проверяем, что currentOrder установлен
      expect(store.getState().orders.currentOrder).toEqual(mockOrder);

      // Очищаем currentOrder
      store.dispatch(clearCurrentOrder());
      expect(store.getState().orders.currentOrder).toBeNull();
    });
  });

  // ----------- Thunks error handling with mocks -----------
  describe('Orders thunk error handling', () => {
    let store: ReturnType<typeof setupStore>;

    beforeEach(() => {
      store = setupStore();
    });

    test('fetchOrders handles error correctly', async () => {
      jest
        .spyOn(api, 'getOrdersApi')
        .mockRejectedValueOnce(new Error('Network error'));
      await store.dispatch(fetchOrders());
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
    });

    test('createOrder handles error correctly', async () => {
      jest
        .spyOn(api, 'orderBurgerApi')
        .mockRejectedValueOnce(new Error('Order failed'));
      await store.dispatch(createOrder(['ingredient1', 'ingredient2']));
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Order failed');
    });

    test('fetchOrderByNumber handles error correctly', async () => {
      jest
        .spyOn(api, 'getOrderByNumberApi')
        .mockRejectedValueOnce(new Error('Order not found'));
      await store.dispatch(fetchOrderByNumber(123));
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Order not found');
    });
  });
});
