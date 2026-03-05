import { FC } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  Sandwich,
  Megaphone,
  ReceiptText,
  Wallet,
  Search,
  Bike,
  MapPin,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import type { PortalType } from "@/types/auth";

const adminNavItems = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, to: "/" },
  { label: "Vendors", icon: <Utensils size={18} />, to: "/vendors" },
  { label: "Meals", icon: <Sandwich size={18} />, to: "/meals" },
  { label: "Ads", icon: <Megaphone size={18} />, to: "/ads" },
  { label: "Orders", icon: <ReceiptText size={18} />, to: "/orders" },
  { label: "Riders", icon: <Bike size={18} />, to: "/riders" },
  { label: "Areas/Cities", icon: <MapPin size={18} />, to: "/areas-cities" },
  { label: "Transactions", icon: <Wallet size={18} />, to: "/transactions" },
  { label: "Search", icon: <Search size={18} />, to: "/search" },
];

const logisticsNavItems = [
  { label: "Compliance KYC", icon: <ShieldCheck size={18} />, to: "/logistics/compliance" },
  { label: "Bike Accounts", icon: <Bike size={18} />, to: "/logistics/bikes" },
  { label: "Active Orders", icon: <Truck size={18} />, to: "/logistics/orders" },
  { label: "General Wallet", icon: <Wallet size={18} />, to: "/logistics/wallet" },
];

type SidebarProps = {
  width?: number;
  mode?: PortalType;
};

const Sidebar: FC<SidebarProps> = ({ width = 260, mode = "admin" }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((s) => s.ui);
  const navItems = mode === "logistics" ? logisticsNavItems : adminNavItems;
  const title = mode === "logistics" ? "Foodhut Logistics" : "Foodhut Console";

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" color="primary">
          {title}
        </Typography>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={Link}
            to={item.to}
            selected={location.pathname === item.to}
            onClick={() => dispatch(toggleSidebar(false))}
            sx={{
              borderRadius: 2,
              mx: 1,
              "&.Mui-selected": { bgcolor: "rgba(255,168,0,0.12)", color: "#fff" },
              "&:hover": { bgcolor: "rgba(255,168,0,0.08)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { md: width }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => dispatch(toggleSidebar(false))}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width,
            background: "linear-gradient(180deg, #0b1220, #0f172a)",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width,
            borderRight: "1px solid rgba(255,255,255,0.05)",
            background: "linear-gradient(180deg, #0b1220, #0f172a)",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
