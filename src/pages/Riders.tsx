import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
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
import { fetchRiderById, fetchRiders, reviewRiderKyc, selectRider } from "@/store/slices/ridersSlice";
import type { Rider, RiderKycStatus } from "@/types/rider";

const kycChipColor = (status: RiderKycStatus): "success" | "warning" | "error" => {
  if (status === "approved") return "success";
  if (status === "pending") return "warning";
  return "error";
};

const riderStatusColor = (status: Rider["status"]): "success" | "warning" | "error" => {
  if (status === "active") return "success";
  if (status === "offline") return "warning";
  return "error";
};

const RidersPage = () => {
  const dispatch = useAppDispatch();
  const ridersState = useAppSelector((state) => state.riders);
  const selected = ridersState.selected;
  const [detailsOpen, setDetailsOpen] = useState(false);

  useQuery({
    queryKey: ["riders"],
    queryFn: () => dispatch(fetchRiders()).unwrap(),
  });

  const riders = ridersState.items;

  const openProfile = (id: string) => {
    dispatch(fetchRiderById(id));
    setDetailsOpen(true);
  };

  const handleKyc = (id: string, status: RiderKycStatus) => {
    dispatch(reviewRiderKyc({ id, kyc_status: status }));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>
        Riders
      </Typography>
      <Card elevation={0} sx={{ background: "rgba(17,24,39,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <CardContent>
          <Box sx={{ overflowX: "auto", "& table": { minWidth: 1050 } }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Rider</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>KYC</TableCell>
                  <TableCell>Completed Orders</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riders.map((rider) => (
                  <TableRow key={rider.id} hover sx={{ cursor: "pointer" }} onClick={() => openProfile(rider.id)}>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={rider.profile_image_url} alt={rider.full_name} />
                        <Stack spacing={0.3}>
                          <Typography variant="body2" fontWeight={600}>
                            {rider.full_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {rider.id}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{rider.phone_number}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {rider.email ?? "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {rider.area}, {rider.city}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {rider.current_location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {rider.vehicle_type} ({rider.plate_number})
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={rider.status} color={riderStatusColor(rider.status)} />
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={rider.kyc_status} color={kycChipColor(rider.kyc_status)} />
                    </TableCell>
                    <TableCell>{rider.completed_orders}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(event) => {
                            event.stopPropagation();
                            openProfile(rider.id);
                          }}
                        >
                          View Profile
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleKyc(rider.id, "approved");
                          }}
                        >
                          Accept KYC
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleKyc(rider.id, "rejected");
                          }}
                        >
                          Decline KYC
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          dispatch(selectRider(null));
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Rider Profile</DialogTitle>
        <DialogContent dividers>
          {selected ? (
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar src={selected.profile_image_url} alt={selected.full_name} sx={{ width: 52, height: 52 }} />
                <Stack>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {selected.full_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selected.phone_number}
                  </Typography>
                </Stack>
              </Stack>

              <Divider />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Typography variant="body2">
                  <strong>City/Area:</strong> {selected.city}, {selected.area}
                </Typography>
                <Typography variant="body2">
                  <strong>Current Location:</strong> {selected.current_location}
                </Typography>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Typography variant="body2">
                  <strong>Vehicle:</strong> {selected.vehicle_type} ({selected.plate_number})
                </Typography>
                <Typography variant="body2">
                  <strong>Rating:</strong> {selected.rating.toFixed(1)}
                </Typography>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Typography variant="body2">
                  <strong>Status:</strong>{" "}
                  <Chip size="small" label={selected.status} color={riderStatusColor(selected.status)} sx={{ ml: 1 }} />
                </Typography>
                <Typography variant="body2">
                  <strong>KYC:</strong>{" "}
                  <Chip
                    size="small"
                    label={selected.kyc_status}
                    color={kycChipColor(selected.kyc_status)}
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Stack>
              <Typography variant="body2">
                <strong>Completed Orders:</strong> {selected.completed_orders}
              </Typography>
              <Typography variant="body2">
                <strong>Created:</strong> {dayjs(selected.created_at).format("YYYY-MM-DD HH:mm")}
              </Typography>

              <Divider />
              <Typography variant="subtitle2">KYC Documents</Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {selected.kyc_documents.map((document) => (
                  <Chip key={document} label={document} size="small" />
                ))}
              </Stack>
            </Stack>
          ) : (
            <Typography variant="body2">No rider selected</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default RidersPage;
