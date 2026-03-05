import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/Dashboard";
import KitchensPage from "./pages/Kitchens";
import MealsPage from "./pages/Meals";
import AdsPage from "./pages/Ads";
import OrdersPage from "./pages/Orders";
import TransactionsPage from "./pages/Transactions";
import SearchPage from "./pages/Search";
import AuthPage from "./pages/Auth";
import RidersPage from "./pages/Riders";
import AreasCitiesPage from "./pages/AreasCities";
import LogisticsSignupPage from "./pages/LogisticsSignup";
import LogisticsAuthPage from "./pages/LogisticsAuth";
import CompliancePage from "./pages/logistics/Compliance";
import BikeAccountsPage from "./pages/logistics/BikeAccounts";
import ActiveOrdersPage from "./pages/logistics/ActiveOrders";
import WalletPage from "./pages/logistics/Wallet";
import { useAppSelector } from "./hooks/storeHooks";
import type { PortalType } from "./types/auth";

const getPortalHome = (portal: PortalType | null) => (portal === "logistics" ? "/logistics/compliance" : "/");

const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const { tokens, portal } = useAppSelector((state) => state.auth);
  if (!tokens) {
    return <Navigate to="/auth" replace />;
  }
  if (portal === "logistics") {
    return <Navigate to="/logistics/compliance" replace />;
  }
  return children;
};

const RedirectIfAuthed = ({ children }: { children: JSX.Element }) => {
  const { tokens, portal } = useAppSelector((state) => state.auth);
  if (tokens) {
    return <Navigate to={getPortalHome(portal)} replace />;
  }
  return children;
};

const RequireLogistics = ({ children }: { children: JSX.Element }) => {
  const { tokens, portal } = useAppSelector((state) => state.auth);
  if (!tokens) {
    return <Navigate to="/logistics/auth" replace />;
  }
  if (portal !== "logistics") {
    return <Navigate to="/" replace />;
  }
  return children;
};

const RouteFallback = () => {
  const { tokens, portal } = useAppSelector((state) => state.auth);
  if (tokens) {
    return <Navigate to={getPortalHome(portal)} replace />;
  }
  return <Navigate to="/auth" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <RedirectIfAuthed>
              <AuthPage />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/logistics/signup"
          element={
            <RedirectIfAuthed>
              <LogisticsSignupPage />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/logistics/auth"
          element={
            <RedirectIfAuthed>
              <LogisticsAuthPage />
            </RedirectIfAuthed>
          }
        />
        <Route
          element={
            <RequireAdmin>
              <Layout mode="admin" />
            </RequireAdmin>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/vendors" element={<KitchensPage />} />
          <Route path="/kitchens" element={<Navigate to="/vendors" replace />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/ads" element={<AdsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/riders" element={<RidersPage />} />
          <Route path="/areas-cities" element={<AreasCitiesPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
        <Route
          path="/logistics"
          element={
            <RequireLogistics>
              <Layout mode="logistics" />
            </RequireLogistics>
          }
        >
          <Route index element={<Navigate to="/logistics/compliance" replace />} />
          <Route path="compliance" element={<CompliancePage />} />
          <Route path="bikes" element={<BikeAccountsPage />} />
          <Route path="orders" element={<ActiveOrdersPage />} />
          <Route path="wallet" element={<WalletPage />} />
        </Route>
        <Route path="*" element={<RouteFallback />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
