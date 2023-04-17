import { Route, Routes } from "react-router-dom";
import GuardedRoute from "./GuardedRoute";

import Home from "@/views/Home";
import About from "@/views/About";
import Stats from "@/views/Stats";
import User from "@/views/User";
import Login from "@/views/Login";
import Detail from "@/views/Detail";

const AppRoutes = ({ isAuthenticated }) => {
  return (
    <Routes>
      <Route
        element={
          <GuardedRoute
            isRouteAccessible={!isAuthenticated}
            redirectRoute="/"
          />
        }
      >
        <Route path="/login" element={<Login />} />
      </Route>
      <Route
        element={
          <GuardedRoute
            isRouteAccessible={isAuthenticated}
            redirectRoute="/login"
          />
        }
      >
        <Route path="/" element={<Home />} />
      </Route>
      <Route
        element={
          <GuardedRoute
            isRouteAccessible={isAuthenticated}
            redirectRoute="/login"
          />
        }
      >
        <Route path="/stats" element={<Stats />} />
      </Route>
      <Route
        element={
          <GuardedRoute
            isRouteAccessible={isAuthenticated}
            redirectRoute="/login"
          />
        }
      >
        <Route path="/user" element={<User />} />
      </Route>
      <Route
        element={
          <GuardedRoute
            isRouteAccessible={isAuthenticated}
            redirectRoute="/login"
          />
        }
      >
        <Route path="/detail" element={<Detail />} />
      </Route>
      <Route
        element={
          <GuardedRoute
            isRouteAccessible={isAuthenticated}
            redirectRoute="/login"
          />
        }
      >
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
