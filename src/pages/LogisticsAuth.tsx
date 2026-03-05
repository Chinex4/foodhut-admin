import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { fetchProfile, resendOtp, sendOtp, setPortal, verifyOtp } from "@/store/slices/authSlice";

const LogisticsAuthPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const [phone, setPhone] = useState("+2348090000000");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const handleSendOtp = async () => {
    try {
      await dispatch(sendOtp(phone)).unwrap();
      setStep("otp");
    } catch {
      // errors are handled via auth.error from slice
    }
  };

  const handleVerify = async () => {
    try {
      await dispatch(verifyOtp({ phone_number: phone, otp })).unwrap();
      dispatch(setPortal("logistics"));
      await dispatch(fetchProfile()).unwrap();
      navigate("/logistics/compliance");
    } catch {
      // errors are handled via auth.error from slice
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(11,17,31,0.98)), radial-gradient(circle at 18% 20%, rgba(255,168,0,0.16), transparent 32%), radial-gradient(circle at 78% 12%, rgba(255,225,167,0.12), transparent 34%)",
        p: 2,
      }}
    >
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <Card
          sx={{
            width: 420,
            maxWidth: "100%",
            p: 1.5,
            background: "rgba(17,24,39,0.9)",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5" textAlign="center" fontWeight={700}>
                Logistics Login
              </Typography>
              {auth.error && <Alert severity="error">{auth.error}</Alert>}
              {step === "phone" && (
                <Stack spacing={2}>
                  <TextField label="Phone number" value={phone} onChange={(event) => setPhone(event.target.value)} fullWidth />
                  <Button variant="contained" onClick={handleSendOtp} disabled={auth.status === "loading"}>
                    Send OTP
                  </Button>
                </Stack>
              )}
              {step === "otp" && (
                <Stack spacing={2}>
                  <TextField label="OTP" value={otp} onChange={(event) => setOtp(event.target.value)} fullWidth />
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" onClick={() => dispatch(resendOtp(phone))} fullWidth>
                      Resend OTP
                    </Button>
                    <Button variant="contained" onClick={handleVerify} fullWidth>
                      Verify
                    </Button>
                  </Stack>
                </Stack>
              )}
              <Button component={Link} to="/logistics/signup" variant="outlined">
                New company? Create account
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

export default LogisticsAuthPage;
