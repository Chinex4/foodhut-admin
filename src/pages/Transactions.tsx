import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/hooks/storeHooks";
import { fetchTransactions } from "@/store/slices/transactionsSlice";
import dayjs from "dayjs";

const TransactionsPage = () => {
  const dispatch = useAppDispatch();
  const { data } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => dispatch(fetchTransactions()).unwrap(),
  });
  const transactions = Array.isArray(data) ? data : [];

  return (
    <div>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Transactions
      </Typography>
      <Card elevation={0} sx={{ background: "rgba(17,24,39,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} hover>
                  <TableCell>{tx.id}</TableCell>
                  <TableCell>{tx.order_id}</TableCell>
                  <TableCell>
                    <Chip label={tx.status} size="small" />
                  </TableCell>
                  <TableCell>₦{Number(tx.amount ?? 0).toLocaleString()}</TableCell>
                  <TableCell>{tx.payment_method ?? "—"}</TableCell>
                  <TableCell>{tx.created_at ? dayjs(tx.created_at).format("YYYY-MM-DD HH:mm") : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
