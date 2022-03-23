import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ApiGet } from "../helper/API/ApiData";
import AuthStorage from "../helper/AuthStorage";
import Layout from "../layouts/Layout";
import ErrorPage1 from "./errors/ErrorPage1";
import ForgotPass from "./forgotpass/ForgotPass";
import Homepage from "./homepage/Homepage";
import ItineraryDetails from "./itinerary/ItineraryDetails";
import EditProfile from "./user/EditProfile";
import Profile from "./user/Profile";
import HostMyOwn from "./host/HostMyOwn";
import { changeLoginState } from "../redux/actions/loginAction";
import ViewHost from "./viewhost/ViewHost";
import MyWishListPage from "./user/MyWishlistPage";
import MyHostingPage from "./user/MyHostingPage";
import AppliedHostingPage from "./user/AppliedHostingPage";
import HostTour from "./hosttour/HostTour";
import InquirtPage from "./inquiry/InquirtPage";
import CustomerService from "./customer-service/CustomerService";
import CustorServiceDetails from "./customer-service/CustorServiceDetails";

const Index = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    if (AuthStorage.isUserAuthenticated()) {
      ApiGet("user/validate")
        .then((res) => {
          dispatch(changeLoginState(true));
          // console.log("Is Authenticated", AuthStorage.isUserAuthenticated());
        })
        .catch((error) => {
          AuthStorage.deauthenticateUser();
          history.push("/");
        });
    }
  }, []);

  return (
    <>
     
      <Switch>
        <Route
          exact
          path={[
            "/",
            "/profile",
            "/edit-profile",
            "/forgotpass",
            "/itinerary",
            "/hostmyown",
            "/viewHost",
            "/wishlist",
            "/myhosting",
            "/appliedhosting",
            "/hostTour",
            "/inquirtPage",
            "/customerService",
            "/customerServiceDetails"
          ]}
        >
          <Layout>
            <Switch>
              <RouteWrapper
                exact={true}
                path="/"
                component={Homepage}

                isPrivateRoute={false}
              />
              <RouteWrapper
                exact={true}
                path="/profile"
                component={Profile}

                isPrivateRoute={true}
              />
              <RouteWrapper
                exact={true}
                path="/edit-profile"
                component={EditProfile}

                isPrivateRoute={true}
              />
              <RouteWrapper
                exact={true}
                path="/forgotpass"
                component={ForgotPass}

                isPrivateRoute={false}
              />
              <RouteWrapper
                exact={true}
                path="/itinerary"
                component={ItineraryDetails}

                isPrivateRoute={false}
              />
              <RouteWrapper
                exact={true}
                path="/hostmyown"
                component={HostMyOwn}

                isPrivateRoute={true}
              />
              <RouteWrapper
                exact={true}
                path="/viewHost"
                component={ViewHost}

                isPrivateRoute={true}
              />
              <RouteWrapper
                exact={true}
                path="/wishlist"
                component={MyWishListPage}

                isPrivateRoute={true}
              />
              <RouteWrapper
                exact={true}
                path="/myhosting"
                component={MyHostingPage}

                isPrivateRoute={true}
              />
              <RouteWrapper
                exact={true}
                path="/appliedhosting"
                component={AppliedHostingPage}

                isPrivateRoute={true}
              />
              <RouteWrapper
                exact={true}
                path="/hostTour"
                component={HostTour}

                isPrivateRoute={true}
              />
              <RouteWrapper
                exact={true}
                path="/inquirtPage"
                component={InquirtPage}

                isPrivateRoute={true}
              />


              
              <RouteWrapper
                exact={true}
                path="/customerService"
                component={CustomerService}

                isPrivateRoute={true}
              />


              <RouteWrapper
                exact={true}
                path="/customerServiceDetails"
                component={CustorServiceDetails}

                isPrivateRoute={true}
              />
            </Switch>
          </Layout>
        </Route>
        <Route path="/error" component={ErrorPage1} />
        <Redirect from="**" to="/error" />
      </Switch>
    </>
  );
};

export default Index;

interface RouteWrapperProps {
  component: any;
  exact: boolean;
  path: string;
  isPrivateRoute: boolean;
}

function RouteWrapper({
  component: Component,
  isPrivateRoute,
  ...rest
}: RouteWrapperProps) {
  const history = useHistory();
  const isAuthenticated: boolean = isPrivateRoute
    ? AuthStorage.isUserAuthenticated()
    : true;
  return (
    <>
      {isAuthenticated ? (
        <Route {...rest} render={(props) => <Component {...props} />} />
      ) : (
        history.push("/")
      )}
    </>
  );
}
