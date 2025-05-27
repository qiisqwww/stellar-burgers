import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { Preloader } from '../../components/ui/preloader/preloader';
import { fetchOrders } from '../../services/slices/orders-slice';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

const orders = [
  {
    _id: '682441b7c2f30c001cb2381c',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa093d'
    ],
    status: 'done',
    name: 'Флюоресцентный люминесцентный бургер',
    createdAt: '2025-05-14T07:09:43.255Z',
    updatedAt: '2025-05-14T07:09:44.024Z',
    number: 77067
  }
];
export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading || orders.length === 0) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-default'>
        Ошибка загрузки заказов: {error}
      </p>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
