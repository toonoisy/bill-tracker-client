import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import GuardedRoute from './GuardedRoute';

import Home from '@/views/Home';
import About from '@/views/About';
import Stats from '@/views/Stats';
import User from '@/views/User';
import Login from '@/views/Login';
import Detail from '@/views/Detail';
import UserInfo from '@/views/UserInfo';
import Account from '@/views/Account';

const routes = [
  {
    path: '/',
    component: Home,
    authRedirect: '/login',
  },
  {
    path: '/about',
    component: About,
    authRedirect: '/login',
  },
  {
    path: '/stats',
    component: Stats,
    authRedirect: '/login',
  },
  {
    path: '/user',
    component: User,
    authRedirect: '/login',
  },
  {
    path: '/login',
    component: Login,
    authRedirect: '/',
  },
  {
    path: '/detail',
    component: Detail,
    authRedirect: '/login',
  },
  {
    path: '/userinfo',
    component: UserInfo,
    authRedirect: '/login',
  },
  {
    path: '/account',
    component: Account,
    authRedirect: '/login',
  },
];

const AppRoutes = ({ isAuthenticated }) => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          element={
            <GuardedRoute
              isRouteAccessible={
                route.path === '/login' ? !isAuthenticated : isAuthenticated
              }
              redirectRoute={route.authRedirect}
            />
          }
        >
          <Route
            path={route.path}
            element={<route.component />}
          />
        </Route>
      ))}
    </Routes>
  );
};

AppRoutes.propTypes = {
  isAuthenticated: PropTypes.bool,
};

export default AppRoutes;
