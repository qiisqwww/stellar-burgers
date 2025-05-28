import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppHeader } from '@components';

import { ConstructorPage } from '../../pages/constructor-page';
import { Feed } from '../../pages/feed';
import { Login } from '../../pages/login';
import { Register } from '../../pages/register';
import { ForgotPassword } from '../../pages/forgot-password';
import { ResetPassword } from '../../pages/reset-password';
import { Profile } from '../../pages/profile';
import { ProfileOrders } from '../../pages/profile-orders';
import { NotFound404 } from '../../pages/not-found-404';

import { OrderInfo } from '../../components/order-info';
import { IngredientDetails } from '../../components/ingredient-details';
import { Modal } from '../../components/modal';

import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { ProtectedRoute, PublicRoute } from '../protected-route/protected-route';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <Router>
      <AppHeader />
      <Routes>
        {/* Модальные маршруты */}
        <Route
          path="/feed/:number"
          element={
            <Modal title="Детали заказа" onClose={() => window.history.back()}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path="/ingredients/:id"
          element={
            <Modal title="Детали ингредиента" onClose={() => window.history.back()}>
              <IngredientDetails />
            </Modal>
          }
        />

        {/* Основные страницы */}
        <Route path="/feed" element={<Feed />} />
        <Route path="/" element={<ConstructorPage />} />

        {/* Публичные маршруты */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Защищённые маршруты */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <Modal title="Детали заказа" onClose={() => window.history.back()}>
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Router>
  );
};

export default App;
