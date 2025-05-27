// src/pages/login/login.tsx
import React, { FC, useState, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { loginUser } from '../../services/slices/user-slice';
import { useNavigate } from 'react-router-dom';
import { LoginUI } from '../../components/ui/pages/login/login';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState<string>('');

  useEffect(() => {
    if (error) {
      setErrorText(error);
    }
  }, [error]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorText('');
    dispatch(loginUser({ email, password }))
      .then((action) => {
        if ('payload' in action) {
          navigate('/', { replace: true });
        }
      })
      .catch(() => {
        // errorText уже задан через состояние error
      });
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
