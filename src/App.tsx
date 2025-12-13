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
import { useAppSelector } from "./hooks/storeHooks";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { tokens } = useAppSelector((s) => s.auth);
  if (!tokens) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const RedirectIfAuthed = ({ children }: { children: JSX.Element }) => {
  const { tokens } = useAppSelector((s) => s.auth);
  if (tokens) {
    return <Navigate to="/" replace />;
  }
  return children;
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
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/kitchens" element={<KitchensPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/ads" element={<AdsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
