import { FormEvent, useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";
import { Bike, KeyRound, Plus, Power } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import {
  fetchLogisticsCompanies,
  fetchLogisticsRiders,
  registerRiderBikeAccount,
  resetRiderPasscode,
  selectLogistics,
  toggleRiderStatus,
  verifyRiderKyc,
} from "@/store/slices/logisticsSlice";
import { naira, riderColor } from "./helpers";

const BikeAccountsPage = () => {
  const dispatch = useAppDispatch();
  const { riders, businessAccount, status, error } = useAppSelector(selectLogistics);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    bikeType: "Bike",
    plateNumber: "",
    passcode: "",
  });

  useEffect(() => {
    dispatch(fetchLogisticsCompanies(1));
    dispatch(fetchLogisticsRiders(1));
  }, [dispatch]);

  const handleCreateRider = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(
      registerRiderBikeAccount({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        bikeType: form.bikeType,
        plateNumber: form.plateNumber,
        passcode: form.passcode,
      }),
    );
    setForm({
      fullName: "",
      email: "",
      phoneNumber: "",
      bikeType: "Bike",
      plateNumber: "",
      passcode: "",
    });
    setDialogOpen(false);
  };

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1.5}>
        <Typography variant="h5" fontWeight={700}>
          Bike Accounts & Rider Access
        </Typography>
        <Button variant="contained" startIcon={<Bike size={16} />} onClick={() => setDialogOpen(true)} disabled={!businessAccount}>
          Register Bike Account
        </Button>
      </Stack>
      {error && <Typography color="error">{error}</Typography>}

      <Card elevation={0}>
        <CardContent>
          <Box sx={{ overflowX: "auto", "& table": { minWidth: 1040 } }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Rider</TableCell>
                  <TableCell>Bike Account</TableCell>
                  <TableCell>Bike Details</TableCell>
                  <TableCell>Live Orders</TableCell>
                  <TableCell>Today Earnings</TableCell>
                  <TableCell>Passcode</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riders.map((rider) => (
                  <TableRow key={rider.id} hover>
                    <TableCell>
                      <Stack spacing={0.2}>
                        <Typography variant="body2" fontWeight={600}>
                          {rider.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {rider.phoneNumber}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{rider.bikeAccountId}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {rider.bikeType} ({rider.plateNumber})
                      </Typography>
                    </TableCell>
                    <TableCell>{rider.activeOrders}</TableCell>
                    <TableCell>{naira(rider.earningsToday)}</TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        Updated {dayjs(rider.passcodeUpdatedAt).format("DD MMM, HH:mm")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={
                          riderColor(rider.status) === "success"
                            ? "success.main"
                            : riderColor(rider.status) === "error"
                              ? "error.main"
                              : "warning.main"
                        }
                      >
                        {rider.status}
                      </Typography>
                      {rider.kycStatus && <Chip size="small" label={`KYC ${rider.kycStatus}`} sx={{ mt: 0.5 }} />}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Reset rider sign-in passcode">
                          <IconButton size="small" color="primary" onClick={() => dispatch(resetRiderPasscode(rider.id))}>
                            <KeyRound size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={rider.status === "active" ? "Turn off rider" : "Turn on rider"}>
                          <IconButton
                            size="small"
                            color={rider.status === "active" ? "warning" : "success"}
                            onClick={() => dispatch(toggleRiderStatus({ riderId: rider.id, active: rider.status !== "active" }))}
                          >
                            <Power size={16} />
                          </IconButton>
                        </Tooltip>
                        {rider.kycId && rider.kycStatus === "pending" && (
                          <>
                            <Button
                              size="small"
                              onClick={() =>
                                dispatch(verifyRiderKyc({ riderId: rider.id, kyc_id: rider.kycId!, verification_status: "VERIFIED" }))
                              }
                            >
                              Verify
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() =>
                                dispatch(verifyRiderKyc({ riderId: rider.id, kyc_id: rider.kycId!, verification_status: "REJECTED" }))
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Switch
                          checked={rider.status === "active"}
                          onChange={(_, checked) => dispatch(toggleRiderStatus({ riderId: rider.id, active: checked }))}
                          disabled={status === "loading"}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleCreateRider}>
          <DialogTitle>Register Rider Bike Account</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                label="Rider Full Name"
                value={form.fullName}
                onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                required
              />
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
              <TextField
                label="Phone Number"
                value={form.phoneNumber}
                onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))}
                required
              />
              <TextField
                select
                label="Bike Type"
                value={form.bikeType}
                onChange={(event) => setForm((current) => ({ ...current, bikeType: event.target.value }))}
              >
                <MenuItem value="Bike">Bike</MenuItem>
                <MenuItem value="Scooter">Scooter</MenuItem>
                <MenuItem value="Tricycle">Tricycle</MenuItem>
              </TextField>
              <TextField
                label="Plate Number"
                value={form.plateNumber}
                onChange={(event) => setForm((current) => ({ ...current, plateNumber: event.target.value }))}
                required
              />
              <TextField
                label="Sign-in Passcode"
                value={form.passcode}
                inputProps={{ minLength: 4, maxLength: 6 }}
                onChange={(event) => setForm((current) => ({ ...current, passcode: event.target.value.replace(/\D/g, "") }))}
                helperText="4 to 6 digits"
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" startIcon={<Plus size={16} />}>
              Create Rider Account
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
};

export default BikeAccountsPage;
