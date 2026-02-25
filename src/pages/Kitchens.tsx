import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, ShieldOff, Lock, Unlock, Edit } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import {
  blockKitchen,
  fetchKitchenById,
  fetchKitchens as fetchKitchensThunk,
  verifyKitchen,
} from "@/store/slices/kitchensSlice";
import { useState } from "react";
import { fetchMeals } from "@/store/slices/mealsSlice";

const KitchensPage = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  useQuery({
    queryKey: ["kitchens", page],
    queryFn: () => dispatch(fetchKitchensThunk(page)).unwrap(),
  });
  const mealsQuery = useQuery({
    queryKey: ["vendor-menu"],
    queryFn: () => dispatch(fetchMeals(1)).unwrap(),
  });
  const kitchenState = useAppSelector((s) => s.kitchens);
  const selected = kitchenState.selected;
  const kitchens = kitchenState.items;
  const allMeals = Array.isArray(mealsQuery.data?.items) ? mealsQuery.data.items : [];
  const vendorMeals = selected ? allMeals.filter((meal) => meal.kitchen_id === selected.id) : [];
  const meta = kitchenState.meta ?? { page: 1, per_page: 20, total: kitchens.length };
  const totalPages = meta.per_page ? Math.ceil((meta.total ?? kitchens.length) / meta.per_page) : 1;

  const handleBlockToggle = (id: string, blocked: boolean) => {
    dispatch(blockKitchen({ id, blocked: !blocked }));
  };

  const handleVerifyToggle = (id: string, verified: boolean) => {
    dispatch(verifyKitchen({ id, verified: !verified }));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>
        Vendors
      </Typography>
      <Card elevation={0} sx={{ background: "rgba(17,24,39,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <CardContent>
          <Box sx={{ overflowX: "auto", width: "100%", "& table": { minWidth: 1000 } }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cover</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Delivery</TableCell>
                  <TableCell>Prep</TableCell>
                  <TableCell>Likes</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Verification</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kitchens.map((kitchen) => (
                <TableRow
                  key={kitchen.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    dispatch(fetchKitchenById(kitchen.id));
                    setDetailsOpen(true);
                  }}
                >
                  <TableCell>
                    {kitchen.cover_image?.url ? (
                      <img
                          src={kitchen.cover_image.url}
                          alt={kitchen.name}
                          style={{ width: 44, height: 32, objectFit: "cover", borderRadius: 6 }}
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{kitchen.name}</TableCell>
                    <TableCell>
                      {typeof kitchen.city === "object" && kitchen.city !== null
                        ? kitchen.city.name ?? "—"
                        : kitchen.city ?? "—"}
                    </TableCell>
                    <TableCell>{kitchen.type ?? "—"}</TableCell>
                    <TableCell>{kitchen.phone_number ?? "—"}</TableCell>
                    <TableCell>{kitchen.delivery_time ?? "—"}</TableCell>
                    <TableCell>{kitchen.preparation_time ?? "—"}</TableCell>
                    <TableCell>{kitchen.likes ?? 0}</TableCell>
                    <TableCell>{kitchen.rating ?? "—"}</TableCell>
                    <TableCell>
                      <Chip
                        label={kitchen.is_blocked ? "Blocked" : "Active"}
                        color={kitchen.is_blocked ? "error" : "success"}
                        size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={kitchen.is_verified ? "Verified" : "Pending"}
                      color={kitchen.is_verified ? "primary" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(fetchKitchenById(kitchen.id));
                          setDetailsOpen(true);
                        }}
                      >
                        <Edit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={kitchen.is_blocked ? "Unblock" : "Block"}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBlockToggle(kitchen.id, kitchen.is_blocked);
                        }}
                      >
                        {kitchen.is_blocked ? <Unlock size={18} /> : <Lock size={18} />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={kitchen.is_verified ? "Unverify" : "Verify"}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerifyToggle(kitchen.id, kitchen.is_verified);
                        }}
                      >
                        {kitchen.is_verified ? <ShieldOff size={18} /> : <ShieldCheck size={18} />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </Box>
          {totalPages > 1 && (
            <Stack direction="row" justifyContent="center" mt={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
              />
            </Stack>
          )}
        </CardContent>
      </Card>
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{selected?.name ?? "Kitchen details"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {selected?.cover_image?.url && (
              <img
                src={selected.cover_image.url}
                alt={selected.name}
                style={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 12 }}
              />
            )}
            <Divider />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Typography variant="body2"><strong>Address:</strong> {selected?.address ?? "—"}</Typography>
              <Typography variant="body2">
                <strong>City:</strong>{" "}
                {typeof selected?.city === "object" ? selected?.city?.name ?? "—" : selected?.city ?? "—"}
              </Typography>
              <Typography variant="body2"><strong>Type:</strong> {selected?.type ?? "—"}</Typography>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Typography variant="body2"><strong>Phone:</strong> {selected?.phone_number ?? "—"}</Typography>
              <Typography variant="body2"><strong>Opening:</strong> {selected?.opening_time ?? "—"}</Typography>
              <Typography variant="body2"><strong>Closing:</strong> {selected?.closing_time ?? "—"}</Typography>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Typography variant="body2"><strong>Delivery:</strong> {selected?.delivery_time ?? "—"}</Typography>
              <Typography variant="body2"><strong>Prep:</strong> {selected?.preparation_time ?? "—"}</Typography>
              <Typography variant="body2"><strong>Rating:</strong> {selected?.rating ?? "—"}</Typography>
            </Stack>
            <Typography variant="body2"><strong>Description:</strong> {selected?.description ?? "—"}</Typography>
            <Divider />
            <Typography variant="subtitle2">Vendor menu</Typography>
            {vendorMeals.length ? (
              <Stack spacing={1}>
                {vendorMeals.map((meal) => (
                  <Stack key={meal.id} direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">{meal.name}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2">₦{Number(meal.price ?? 0).toLocaleString()}</Typography>
                      <Chip
                        size="small"
                        label={meal.is_available ? "Available" : "Unavailable"}
                        color={meal.is_available ? "success" : "default"}
                      />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No meals found for this vendor.
              </Typography>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default KitchensPage;
