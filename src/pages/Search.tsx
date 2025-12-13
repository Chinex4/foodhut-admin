import {
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
  CardMedia,
  CardActionArea,
  Pagination,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@/hooks/storeHooks";
import { searchAll } from "@/store/slices/searchSlice";
import type { Meal } from "@/types/meal";

const SearchPage = () => {
  const dispatch = useAppDispatch();
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);

  const searchMutation = useMutation({
    mutationFn: (vars: { term: string; page: number }) => dispatch(searchAll(vars)).unwrap(),
  });

  useEffect(() => {
    if (!term.trim()) return;
    const handle = setTimeout(() => {
      searchMutation.mutate({ term, page: 1 });
      setPage(1);
    }, 400);
    return () => clearTimeout(handle);
  }, [term]);

  const results = searchMutation.data ?? { items: [], meta: { page: 1, per_page: 10, total: 0 } };
  const meals = useMemo(() => results.items?.filter((item): item is Meal => "price" in item) ?? [], [results.items]);
  const totalPages = results.meta?.per_page ? Math.ceil((results.meta.total ?? meals.length) / results.meta.per_page) : 1;

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>
        Search
      </Typography>
      <Card elevation={0}>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
            <TextField
              label="Search kitchens or meals"
              fullWidth
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Type to search..."
            />
          </Stack>
          <Grid container spacing={2}>
            {meals.map((meal) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={meal.id}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: "rgba(17,24,39,0.92)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <CardActionArea sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                    {meal.cover_image?.url && (
                      <CardMedia component="img" image={meal.cover_image.url} alt={meal.name} sx={{ height: 160, objectFit: "cover" }} />
                    )}
                    <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {meal.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {meal.description}
                      </Typography>
                      <Typography variant="body2" mt={1}>
                        ₦{Number(meal.price ?? 0).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Stack direction="row" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => {
                  setPage(p);
                  searchMutation.mutate({ term, page: p });
                }}
                color="primary"
              />
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default SearchPage;
