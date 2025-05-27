import React, { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orders-slice';
import { TIngredient } from '../../utils/types';

export const OrderInfo: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const {
    currentOrder: orderData,
    loading,
    error
  } = useSelector((state: RootState) => state.orders);
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );

  // Запрашиваем детали заказа по номеру
  useEffect(() => {
    if (!orderData || orderData.number.toString() !== id) {
      dispatch(fetchOrderByNumber(Number(id)));
    }
  }, [dispatch, id, orderData]);

  // Лоадер и обработка ошибок
  if (loading) {
    return <Preloader />;
  }
  if (error) {
    return (
      <p className='text text_type_main-default'>
        Ошибка загрузки заказа: {error}
      </p>
    );
  }
  if (!orderData || ingredients.length === 0) {
    return <Preloader />;
  }

  // Готовим данные для отображения
  const orderInfo = useMemo(() => {
    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<
      string,
      TIngredient & { count: number }
    >;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, itemId: string) => {
        const ingredient = ingredients.find((ing) => ing._id === itemId);
        if (!ingredient) return acc;
        if (!acc[itemId]) {
          acc[itemId] = { ...ingredient, count: 1 };
        } else {
          acc[itemId].count++;
        }
        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, ing) => sum + ing.price * ing.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  return <OrderInfoUI orderInfo={orderInfo} />;
};
