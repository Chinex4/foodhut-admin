import {
  Button,
  Card,
  CardContent,
  Box,
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
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { createAd, deleteAd, fetchAds, updateAd } from "@/store/slices/adsSlice";

const AdsPage = () => {
  const dispatch = useAppDispatch();
  const ads = useAppSelector((state) => state.ads.items);
  const [payload, setPayload] = useState({ title: "", link: "" });
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useQuery({
    queryKey: ["ads"],
    queryFn: () => dispatch(fetchAds()).unwrap(),
  });

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (!selectedFile) {
      setImagePreview("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setImagePreview(result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleCreate = async () => {
    if (!payload.title || !imagePreview) return;
    await dispatch(
      createAd({
        title: payload.title,
        link: payload.link,
        image_url: imagePreview,
        is_active: true,
      }),
    );
    setPayload({ title: "", link: "" });
    setFile(null);
    setImagePreview("");
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
            <Button variant="outlined" component="label">
              {file ? file.name : "Upload ad image"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
            </Button>
            <Button variant="contained" onClick={handleCreate}>
              Create
            </Button>
          </Stack>
          {imagePreview && (
            <Box mb={2}>
              <img
                src={imagePreview}
                alt="Ad preview"
                style={{ width: 180, height: 96, objectFit: "cover", borderRadius: 8 }}
              />
            </Box>
          )}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Link</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id} hover>
                  <TableCell>
                    {ad.image_url ? (
                      <img
                        src={ad.image_url}
                        alt={ad.title}
                        style={{ width: 96, height: 56, objectFit: "cover", borderRadius: 8 }}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{ad.title}</TableCell>
                  <TableCell>{ad.link || "—"}</TableCell>
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
