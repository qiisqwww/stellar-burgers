import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { fetchOrderByNumber } from '../../services/slices/orders-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const dispatch = useDispatch();

  /** TODO: взять переменные orderData и ingredients из стора */
  const orderData = useSelector(
    (state: RootState) => state.orders.currentOrder
  );

  const ingredients: TIngredient[] = useSelector(
    (state: RootState) => state.ingredients.items
  );

  useEffect(() => {
    if (!orderData || orderData.number.toString() !== number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderData]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
