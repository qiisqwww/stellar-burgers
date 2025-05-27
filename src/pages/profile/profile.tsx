// src/pages/profile/profile.tsx
import React, {
  FC,
  useState,
  useEffect,
  FormEvent,
  SyntheticEvent
} from 'react';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchUser, updateUser } from '../../services/slices/user-slice';
import { ProfileUI } from '../../components/ui/pages/profile/profile';

interface FormValue {
  name: string;
  email: string;
  password: string;
}

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  const [formValue, setFormValue] = useState<FormValue>({
    name: '',
    email: '',
    password: ''
  });
  const [errorText, setErrorText] = useState<string>('');

  // Initialize form when user changes
  useEffect(() => {
    if (user) {
      setFormValue({ name: user.name, email: user.email, password: '' });
    }
  }, [user]);

  // Sync error
  useEffect(() => {
    if (error) {
      setErrorText(error);
    }
  }, [error]);

  const isFormChanged =
    user?.name !== formValue.name ||
    user?.email !== formValue.email ||
    formValue.password.length > 0;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');
    const { name, email, password } = formValue;
    // Dispatch update
    dispatch(updateUser({ name, email, password: password || undefined })).then(
      (action) => {
        if ('error' in action) {
          // rejected
        } else {
          // clear password field
          setFormValue((prev) => ({ ...prev, password: '' }));
        }
      }
    );
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({ name: user.name, email: user.email, password: '' });
      setErrorText('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  if (loading && !user) {
    return (
      <ProfileUI
        isFormChanged={false}
        formValue={formValue}
        handleCancel={() => {}}
        handleSubmit={() => {}}
        handleInputChange={() => {}}
      />
    );
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
