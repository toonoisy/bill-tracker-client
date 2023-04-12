import Home from '@/views/Home';
import About from '@/views/About';
import Stats from '@/views/Stats';
import User from '@/views/User';
import Login from '@/views/Login';
import Detail from '@/views/Detail';

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/stats',
    component: Stats,
  },
  {
    path: '/user',
    component: User,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/detail",
    component: Detail,
  },
];

export default routes;
