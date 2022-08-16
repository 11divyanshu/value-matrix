import React from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";
import OneSignal from "react-onesignal";
// Components
import { dashboardRoutes } from "../../routes";
import HorizontalNav from "../../Components/Dashbaord/Navbar";
import Sidebar from "../../Components/Dashbaord/sidebar";
import { getUserFromId, getUserIdFromToken, url } from "../../service/api";
import jsCookie from "js-cookie";

const Dashboard = () => {
  let [comp, setComponent] = React.useState(null);
  let { component } = useParams();
  component = "/" + component;
  let [access_token, setAccessToken] = React.useState(null);
  let [user, setUser] = React.useState(null);

  React.useEffect(() => {
    OneSignal.init({
      appId: "91130518-13a8-4213-bf6c-36b55314829a",
    });
  }, []);

  // Set Access_Token And User to the Session Storage

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
      console.log(user_id);
      if (user_id) {
        let user = await getUserFromId(
          { id: user_id.data.user.user },
          access_token1
        );
        console.log(user)
        if (user.data.user.access_valid === false)
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
        window.location.href = "/user";
      }
    };
    func();
  }, [access_token]);

  // Get Component To Render from the URL Parameter
  React.useEffect(() => {
    if (component === null) {
      let c = dashboardRoutes.filter((route) => route.path === "");
      setComponent(c[0].component);
    } else {
      let c = dashboardRoutes.filter(
        (route) => route.path === component.split("/")[1]
      );
      if (c[0]) setComponent(c[0].component);
      else
        setComponent(
          dashboardRoutes.filter((route) => route.path === "")[0].component
        );
    }
  }, [component]);

  return (
    <div className="max-w-screen flex h-screen">
      <div className="z-10 fixed h-screen">
        <Sidebar user={user} />
      </div>
      <div className="md:pl-16 pl-0 w-full z-1">
        <HorizontalNav user={user} />
        <div>{comp}</div>
      </div>
    </div>
  );
};

export default Dashboard;
