import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppHeader } from '@components';
import { ConstructorPage } from '../../pages/constructor-page';
import { Feed } from '../../pages/feed';
import { Login } from '../../pages/login';
import { Register } from '../../pages/register';
import { ForgotPassword } from '../../pages/forgot-password';
import { ResetPassword } from '../../pages//reset-password';
import { Profile } from '../../pages/profile';
import { ProfileOrders } from '../../pages/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404';
import { OrderInfo } from '../../components/order-info';
import { IngredientDetails } from '../../components/ingredient-details';
import { ProtectedRoute } from '../../components/protected-route';
import { Modal } from '../../components/modal';

const App = () => (
  <BrowserRouter>
    <AppHeader />
    <Routes>
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/feed' element={<Feed />} />
      <Route
        path='/feed/:number'
        element={
          <Modal title='Детали заказа' onClose={() => window.history.back()}>
            <OrderInfo />
          </Modal>
        }
      />

      <Route
        path='/ingredients/:id'
        element={
          <Modal
            title='Детали ингредиента'
            onClose={() => window.history.back()}
          >
            <IngredientDetails />
          </Modal>
        }
      />
      <Route
        path='/login'
        element={
          <ProtectedRoute>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path='/register'
        element={
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route
        path='/forgot-password'
        element={
          <ProtectedRoute>
            <ForgotPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path='/reset-password'
        element={
          <ProtectedRoute>
            <ResetPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile/orders'
        element={
          <ProtectedRoute>
            <ProfileOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile/orders/:number'
        element={
          <ProtectedRoute>
            <Modal title='Детали заказа' onClose={() => window.history.back()}>
              <OrderInfo />
            </Modal>
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<NotFound404 />} />
    </Routes>
  </BrowserRouter>
);

export default App;
