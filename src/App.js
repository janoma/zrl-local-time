import { useEffect, useState } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import Autocomplete from "@mui/joy/Autocomplete";
import CssBaseline from "@mui/joy/CssBaseline";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Typography from "@mui/joy/Typography";

function App() {
  const [division, setDivision] = useState("open");
  const [region, setRegion] = useState("EMEAE Central");
  console.log(division, region);

  const handleDivisionChange = (event) => {
    setDivision(event.target.value);
  };

  const handleRegionChange = (event) => {
    setRegion(event.target.value);
  };

  const regions =
    division === "women"
      ? [
          "Oceania East",
          "Oceania West",
          "EMEAE South-East",
          "EMEAE East",
          "EMEAE Central",
          "EMEAE West",
          "Americas South",
          "Americas East",
          "Americas West",
        ]
      : [
          "Oceania North-East",
          "Oceania East",
          "Oceania South",
          "Oceania West",
          "Atlantic South-East",
          "Atlantic East",
          "Atlantic Central",
          "Atlantic North",
          "Atlantic West",
          "EMEAE South-East",
          "EMEAE East",
          "EMEAE North-East",
          "EMEAE South",
          "EMEAE Central",
          "EMEAE North",
          "EMEAW South-East",
          "EMEAW East",
          "EMEAW South",
          "EMEAW Central",
          "EMEAW North",
          "EMEAW West",
          "Americas South",
          "Americas East",
          "Americas Central",
          "Americas North",
          "Americas West",
        ];

  useEffect(() => {
    if (division === "women" && !regions.includes(region)) {
      setRegion("EMEAE Central");
    }
  }, [division, region, regions]);

  return (
    <CssVarsProvider>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            maxWidth: "80ch",
            margin: "0 auto",
            padding: "1rem",
            color: "var(--joy-text-primary)",
          },
          "#root": {
            display: "grid",
            justifyItems: "center",
          },
          main: {
            padding: "2rem",
          },
          ".question + .question": {
            paddingTop: "2rem",
          },
          h3: {
            paddingBottom: "0.5rem",
          },
        }}
      />
      <header>
        <Typography color="neutral" level="h1">
          Zwift Racing League Local Time Checker
        </Typography>
      </header>
      <main>
        <FormControl className="question">
          <Typography level="h3">What's your main division?</Typography>
          <RadioGroup defaultValue="open" name="division-group">
            <Radio
              checked={division == "women"}
              label="Women's"
              onChange={handleDivisionChange}
              value="women"
              variant="outlined"
            />
            <Radio
              checked={division == "open"}
              label="Open/Mixed/Co-Ed"
              onChange={handleDivisionChange}
              value="open"
              variant="outlined"
            />
          </RadioGroup>
        </FormControl>
        <FormControl className="question">
          <Typography level="h3">What's your region?</Typography>
          <Autocomplete
            onChange={(event, newValue) => {
              setRegion(newValue);
            }}
            options={regions}
            value={region}
          />
        </FormControl>
      </main>
    </CssVarsProvider>
  );
}

export default App;
