import dayjs from "dayjs";
import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks/storeHooks";
import { selectLogistics } from "@/store/slices/logisticsSlice";
import { naira } from "./helpers";

const WalletPage = () => {
  const { walletEntries, orders } = useAppSelector(selectLogistics);
  const available = walletEntries.reduce((sum, entry) => sum + (entry.type === "credit" ? entry.amount : -entry.amount), 0);
  const pending = orders.filter((order) => order.amount > 0 && order.status !== "delivered").reduce((sum, order) => sum + order.amount, 0);
  const creditsToday = walletEntries
    .filter((entry) => dayjs(entry.createdAt).isSame(dayjs(), "day") && entry.type === "credit")
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <Stack spacing={2.5}>
      <Typography variant="h5" fontWeight={700}>
        General Wallet
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Available Balance
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {naira(available)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Pending Delivery Value
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {naira(pending)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Credits Today
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {naira(creditsToday)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card elevation={0}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={1.5}>
            Wallet Activity
          </Typography>
          <Stack spacing={1}>
            {walletEntries.map((entry) => (
              <Stack
                key={entry.id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ p: 1.2, borderRadius: 2, bgcolor: "rgba(148,163,184,0.08)" }}
              >
                <Stack>
                  <Typography variant="body2">{entry.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(entry.createdAt).format("DD MMM, HH:mm")}
                  </Typography>
                </Stack>
                <Typography variant="body2" color={entry.type === "credit" ? "success.main" : "error.main"} fontWeight={700}>
                  {entry.type === "credit" ? "+" : "-"}
                  {naira(entry.amount)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default WalletPage;
