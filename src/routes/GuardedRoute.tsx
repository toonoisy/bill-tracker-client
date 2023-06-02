import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface GuardedRouteProps {
  isRouteAccessible: boolean;
  redirectRoute: string;
}

const GuardedRoute = ({
  isRouteAccessible = false,
  redirectRoute = '/',
}: GuardedRouteProps) =>
  isRouteAccessible ? (
    <Outlet />
  ) : (
    <Navigate
      to={redirectRoute}
      replace
    />
  );

export default GuardedRoute;
