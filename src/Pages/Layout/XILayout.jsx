import React from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";

// Components
import { XIDashboardRoutes } from "../../routes";
import Navbar from "../../Components/AdminDashboard/Navbar.jsx";
import Sidebar from "../../Components/CompanyDashboard/Sidebar";
import { getUserFromId, getUserIdFromToken } from "../../service/api";
import jsCookie from "js-cookie";

const XIDashboard = () => {
  let [comp, setComponent] = React.useState(null);
  let { component } = useParams();
  component = "/" + component;
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

    let access_token2 = null;
    const tokenFunc = async () => {
      let access_token1 = jsCookie.get("access_token");
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");
      if (access_token1 === null) {
        access_token1 = term;
      }
      access_token2 = access_token1;
      setAccessToken(access_token1);
      ReactSession.set("access_token", access_token1);
    };

    const getData = async (token) => {
      let user_id = await getUserIdFromToken({ access_token: token });
      if (user_id) {
        let user = await getUserFromId({ id: user_id.data.user.user }, token);
        setUser(user.data.user);
        if (
          user.data.user.user_type !== "XI" ||
          user.data.user.access_valid === false
        )
          window.location.href = "/login";
        ReactSession.set("user", user.data.user);
      } else {
        window.location.href = "/login";
      }
    };
    
    const func = async () => {
      await tokenFunc();
      if (access_token2 === null || access_token2 === undefined)
        window.location.href = "/login";
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");
      if (term) {
        window.location.href = "/XI";
      }
      getData(access_token2);
    };
    
    func();
  }, [access_token]);

  React.useEffect(() => {
    if (!component || component === "/undefined") {
      setComponent(
        XIDashboardRoutes.filter((route) => route.path === "/")[0]
          .component
      );
    } else {
      let c = XIDashboardRoutes.filter(
        (route) => route.path === component
      );
      if (c[0]) setComponent(c[0].component);
      else {
        let c = XIDashboardRoutes.filter(
          (route) => route.path === component.split("XI/")[1]
        );
        if (c[0]) setComponent(c[0].component);
        else
          setComponent(
            XIDashboardRoutes.filter((route) => route.path === "/XI")[0]
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

export default XIDashboard;