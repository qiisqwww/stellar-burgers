import React, { FC } from 'react';

type TProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({ children }) => (
  <>{children}</>
);
