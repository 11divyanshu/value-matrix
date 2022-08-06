import React from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";
import OneSignal from "react-onesignal";
// Components
import { dashboardRoutes } from "../routes";
import HorizontalNav from "../Components/Dashbaord/Navbar";
import Sidebar from "../Components/Dashbaord/sidebar";
import { getUserFromId, getUserIdFromToken } from "../service/api";
import jsCookie from "js-cookie";

const Dashboard = () => {
  let [comp, setComponent] = React.useState(null);
  let { component } = useParams();
  component = "/" + component;

  let [user, setUser] = React.useState(null);
  
  
  React.useEffect(() => {
    OneSignal.init({
      appId: "91130518-13a8-4213-bf6c-36b55314829a"
    });
  }, []);

  let access_token = jsCookie.get("access_token");
  // Set Access_Token And User to the Session Storage
  React.useEffect(() => {
    ReactSession.set("access_token", access_token);
    if(access_token === null)
      window.location.href="/login";
    console.log(access_token);
    const getData = async (token) => {
      let user_id = await getUserIdFromToken({ access_token: token });
      if (user_id) {
        let user = await getUserFromId({ id: user_id.data.user.user }, token);
        setUser(user.data.user);
        if (user.data.user.access_valid === false)
          window.location.redirect = "/login";
        ReactSession.set("user", user.data.user);
      } else {
        window.location.href = "/login";
      }
    };

    getData(access_token);
  }, [access_token]);

  // Get Component To Render from the URL Parameter
  React.useEffect(() => {
    if (component === null) {
      let c = dashboardRoutes.filter((route) => route.path === "/");
      setComponent(c[0].component);
    } else {
      let c = dashboardRoutes.filter((route) => route.path === component);
      if (c[0]) setComponent(c[0].component);
      else
        setComponent(
          dashboardRoutes.filter((route) => route.path === "/")[0].component
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
