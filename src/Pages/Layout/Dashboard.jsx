import React from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";
import OneSignal from "react-onesignal";
// Components
import { dashboardRoutes } from "../../routes";
import HorizontalNav from "../../Components/Dashbaord/Navbar";
import Sidebar from "../../Components/Dashbaord/sidebar";
import {
  getProfileImage,
  getUserFromId,
  getUserIdFromToken,
  url,
} from "../../service/api";
import jsCookie from "js-cookie";

const Dashboard = () => {
  let [comp, setComponent] = React.useState(null);
  let { component } = useParams();
  component = "/" + component;
  let [access_token, setAccessToken] = React.useState(null);
  let [user, setUser] = React.useState(null);
  let [profileImg, setProfileImg] = React.useState(null);

  React.useEffect(() => {
    OneSignal.init({
      appId: "91130518-13a8-4213-bf6c-36b55314829a",
    });
  }, []);

  // Set Access_Token And User to the Session Storage

  React.useEffect(() => {
    const tokenFunc = async () => {
      let access_token1 = null;
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");
      if (term !== null || term !== undefined) {
        await localStorage.removeItem("access_token");
        await localStorage.removeItem("access_token");
        access_token1 = term;
        await setAccessToken(term);
        await localStorage.setItem("access_token", term);

        let user_id = await getUserIdFromToken({ access_token: access_token1 });

        if (user_id) {
          console.log(user_id.data);
          let user = await getUserFromId(
            { id: user_id.data.user.user },
            access_token1
          );
          await setUser(user.data.user.user);
          if (user.profileImg) {
            let image = await getProfileImage(
              { id: user_id.data.user.user },
              access_token1
            );
            setProfileImg(image.data.Image);
            await localStorage.setItem(
              "profileImg",
              JSON.stringify(image.data.Image)
            );
          }
          if (user.data.user.access_valid === false)
            window.location.redirect = "/login";
          await localStorage.setItem("user", JSON.stringify(user.data.user));
          window.history.pushState({ url: "/user" }, "", "/user");
        } else {
          window.location.href = "/login";
        }
      } else {
        let access_token = localStorage.get("access_token");
        await setAccessToken(access_token);
        let user = localStorage.get("user");
        await setUser(user);
      }
    };

    const func = async () => {
      await tokenFunc();
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");
      if (term) {
        window.history.pushState({ path: "/user" }, "", "/user");
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
