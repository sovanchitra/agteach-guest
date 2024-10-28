import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";

export const SortByFilter = ({ sortBy, handleChange }) => {
  return (
    <Box>
      <Typography sx={{ typography: { xs: "bmdsm", sm: "blgsm" } }}>
        Sort By
      </Typography>

      <FormControl>
        {/* Optionally, add a FormLabel if you need one */}
        {/* <FormLabel id="sort-by-label">Sort By</FormLabel> */}
        <RadioGroup
          aria-labelledby="sort-by-label"
          defaultValue="newest"
          name="radio-buttons-group"
          onChange={(e) => handleChange(e.target.value)}
        >
          <FormControlLabel control={<Radio />} label="Newest" value="newest" />
          <FormControlLabel control={<Radio />} label="Oldest" value="oldest" />
          <FormControlLabel control={<Radio />} label="A-Z" value="alphabet" />
          <FormControlLabel
            control={<Radio />}
            label="Price Low to high"
            value="plth"
          />
          <FormControlLabel
            control={<Radio />}
            label="Price high to low"
            value="phtl"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};
