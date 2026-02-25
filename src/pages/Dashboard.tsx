import { Grid, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Coins, Utensils, Sandwich, ReceiptText } from "lucide-react";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import StatCard from "@/components/common/StatCard";
import { getDashboardAnalytics, getDashboardInfo } from "@/api/dashboard";

const DashboardPage = () => {
  const infoQuery = useQuery({
    queryKey: ["dashboard-info"],
    queryFn: getDashboardInfo,
    placeholderData: { kitchens: 0, meals: 0, orders: 0, transactions: 0 },
  });

  const analyticsQuery = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: getDashboardAnalytics,
    placeholderData: [
      { name: "Mon", value: 10 },
      { name: "Tue", value: 12 },
      { name: "Wed", value: 18 },
      { name: "Thu", value: 16 },
      { name: "Fri", value: 20 },
    ],
  });

  const info = infoQuery.data ?? {
    kitchens: 0,
    meals: 0,
    orders: 0,
    transactions: 0,
  };
  const totalKitchens = info.kitchens ?? 0;
  const totalMeals = info.meals ?? 0;
  const totalOrders = info.orders ?? 0;
  const totalTransactions = info.transactions ?? 0;

  return (
    <Stack spacing={3} sx={{ background: "rgba(15,23,42,0.6)", p: 2, borderRadius: 2, border: "1px solid rgba(255,255,255,0.04)" }}>
      <Typography variant="h5" fontWeight={700}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Kitchens"
            value={totalKitchens}
            icon={<Utensils />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard label="Meals" value={totalMeals} icon={<Sandwich />} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard label="Orders" value={totalOrders} icon={<ReceiptText />} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Transactions"
            value={totalTransactions}
            icon={<Coins />}
          />
        </Grid>
      </Grid>
      <AnalyticsChart title="Weekly Performance" data={analyticsQuery.data ?? []} />
    </Stack>
  );
};

export default DashboardPage;
