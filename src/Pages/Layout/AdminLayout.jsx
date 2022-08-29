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

  React.useEffect(() => {
    const tokenFunc = async () => {
      let access_token1 = null;
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");
      if (term !== null && term !== undefined && term !== "null") {
        await localStorage.removeItem("access_token");
        access_token1 = term;
        await setAccessToken(term);
        await localStorage.setItem("access_token", term);

        let user_id = await getUserIdFromToken({ access_token: access_token1 });

        if (user_id) {
          let user = await getUserFromId(
            { id: user_id.data.user.user },
            access_token1
          );
          await setUser(user.data.user.user);
          if (
            user.data.user.access_valid === false ||
            (user.data.user.user_type !== "Admin" && user.data.user.user_type !== "Admin_User")
          )
            window.location.href = "/login";
          await localStorage.setItem("user", JSON.stringify(user.data.user));
          window.history.pushState({ url: "/admin" }, "", "/admin");
        } else {
          window.location.href = "/login";
        }
      } else {
        let access_token = await localStorage.getItem("access_token");
        let user = JSON.parse(await localStorage.getItem("user"));
        if (access_token === "null" || access_token === null) access_token = user.access_token;
        await localStorage.setItem("access_token", access_token);
        if (
          user.access_valid === false ||
          (user.user_type !== "Admin" && user.user_type !== "Admin_User")
        )
          window.location.href = "/login";
        await setAccessToken(access_token);
        await setUser(user);
      }
      let user = JSON.parse(await localStorage.getItem("user"));
      let token = await localStorage.getItem("access_token");
      if (!user || !token) {
        window.location.href = "/login";
      }
    };

    const func = async () => {
      await tokenFunc();
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");
      if (term) {
        window.history.pushState({ path: "/admin" }, "", "/admin");
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
