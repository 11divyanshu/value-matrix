import React from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";

// Components
import { adminDashboardRoutes } from "../routes";
import Navbar from "../Components/AdminDashboard/Navbar";
import Sidebar from "../Components/AdminDashboard/Sidebar";
import { getUserFromId, getUserIdFromToken } from "../service/api";
import jsCookie from "js-cookie";

const AdminDashboard = () => {
  let [comp, setComponent] = React.useState(null);
  let { component } = useParams();
  component = "/" + component;
  let [user, setUser] = React.useState(null);
  let access_token = null;

  // Retrieve And Saves Access Token and User to Session
  access_token = ReactSession.get("access_token");
  let access_token2 = jsCookie.get("access_token");
  if (!access_token) {
    access_token = access_token2;
    console.log(access_token);
    ReactSession.set("access_token", access_token);
  }
  React.useEffect(() => {
    const getData = async (token) => {
      let user_id = await getUserIdFromToken({ access_token: token });
      if (user_id) {
        let user = await getUserFromId({ id: user_id.data.user.user }, token);
        setUser(user.data.user);
        if (
          user.data.user.isAdmin === false ||
          user.data.user.access_valid === false
        )
          window.location.href = "/admin/login";
        ReactSession.set("user", user.data.user);
      } else {
        window.location.href = "/login";
      }
    };
    getData(access_token);
  }, [access_token]);

  React.useEffect(() => {
    if (!component) {
      setComponent(
        adminDashboardRoutes.filter((route) => route.path === "/admin")[0]
          .component
      );
    } else {
      let c = adminDashboardRoutes.filter((route) => route.path === component);
      if (c[0]) setComponent(c[0].component);
      else
        setComponent(
          adminDashboardRoutes.filter((route) => route.path === "/admin")[0]
            .component
        );
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
