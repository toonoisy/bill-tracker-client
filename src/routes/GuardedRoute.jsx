import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';

const GuardedRoute = ({ isRouteAccessible = false, redirectRoute = '/' }) =>
  isRouteAccessible ? (
    <Outlet />
  ) : (
    <Navigate
      to={redirectRoute}
      replace
    />
  );

GuardedRoute.propTypes = {
  isRouteAccessible: PropTypes.bool,
  redirectRoute: PropTypes.string,
};

export default GuardedRoute;
