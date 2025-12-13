import { Card, CardContent, Stack, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
};

const StatCard = ({ label, value, icon, trend }: StatCardProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card
        className="glass"
        elevation={0}
        sx={{
          border: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 20% 20%, rgba(255,168,0,0.12), transparent 35%)",
            pointerEvents: "none",
          }}
        />
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <div>
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="h5" mt={0.5}>
                {value}
              </Typography>
              {trend && (
                <Typography variant="caption" color="success.main">
                  {trend}
                </Typography>
              )}
            </div>
            {icon}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
