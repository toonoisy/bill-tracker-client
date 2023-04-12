import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import routes from "./routes";
import NavBar from "./components/NavBar";
import { ConfigProvider } from "zarm";
import zhCN from "zarm/lib/config-provider/locale/zh_CN";
const primaryColor = "#007fff";
import { useDispatch } from "react-redux";
import { getCategoryList } from "@/store/categorySlice";

function App() {
  const location = useLocation();
  const { pathname } = location;
  const navPaths = ["/", "/stats", "/user"];
  const [showNav, setShowNav] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setShowNav(navPaths.includes(pathname));
  }, [pathname]);

  useEffect(() => {
    dispatch(getCategoryList());
  }, []);

  return (
    <>
      <ConfigProvider primaryColor={primaryColor} locale={zhCN}>
        <Routes>
          {routes.map((route) => (
            <Route
              exact
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </ConfigProvider>
      <NavBar showNav={showNav} />
    </>
  );
}

export default App;
