import { FormEvent, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { ShieldCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { fetchLogisticsCompanies, selectLogistics, submitComplianceKyc } from "@/store/slices/logisticsSlice";
import { accountStatusColor, complianceColor } from "./helpers";

const CompliancePage = () => {
  const dispatch = useAppDispatch();
  const { businessAccount, complianceChecklist, error, mutationStatus } = useAppSelector(selectLogistics);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    cacCertificateNumber: "",
    tinNumber: "",
    insuranceProvider: "",
    managerIdNumber: "",
  });

  const progress = useMemo(() => {
    const approved = complianceChecklist.filter((item) => item.status === "approved").length;
    return `${approved}/${complianceChecklist.length} complete`;
  }, [complianceChecklist]);

  useEffect(() => {
    dispatch(fetchLogisticsCompanies(1));
  }, [dispatch]);

  const handleSubmitKyc = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!businessAccount) return;
    await dispatch(
      submitComplianceKyc({
        company_id: businessAccount.id,
        cac_certificate_id: form.cacCertificateNumber.trim(),
        tin_tax_record_id: form.tinNumber.trim(),
        insurance_cover_id: form.insuranceProvider.trim(),
      }),
    );
    setForm({
      cacCertificateNumber: "",
      tinNumber: "",
      insuranceProvider: "",
      managerIdNumber: "",
    });
    setDialogOpen(false);
  };

  return (
    <Stack spacing={2.5}>
      <Typography variant="h5" fontWeight={700}>
        Compliance (Logistics KYC)
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Card elevation={0}>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ md: "center" }}>
            <Stack spacing={0.6}>
              <Typography variant="body2" color="text.secondary">
                Compliance Progress
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {progress}
              </Typography>
            </Stack>
            <Button variant="contained" startIcon={<ShieldCheck size={16} />} onClick={() => setDialogOpen(true)} disabled={mutationStatus === "loading"}>
              Submit KYC
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={0}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Logistics Business Account
          </Typography>
          {businessAccount ? (
            <Stack spacing={1.3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Account Status:
                </Typography>
                <Chip size="small" color={accountStatusColor(businessAccount.status)} label={businessAccount.status} />
              </Stack>
              <Typography variant="body2">
                <strong>{businessAccount.companyName}</strong> ({businessAccount.registrationNumber})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {businessAccount.contactEmail} · {businessAccount.contactPhone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                City: {businessAccount.city} · Fleet Size: {businessAccount.fleetSize} bikes
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Created {dayjs(businessAccount.createdAt).format("DD MMM YYYY, HH:mm")}
              </Typography>
            </Stack>
          ) : (
            <Alert severity="info">No logistics account profile available. Complete signup first.</Alert>
          )}
        </CardContent>
      </Card>

      <Card elevation={0}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Compliance Checklist
          </Typography>
          <Stack spacing={1.2}>
            {complianceChecklist.map((item) => (
              <Stack key={item.id} direction="row" justifyContent="space-between" alignItems="center">
                <Stack>
                  <Typography variant="body2">{item.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Updated {dayjs(item.updatedAt).format("DD MMM, HH:mm")}
                  </Typography>
                </Stack>
                <Chip size="small" label={item.status} color={complianceColor(item.status)} />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSubmitKyc}>
          <DialogTitle>Submit Compliance KYC</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                label="CAC Certificate Number"
                value={form.cacCertificateNumber}
                onChange={(event) => setForm((current) => ({ ...current, cacCertificateNumber: event.target.value }))}
                required
              />
              <TextField
                label="TIN Number"
                value={form.tinNumber}
                onChange={(event) => setForm((current) => ({ ...current, tinNumber: event.target.value }))}
                required
              />
              <TextField
                label="Insurance Provider"
                value={form.insuranceProvider}
                onChange={(event) => setForm((current) => ({ ...current, insuranceProvider: event.target.value }))}
                required
              />
              <TextField
                label="Operations Manager ID Number"
                value={form.managerIdNumber}
                onChange={(event) => setForm((current) => ({ ...current, managerIdNumber: event.target.value }))}
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={!businessAccount}>
              Submit
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
};

export default CompliancePage;
