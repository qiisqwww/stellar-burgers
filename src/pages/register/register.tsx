import { FC, FormEvent, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/slices/user-slice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [errorText, setErrorText] = useState<string>('');

  useEffect(() => {
    if (error) {
      setErrorText(error);
    }
  }, [error]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorText('');
    dispatch(registerUser({ email, password, name: userName }))
      .unwrap()
      .then(() => {
        navigate('/login', { replace: true });
      })
      .catch(() => {
        // ошибка уже записана в errorText
      });
  };

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
