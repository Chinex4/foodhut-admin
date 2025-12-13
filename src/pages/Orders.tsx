import {
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { fetchOrders } from "@/store/slices/ordersSlice";

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.orders.selected);
  const [page, setPage] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["orders", page],
    queryFn: () => dispatch(fetchOrders(page)).unwrap(),
  });

  const orders = Array.isArray(data?.items) ? data.items : [];
  const meta = data?.meta ?? { page: 1, per_page: 20, total: orders.length };
  const totalPages = meta.per_page ? Math.ceil((meta.total ?? orders.length) / meta.per_page) : 1;

  return (
    <div>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Orders
      </Typography>
      <Card elevation={0} sx={{ background: "rgba(17,24,39,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <CardContent>
          <Box sx={{ overflowX: "auto", "& table": { minWidth: 1100 } }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Kitchen</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      dispatch({ type: "orders/select", payload: order });
                      setDetailsOpen(true);
                    }}
                  >
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.kitchen?.name ?? order.kitchen_id}</TableCell>
                    <TableCell>{order.payment_method ?? "—"}</TableCell>
                    <TableCell>
                      <Chip label={order.status} size="small" />
                    </TableCell>
                    <TableCell>₦{Number(order.total ?? 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Stack direction="column" spacing={0.5}>
                        {order.items?.map((item) => (
                          <Typography key={item.meal_id} variant="body2">
                            {item.meal?.name ?? item.meal_id} × {item.quantity}
                          </Typography>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>{order.delivery_address ?? "—"}</TableCell>
                    <TableCell>{order.created_at ? dayjs(order.created_at).format("YYYY-MM-DD HH:mm") : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          {totalPages > 1 && (
            <Stack direction="row" justifyContent="center" mt={2}>
              <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
            </Stack>
          )}
        </CardContent>
      </Card>
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Order details</DialogTitle>
        <DialogContent dividers>
          {selected ? (
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Typography variant="body2">
                  <strong>Order ID:</strong> {selected.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {selected.status}
                </Typography>
                <Typography variant="body2">
                  <strong>Payment:</strong> {selected.payment_method ?? "—"}
                </Typography>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Typography variant="body2">
                  <strong>Kitchen:</strong> {selected.kitchen?.name ?? selected.kitchen_id}
                </Typography>
                <Typography variant="body2">
                  <strong>Address:</strong> {selected.delivery_address ?? "—"}
                </Typography>
              </Stack>
              <Typography variant="body2">
                <strong>Total:</strong> ₦{Number(selected.total ?? 0).toLocaleString()}
              </Typography>
              <Divider />
              <Typography variant="subtitle2">Items</Typography>
              <Stack spacing={1}>
                {selected.items?.map((item) => (
                  <Stack key={item.meal_id} direction="row" justifyContent="space-between">
                    <Typography variant="body2">{item.meal?.name ?? item.meal_id}</Typography>
                    <Typography variant="body2">x{item.quantity}</Typography>
                    <Typography variant="body2">₦{Number(item.price ?? 0).toLocaleString()}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          ) : (
            <Typography variant="body2">No order selected</Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
