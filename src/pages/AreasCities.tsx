import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { createAreaCity, fetchAreaCities, toggleAreaCityActive } from "@/store/slices/areaCitiesSlice";

const AreasCitiesPage = () => {
  const dispatch = useAppDispatch();
  const records = useAppSelector((state) => state.areaCities.items);
  const [payload, setPayload] = useState({ city: "", area: "" });

  useQuery({
    queryKey: ["area-cities"],
    queryFn: () => dispatch(fetchAreaCities()).unwrap(),
  });

  const handleCreate = async () => {
    if (!payload.city.trim() || !payload.area.trim()) return;
    await dispatch(createAreaCity({ city: payload.city.trim(), area: payload.area.trim() }));
    setPayload({ city: "", area: "" });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>
        Areas & Cities
      </Typography>
      <Card elevation={0} sx={{ background: "rgba(17,24,39,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
            <TextField
              label="City"
              value={payload.city}
              onChange={(event) => setPayload((prev) => ({ ...prev, city: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Area"
              value={payload.area}
              onChange={(event) => setPayload((prev) => ({ ...prev, area: event.target.value }))}
              fullWidth
            />
            <Button variant="contained" onClick={handleCreate}>
              Create
            </Button>
          </Stack>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>City</TableCell>
                <TableCell>Area</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>{record.city}</TableCell>
                  <TableCell>{record.area}</TableCell>
                  <TableCell>
                    <Chip size="small" label={record.is_active ? "Active" : "Inactive"} color={record.is_active ? "success" : "default"} />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={record.is_active}
                      onChange={() => dispatch(toggleAreaCityActive({ id: record.id, is_active: !record.is_active }))}
                    />
                  </TableCell>
                  <TableCell>{dayjs(record.created_at).format("YYYY-MM-DD HH:mm")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default AreasCitiesPage;
