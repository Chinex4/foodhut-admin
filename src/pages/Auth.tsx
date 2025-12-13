import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { fetchProfile, resendOtp, sendOtp, verifyOtp } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((s) => s.auth);
  const [phone, setPhone] = useState("+2348123456789");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const handleSendOtp = async () => {
    await dispatch(sendOtp(phone));
    setStep("otp");
  };

  const handleVerify = async () => {
    await dispatch(verifyOtp({ phone_number: phone, otp }));
    await dispatch(fetchProfile());
    navigate("/");
  };

  return (
    <Box
      className="min-h-screen"
      sx={{
        display: "grid",
        placeItems: "center",
        background: `
          linear-gradient(135deg, rgba(15,23,42,0.95), rgba(11,17,31,0.98)),
          radial-gradient(circle at 20% 20%, rgba(255,168,0,0.14), transparent 30%),
          radial-gradient(circle at 80% 10%, rgba(255,225,167,0.12), transparent 32%)
        `,
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
                Foodhut Admin Login
              </Typography>
              {auth.error && <Alert severity="error">{auth.error}</Alert>}
              {step === "phone" && (
                <Stack spacing={2}>
                  <TextField
                    label="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                  />
                  <Button variant="contained" onClick={handleSendOtp} disabled={auth.status === "loading"}>
                    Send OTP
                  </Button>
                </Stack>
              )}
              {step === "otp" && (
                <Stack spacing={2}>
                  <TextField label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} fullWidth />
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
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default AuthPage;
