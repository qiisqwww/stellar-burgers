import { configureStore } from '@reduxjs/toolkit'; // Для потенциального тестирования thunks через store
import thunk from 'redux-thunk'; // Поддержка thunk-микросреды, пока не используется напрямую

import {
  userReducer,
  initialUserState,
  registerUser,
  loginUser,
  logoutUser,
  fetchUser,
  updateUser,
  requestPasswordReset,
  resetPassword,
  clearPasswordReset,
  UserState,
} from './user-slice';

describe('userSlice reducer and async thunks', () => {
  let state: UserState;

  beforeEach(() => {
    // Сохраняем чистый начальный стейт перед каждым тестом
    state = { ...initialUserState };
  });

  test('should handle initial state', () => {
    // При неизвестном экшене возвращаем initialUserState
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialUserState);
  });

  test('should handle clearPasswordReset', () => {
    // clearPasswordReset сбрасывает флаг passwordResetRequested
    const prevState: UserState = { ...state, passwordResetRequested: true };
    const newState = userReducer(prevState, clearPasswordReset());
    expect(newState.passwordResetRequested).toBe(false);
  });

  describe('registerUser thunk', () => {
    test('should set loading true on pending', () => {
      // При начале регистрации: loading = true, error = null
      const action = { type: registerUser.pending.type };
      const newState = userReducer(state, action);
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('should update user and loading false on fulfilled', () => {
      // При успешной регистрации: сохраняем данные пользователя и токены
      const fakeUser = { name: 'Test', email: 'test@example.com' };
      const action = {
        type: registerUser.fulfilled.type,
        payload: { user: fakeUser, accessToken: 'token', refreshToken: 'ref' },
      };
      const newState = userReducer(state, action);
      expect(newState.user).toEqual(fakeUser);
      expect(newState.loading).toBe(false);
    });

    test('should set error and loading false on rejected', () => {
      // При ошибке регистрации: сохраняем сообщение, выключаем loading
      const action = { type: registerUser.rejected.type, payload: 'Registration error' };
      const newState = userReducer(state, action);
      expect(newState.error).toBe('Registration error');
      expect(newState.loading).toBe(false);
    });
  });

  describe('loginUser thunk', () => {
    test('should handle pending', () => {
      // При начале логина: loading = true, error = null
      const action = { type: loginUser.pending.type };
      const newState = userReducer(state, action);
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('should handle fulfilled', () => {
      // При успешном логине: сохраняем данные пользователя
      const fakeUser = { name: 'Login', email: 'login@example.com' };
      const action = {
        type: loginUser.fulfilled.type,
        payload: { user: fakeUser, accessToken: 'token', refreshToken: 'ref' },
      };
      const newState = userReducer(state, action);
      expect(newState.user).toEqual(fakeUser);
      expect(newState.loading).toBe(false);
    });

    test('should handle rejected', () => {
      // При ошибке логина: сохраняем сообщение об ошибке
      const action = { type: loginUser.rejected.type, payload: 'Login error' };
      const newState = userReducer(state, action);
      expect(newState.error).toBe('Login error');
      expect(newState.loading).toBe(false);
    });
  });

  describe('logoutUser thunk', () => {
    test('should handle pending', () => {
      // При начале логаута: loading = true, error = null
      const action = { type: logoutUser.pending.type };
      const newState = userReducer(state, action);
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('should clear user on fulfilled', () => {
      // При успешном логауте: очищаем данные пользователя
      const prevState = { ...state, user: { name: 'A', email: 'a@example.com' } };
      const action = { type: logoutUser.fulfilled.type };
      const newState = userReducer(prevState, action);
      expect(newState.user).toBeNull();
      expect(newState.loading).toBe(false);
    });

    test('should set error on rejected', () => {
      // При ошибке логаута: сохраняем сообщение об ошибке
      const action = { type: logoutUser.rejected.type, payload: 'Logout error' };
      const newState = userReducer(state, action);
      expect(newState.error).toBe('Logout error');
      expect(newState.loading).toBe(false);
    });
  });

  describe('fetchUser thunk', () => {
    test('should handle pending', () => {
      // При начале запроса данных пользователя
      const action = { type: fetchUser.pending.type };
      const newState = userReducer(state, action);
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('should update user on fulfilled', () => {
      // При успешном получении: сохраняем данные пользователя
      const fakeUser = { name: 'Fetched', email: 'fetched@example.com' };
      const action = { type: fetchUser.fulfilled.type, payload: fakeUser };
      const newState = userReducer(state, action);
      expect(newState.user).toEqual(fakeUser);
      expect(newState.loading).toBe(false);
    });

    test('should set error on rejected', () => {
      // При ошибке получения данных: сохраняем сообщение об ошибке
      const action = { type: fetchUser.rejected.type, payload: 'Fetch error' };
      const newState = userReducer(state, action);
      expect(newState.error).toBe('Fetch error');
      expect(newState.loading).toBe(false);
    });
  });

  describe('updateUser thunk', () => {
    test('should handle pending', () => {
      // При начале обновления данных
      const action = { type: updateUser.pending.type };
      const newState = userReducer(state, action);
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('should update user on fulfilled', () => {
      // При успешном обновлении: сохраняем новые данные пользователя
      const updatedUser = { name: 'Updated', email: 'updated@example.com' };
      const action = { type: updateUser.fulfilled.type, payload: updatedUser };
      const newState = userReducer(state, action);
      expect(newState.user).toEqual(updatedUser);
      expect(newState.loading).toBe(false);
    });

    test('should set error on rejected', () => {
      // При ошибке обновления: сохраняем сообщение об ошибке
      const action = { type: updateUser.rejected.type, payload: 'Update error' };
      const newState = userReducer(state, action);
      expect(newState.error).toBe('Update error');
      expect(newState.loading).toBe(false);
    });
  });

  describe('requestPasswordReset thunk', () => {
    test('should set loading true on pending', () => {
      // При начале запроса сброса пароля
      const action = { type: requestPasswordReset.pending.type };
      const newState = userReducer(state, action);
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('should set passwordResetRequested true on fulfilled', () => {
      // При успешном запросе: устанавливаем флаг passwordResetRequested
      const action = { type: requestPasswordReset.fulfilled.type };
      const newState = userReducer(state, action);
      expect(newState.passwordResetRequested).toBe(true);
      expect(newState.loading).toBe(false);
    });

    test('should set error on rejected', () => {
      // При ошибке запроса сброса пароля: сохраняем сообщение об ошибке
      const action = { type: requestPasswordReset.rejected.type, payload: 'Password reset request error' };
      const newState = userReducer(state, action);
      expect(newState.error).toBe('Password reset request error');
      expect(newState.loading).toBe(false);
    });
  });

  describe('resetPassword thunk', () => {
    test('should set loading true on pending', () => {
      // При начале сброса пароля: loading = true
      const action = { type: resetPassword.pending.type };
      const newState = userReducer(state, action);
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('should reset passwordResetRequested false on fulfilled', () => {
      // При успешном сбросе пароля: сбрасываем флаг passwordResetRequested
      const prevState = { ...state, passwordResetRequested: true };
      const action = { type: resetPassword.fulfilled.type };
      const newState = userReducer(prevState, action);
      expect(newState.passwordResetRequested).toBe(false);
      expect(newState.loading).toBe(false);
    });

    test('should set error on rejected', () => {
      // При ошибке сброса пароля: сохраняем сообщение об ошибке
      const action = { type: resetPassword.rejected.type, payload: 'Reset password error' };
      const newState = userReducer(state, action);
      expect(newState.error).toBe('Reset password error');
      expect(newState.loading).toBe(false);
    });
  });
});
