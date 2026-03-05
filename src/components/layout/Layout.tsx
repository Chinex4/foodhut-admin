import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { PortalType } from "@/types/auth";

const drawerWidth = 260;

type LayoutProps = {
  mode?: PortalType;
};

const Layout = ({ mode = "admin" }: LayoutProps) => {
  const topbarTitle = mode === "logistics" ? "Foodhut Logistics" : "Foodhut Console";

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(circle at 15% 20%, rgba(255,168,0,0.08), transparent 22%), radial-gradient(circle at 80% 10%, rgba(255,225,167,0.08), transparent 28%)",
      }}
    >
      <Topbar title={topbarTitle} />
      <Sidebar width={drawerWidth} mode={mode} />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
