import dayjs from "dayjs";
import { Box, Card, CardContent, Chip, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks/storeHooks";
import { selectLogistics } from "@/store/slices/logisticsSlice";
import { naira, orderColor, statusLabel } from "./helpers";

const ActiveOrdersPage = () => {
  const { orders, riders } = useAppSelector(selectLogistics);
  const activeOrders = orders.filter((order) => order.amount > 0 && order.status !== "delivered");
  const activeRiders = riders.filter((rider) => rider.status === "active").length;
  const pausedRiders = riders.filter((rider) => rider.status === "paused").length;

  return (
    <Stack spacing={2.5}>
      <Typography variant="h5" fontWeight={700}>
        Active Orders from Riders
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Active Orders
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {activeOrders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Active Riders
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {activeRiders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Turned Off Riders
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {pausedRiders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card elevation={0}>
        <CardContent>
          <Box sx={{ overflowX: "auto", "& table": { minWidth: 860 } }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Rider</TableCell>
                  <TableCell>Pickup</TableCell>
                  <TableCell>Dropoff</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Stack spacing={0.2}>
                        <Typography variant="body2" fontWeight={600}>
                          {order.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dayjs(order.createdAt).format("DD MMM, HH:mm")}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{order.riderName}</TableCell>
                    <TableCell>{order.pickup}</TableCell>
                    <TableCell>{order.dropoff}</TableCell>
                    <TableCell>{naira(order.amount)}</TableCell>
                    <TableCell>
                      <Chip size="small" color={orderColor(order.status)} label={statusLabel(order.status)} />
                    </TableCell>
                  </TableRow>
                ))}
                {!activeOrders.length && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary">
                        No active orders available.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ActiveOrdersPage;
