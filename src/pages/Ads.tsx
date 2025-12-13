import {
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Switch,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAppDispatch } from "@/hooks/storeHooks";
import { createAd, deleteAd, fetchAds, updateAd } from "@/store/slices/adsSlice";

const AdsPage = () => {
  const dispatch = useAppDispatch();
  const [payload, setPayload] = useState({ title: "", link: "", image_url: "" });

  const { data } = useQuery({
    queryKey: ["ads"],
    queryFn: () => dispatch(fetchAds()).unwrap(),
  });
  const ads = Array.isArray(data) ? data : [];

  const handleCreate = () => {
    if (!payload.title) return;
    dispatch(createAd({ ...payload, is_active: true })).then(() => setPayload({ title: "", link: "", image_url: "" }));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>
        Advertisements
      </Typography>
      <Card elevation={0} sx={{ background: "rgba(17,24,39,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
            <TextField label="Title" value={payload.title} onChange={(e) => setPayload((p) => ({ ...p, title: e.target.value }))} />
            <TextField label="Link" value={payload.link} onChange={(e) => setPayload((p) => ({ ...p, link: e.target.value }))} />
            <TextField label="Image URL" value={payload.image_url} onChange={(e) => setPayload((p) => ({ ...p, image_url: e.target.value }))} />
            <Button variant="contained" onClick={handleCreate}>
              Create
            </Button>
          </Stack>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id} hover>
                  <TableCell>{ad.title}</TableCell>
                  <TableCell>
                    <Switch
                      checked={Boolean(ad.is_active)}
                      onChange={() => dispatch(updateAd({ id: ad.id, payload: { is_active: !ad.is_active } }))}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" color="error" onClick={() => dispatch(deleteAd(ad.id))}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default AdsPage;
