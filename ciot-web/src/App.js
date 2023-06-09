import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "@bcgov/bootstrap-theme/dist/css/bootstrap-theme.min.css";

import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import "./App.css";
import LoadingBar from "react-redux-loading-bar";
import { Spinner } from "react-bootstrap";
import Footer from "./components/Footer/Footer";
import Header from "./components/Headers/Header/Header";

import { AuthStateContext } from "./contexts/authStateContext";
import Roles from "./constants/roles";

import AppRoute from "./utils/AppRoute/AppRoute";
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";

import AddOpportunity from "./components/Page/AddOpportunity/AddOpportunity";
import Datasources from "./components/Page/Datasources/Datasources";
import EDODashboard from "./components/Page/EDODashboard/EDODashboard";
import SiteInfomation from "./components/Page/SiteInformation/SiteInformation";
import PropertyDetails1 from "./components/Page/PropertyDetails1/PropertyDetails1";
import PropertyDetails2 from "./components/Page/PropertyDetails2/PropertyDetails2";
import ReviewOpportunity from "./components/Page/ReviewOpportunity/ReviewOpportunity";
import ReviewSubmitted from "./components/Page/ReviewSubmitted/ReviewSubmitted";
import OpportunityPage from "./components/Page/OpportunityPage/OpportunityPage";
import OpportunityDeletePage from "./components/Page/OpportunityDeletePage/OpportunityDeletePage";

import OpportunityApproveListPage from "./components/Page/OpportunityApproveListPage/OpportunityApproveListPage";
import OpportunityApprovePage from "./components/Page/OpportunityApprovePage/OpportunityApprovePage";

import InvestorMainView from "./components/Page/InvestorMainView/InvestorMainView";
import UserManagementDashboard from "./components/Page/UserManagement/UserManagementDashboard";

import Login from "./components/Page/account/Login";
import Logout from "./components/Page/account/Logout";
import AccessDenied from "./components/Page/Errors/401/AccessDenied";

import HomePage from "./components/Page/HomePage/HomePage";

import { useKeycloakWrapper } from "./hooks/useKeycloakWrapper";
import DisclaimerInvestorCIOT from "./components/DisclaimerInvestorCIOT/DisclaimerInvestorCIOT";
import DisclaimerContributorCIOT from "./components/DisclaimerContributorCIOT/DisclaimerContributorCIOT";

function App() {
  const keycloak = useKeycloakWrapper();
  const [isLoginWithIdir] = useState(keycloak.idp === "idir");

  return (
    <AuthStateContext.Consumer>
      {(context) => {
        if (!context.ready) {
          return (
            <PublicLayout>
              <main className="center-spinner">
                <Spinner animation="border" />
              </main>
            </PublicLayout>
          );
        }
        return (
          <div className="app-container">
            <LoadingBar
              style={{
                zIndex: 9999,
                backgroundColor: "#fcba19",
                height: "3px",
              }}
            />
            <Router>
              <Header />
              <Switch>
                <Redirect exact from="/" to="/investmentopportunities/home" />
                <Redirect
                  exact
                  from="/investmentopportunities"
                  to="/investmentopportunities/home"
                />
                <AppRoute
                  path="/investmentopportunities/home"
                  title="Community Investment Opportunities Tool"
                  component={HomePage}
                />
                <AppRoute title="Login" path="/login" component={Login} />
                <AppRoute title="Logout" path="/logout" component={Logout} />
                <AppRoute
                  title="Access Denied - Login to continue"
                  path="/forbidden"
                  component={AccessDenied}
                />
                <AppRoute
                  protected
                  title="Community Investment Opportunities Tool - Dashboard"
                  path="/investmentopportunities/dashboard"
                  layout={AuthLayout}
                  component={EDODashboard}
                />
                <AppRoute
                  protected
                  exact
                  path="/investmentopportunities/add"
                  title="Community Investment Opportunities Tool - Add Property"
                  layout={AuthLayout}
                  component={AddOpportunity}
                />
                <AppRoute
                  protected
                  exact
                  path="/investmentopportunities/site-info"
                  title="Community Investment Opportunities Tool - Site Information"
                  layout={AuthLayout}
                  component={SiteInfomation}
                />
                <AppRoute
                  protected
                  exact
                  path="/investmentopportunities/property-details"
                  title="Community Investment Opportunities Tool - Add Property Details"
                  layout={AuthLayout}
                  component={PropertyDetails1}
                />
                <AppRoute
                  protected
                  exact
                  path="/investmentopportunities/additional-details"
                  title="Community Investment Opportunities Tool - Add Additional Details"
                  layout={AuthLayout}
                  component={PropertyDetails2}
                />
                <AppRoute
                  protected
                  exact
                  path="/investmentopportunities/review"
                  title="Community Investment Opportunities Tool - Opportunity Review & Submit"
                  layout={AuthLayout}
                  component={ReviewOpportunity}
                />
                <AppRoute
                  protected
                  exact
                  path="/investmentopportunities/success"
                  title="Community Investment Opportunities Tool - Opportunity Submitted!"
                  layout={AuthLayout}
                  component={ReviewSubmitted}
                />
                <AppRoute
                  protected
                  exact
                  path="/manage/investmentopportunities"
                  title="Community Investment Opportunities Tool - Opportunity Management"
                  roles={[
                    Roles.SUPER_ADMINISTRATOR,
                    Roles.SYSTEM_ADMINISTRATOR,
                  ]}
                  layout={AuthLayout}
                  component={OpportunityApproveListPage}
                />
                <AppRoute
                  path="/investmentopportunities/view/*:path"
                  title="Community Investment Opportunities Tool - Opportunity Listing"
                  component={OpportunityPage}
                />
                <AppRoute
                  protected
                  path="/manage/investmentopportunities/view/*:path"
                  title="Community Investment Opportunities Tool - Opportunity Approval"
                  roles={[
                    Roles.SUPER_ADMINISTRATOR,
                    Roles.SYSTEM_ADMINISTRATOR,
                  ]}
                  layout={AuthLayout}
                  component={OpportunityApprovePage}
                />
                <AppRoute
                  path="/investmentopportunities/search"
                  title="Community Investment Opportunities Tool - Search Investment Opportunities"
                  component={InvestorMainView}
                />
                <AppRoute
                  protected
                  path="/delete/investmentopportunities/*:path"
                  title="Community Investment Opportunities Tool - Delete an Opportunity"
                  layout={AuthLayout}
                  component={OpportunityDeletePage}
                />
                <AppRoute
                  protected
                  exact
                  path="/manage/users"
                  title="Community Information Tool - User Management"
                  roles={[
                    Roles.SUPER_ADMINISTRATOR,
                    Roles.SYSTEM_ADMINISTRATOR,
                  ]}
                  layout={AuthLayout}
                  component={UserManagementDashboard}
                />
                <AppRoute
                  path="/datasources"
                  title="Community Information Tool - Data Sources"
                  component={Datasources}
                />
                <AppRoute
                  exact
                  path="/investmentopportunities/disclaimer-investor"
                  title="Community Information Tool - Disclaimer"
                  component={DisclaimerInvestorCIOT}
                />
                <AppRoute
                  exact
                  path="/investmentopportunities/disclaimer-contributor"
                  title="Community Information Tool - Disclaimer"
                  component={DisclaimerContributorCIOT}
                />
              </Switch>
              <div className="footer">
                <Footer />
              </div>
            </Router>
          </div>
        );
      }}
    </AuthStateContext.Consumer>
  );
}

export default App;
