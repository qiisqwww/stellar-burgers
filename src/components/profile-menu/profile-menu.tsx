import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/user-slice';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser()).then(res => {
      if (!('error' in res)) {
        document.cookie = 'accessToken=; path=/; max-age=0';
        localStorage.removeItem('refreshToken');
        console.log('Logged out');
        navigate('/login', { replace: true });
      }
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
