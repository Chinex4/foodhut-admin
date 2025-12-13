import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination,
  Switch,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { createMeal, deleteMeal, fetchMealById, fetchMeals, updateMeal } from "@/store/slices/mealsSlice";

const MealsPage = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.meals.selected);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [newMeal, setNewMeal] = useState({ name: "", price: "", kitchen_id: "", description: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const { data, refetch } = useQuery({
    queryKey: ["meals", page],
    queryFn: () => dispatch(fetchMeals(page)).unwrap(),
  });
  const meals = Array.isArray(data?.items) ? data.items : [];
  const filteredMeals = meals.filter((meal) => meal.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const meta = data?.meta ?? { page: 1, per_page: 20, total: meals.length };
  const totalPages = meta.per_page ? Math.ceil((meta.total ?? meals.length) / meta.per_page) : 1;

  const handleCreate = async () => {
    if (!newMeal.name || !newMeal.kitchen_id) return;
    const form = new FormData();
    form.append("name", newMeal.name);
    form.append("price", newMeal.price);
    form.append("description", newMeal.description);
    form.append("kitchen_id", newMeal.kitchen_id);
    if (file) form.append("cover_image", file);
    await dispatch(createMeal(form));
    setCreateOpen(false);
    setNewMeal({ name: "", price: "", kitchen_id: "", description: "" });
    setFile(null);
    refetch();
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>
        Meals
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems="center">
        <TextField
          size="small"
          label="Search meals"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 320 }}
        />
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          Create meal
        </Button>
      </Stack>
      <Card elevation={0} sx={{ background: "rgba(17,24,39,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <CardContent>
          <Box sx={{ overflowX: "auto", width: "100%", "& table": { minWidth: 1100 } }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cover</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Kitchen</TableCell>
                  <TableCell>Available</TableCell>
                  <TableCell>Likes</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMeals.map((meal) => (
                  <TableRow
                    key={meal.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      dispatch(fetchMealById(meal.id));
                      setDetailsOpen(true);
                    }}
                  >
                    <TableCell>
                      {meal.cover_image?.url ? (
                        <img
                          src={meal.cover_image.url}
                          alt={meal.name}
                          style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 6 }}
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{meal.name}</TableCell>
                    <TableCell>₦{Number(meal.price ?? 0).toLocaleString()}</TableCell>
                    <TableCell>{meal.kitchen_id}</TableCell>
                    <TableCell>
                      <Switch
                        size="small"
                        checked={Boolean(meal.is_available)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => dispatch(updateMeal({ id: meal.id, payload: { is_available: !meal.is_available } }))}
                      />
                    </TableCell>
                    <TableCell>{meal.likes ?? 0}</TableCell>
                    <TableCell>{meal.rating ?? "—"}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(deleteMeal(meal.id));
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          {totalPages > 1 && (
            <Stack direction="row" justifyContent="center" mt={2}>
              <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
            </Stack>
          )}
        </CardContent>
      </Card>
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create meal</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Meal name" value={newMeal.name} onChange={(e) => setNewMeal((m) => ({ ...m, name: e.target.value }))} fullWidth />
            <TextField label="Description" value={newMeal.description} onChange={(e) => setNewMeal((m) => ({ ...m, description: e.target.value }))} fullWidth multiline minRows={2} />
            <TextField label="Price" type="number" value={newMeal.price} onChange={(e) => setNewMeal((m) => ({ ...m, price: e.target.value }))} fullWidth />
            <TextField label="Kitchen ID" value={newMeal.kitchen_id} onChange={(e) => setNewMeal((m) => ({ ...m, kitchen_id: e.target.value }))} fullWidth />
            <Button variant="outlined" component="label">
              {file ? file.name : "Upload cover image"}
              <input type="file" hidden accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selected?.name ?? "Meal details"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {selected?.cover_image?.url && (
              <img
                src={selected.cover_image.url}
                alt={selected.name}
                style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 12 }}
              />
            )}
            <Typography variant="body2"><strong>Description:</strong> {selected?.description ?? "—"}</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Typography variant="body2"><strong>Price:</strong> ₦{Number(selected?.price ?? 0).toLocaleString()}</Typography>
              <Typography variant="body2"><strong>Kitchen ID:</strong> {selected?.kitchen_id}</Typography>
              <Typography variant="body2"><strong>Available:</strong> {selected?.is_available ? "Yes" : "No"}</Typography>
            </Stack>
            <Typography variant="body2"><strong>Rating:</strong> {selected?.rating ?? "—"}</Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default MealsPage;
