import { FormEvent, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/storeHooks";
import { createBusinessAccount } from "@/store/slices/logisticsSlice";

const LogisticsSignupPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    registrationNumber: "",
    contactEmail: "",
    contactPhone: "",
    city: "",
    fleetSize: "1",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(
      createBusinessAccount({
        companyName: form.companyName.trim(),
        registrationNumber: form.registrationNumber.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        city: form.city.trim(),
        fleetSize: Math.max(Number(form.fleetSize) || 1, 1),
      }),
    );
    setSuccessMessage("Business account created successfully. Continue to logistics login.");
    setTimeout(() => {
      navigate("/logistics/auth");
    }, 700);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(11,17,31,0.98)), radial-gradient(circle at 20% 20%, rgba(255,168,0,0.14), transparent 30%), radial-gradient(circle at 80% 10%, rgba(255,225,167,0.12), transparent 32%)",
        p: 2,
      }}
    >
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <Card
          sx={{
            width: 540,
            maxWidth: "100%",
            p: 1.5,
            background: "rgba(17,24,39,0.9)",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          <CardContent>
            <Stack component="form" spacing={2} onSubmit={handleSubmit}>
              <Typography variant="h5" textAlign="center" fontWeight={700}>
                Logistics Company Signup
              </Typography>
              {successMessage && <Alert severity="success">{successMessage}</Alert>}
              <TextField
                label="Company Name"
                value={form.companyName}
                onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))}
                required
              />
              <TextField
                label="Registration Number"
                value={form.registrationNumber}
                onChange={(event) => setForm((current) => ({ ...current, registrationNumber: event.target.value }))}
                required
              />
              <TextField
                type="email"
                label="Contact Email"
                value={form.contactEmail}
                onChange={(event) => setForm((current) => ({ ...current, contactEmail: event.target.value }))}
                required
              />
              <TextField
                label="Contact Phone"
                value={form.contactPhone}
                onChange={(event) => setForm((current) => ({ ...current, contactPhone: event.target.value }))}
                required
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  fullWidth
                  label="City"
                  value={form.city}
                  onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Fleet Size"
                  inputProps={{ min: 1 }}
                  value={form.fleetSize}
                  onChange={(event) => setForm((current) => ({ ...current, fleetSize: event.target.value }))}
                  required
                />
              </Stack>
              <Button type="submit" variant="contained">
                Create Logistics Account
              </Button>
              <Button component={Link} to="/logistics/auth" variant="outlined">
                Already signed up? Logistics Login
              </Button>
              <Button component={Link} to="/auth" variant="text">
                Back to Admin Login
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default LogisticsSignupPage;
