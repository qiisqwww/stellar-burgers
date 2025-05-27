import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchUser } from '../../services/slices/user-slice';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.user);

  // При монтировании проверяем наличие токена и подтягиваем профиль
  useEffect(() => {
    const hasToken = document.cookie
      .split('; ')
      .some((row) => row.startsWith('accessToken='));
    if (hasToken && !user && !loading) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, loading]);

  const userName = user?.name || '';

  return <AppHeaderUI userName={userName} />;
};
