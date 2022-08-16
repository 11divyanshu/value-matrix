import React from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";

// Components
import { adminDashboardRoutes } from "../../routes";
import Navbar from "../../Components/AdminDashboard/Navbar";
import Sidebar from "../../Components/AdminDashboard/Sidebar";
import { getUserFromId, getUserIdFromToken } from "../../service/api";
import jsCookie from "js-cookie";

const AdminDashboard = () => {
  // Component To Render
  let [comp, setComponent] = React.useState(null);
  let { component } = useParams();
  component = "/" + component;

  // Current User
  let [user, setUser] = React.useState(null);

  // Retrieve And Saves Access Token and User to Session
  const [access_token, setAccessToken] = React.useState(null);
  let access_token1 = ReactSession.get("access_token");
  let access_token2 = jsCookie.get("access_token");
  if (!access_token) {
    access_token1 = access_token2;
    ReactSession.set("access_token", access_token1);
  }

  React.useEffect(() => {  
    const tokenFunc = async () => {
      let access_token1 = localStorage.get("access_token");
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");
      if (access_token1 === null || access_token1 === undefined) {
        access_token1 = term;
      }
      setAccessToken(access_token1);
      await sessionStorage.setItem("access_token", access_token1);
      await localStorage.setItem("access_token", access_token1);
      let user_id = await getUserIdFromToken({ access_token: access_token1 });
      if (user_id) {
        let user = await getUserFromId(
          { id: user_id.data.user.user },
          access_token1
        );
        console.log(user)
        if (user.data.user.access_valid === false || user.data.user.isAdmin === false)
          window.location.redirect = "/login";
        sessionStorage.setItem("user", user.data.user);
      } else {
        window.location.href = "/login";
      }
    };

    const func = async () => {
      await tokenFunc();
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");
      if (term) {
        window.location.href = "/admin";
      }
    };
    func();
  }, [access_token]);
  React.useEffect(() => {
    if (!component || component === "/undefined") {
      setComponent(
        adminDashboardRoutes.filter((route) => route.path === "/")[0].component
      );
    } else {
      let c = adminDashboardRoutes.filter((route) => route.path === component);
      if (c[0]) setComponent(c[0].component);
      else {
        let c = adminDashboardRoutes.filter(
          (route) => route.path === component.split("admin/")[1]
        );
        if (c[0]) setComponent(c[0].component);
        else
          setComponent(
            adminDashboardRoutes.filter((route) => route.path === "/admin")[0]
              .component
          );
      }
    }
  }, [component]);

  return (
    <div className="max-w-screen flex h-screen">
      <div className="z-10 fixed h-screen">
        <Sidebar />
      </div>
      <div className="md:pl-16 pl-0 w-full z-1">
        <Navbar user={user} />
        <div>{comp}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
