import { useEffect, useMemo, useState } from "react";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { CssVarsProvider } from "@mui/joy/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Autocomplete from "@mui/joy/Autocomplete";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CssBaseline from "@mui/joy/CssBaseline";
import FormControl from "@mui/joy/FormControl";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Link from "@mui/joy/Link";
import MapIcon from "@mui/icons-material/Map";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

const moment = require("moment-timezone");

const firebaseConfig = {
  apiKey: "AIzaSyBCDoXFXq78UhcW0yVzbaUzx5VHbquUmyY",
  authDomain: "zrl-local-time.firebaseapp.com",
  projectId: "zrl-local-time",
  storageBucket: "zrl-local-time.appspot.com",
  messagingSenderId: "424537142278",
  appId: "1:424537142278:web:f7dfc91d752a7dc9a43f87",
  measurementId: "G-87ELDJ9H5H",
};

const firebaseApp = initializeApp(firebaseConfig);
// TODO: use analytics
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(firebaseApp);

function App() {
  const [division, setDivision] = useState(
    localStorage.getItem("division") || "open"
  );
  const [region, setRegion] = useState(
    localStorage.getItem(`region-${division}`) || "EMEAE Central"
  );
  const [timezone, setTimezone] = useState(
    localStorage.getItem("timezone") || moment.tz.guess()
  );

  const [zrl, setZrl] = useState(null);
  const [races, setRaces] = useState(null);

  const handleDivisionChange = (event) => {
    setDivision(event.target.value);
  };

  const regions = useMemo(() => {
    return division === "women"
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
  }, [division]);

  const timezones = moment.tz.names();

  useEffect(() => {
    const fetchZrl = async () => {
      fetch("./zrl.json")
        .then((response) => response.json())
        .then((data) => setZrl(data));
    };
    fetchZrl();
  }, []);

  useEffect(() => {
    const fetchRaces = async () => {
      fetch("./races.json")
        .then((response) => response.json())
        .then((data) => setRaces(data));
    };
    fetchRaces();
  }, []);

  useEffect(() => {
    if (division === "women" && !regions.includes(region)) {
      setRegion("EMEAE Central");
    }
  }, [division, region, regions]);

  useEffect(() => {
    localStorage.setItem("division", division);
    if (division === "women" && localStorage.getItem("region-women")) {
      setRegion(localStorage.getItem("region-women"));
    } else if (division === "open" && localStorage.getItem("region-open")) {
      setRegion(localStorage.getItem("region-open"));
    }
  }, [division]);

  useEffect(() => {
    localStorage.setItem(`region-${division}`, region);
  }, [division, region]);

  useEffect(() => {
    localStorage.setItem("timezone", timezone);
  }, [timezone]);

  const canShowTimes =
    moment.tz.zone(timezone) &&
    races &&
    zrl &&
    zrl.hasOwnProperty(division) &&
    zrl[division].hasOwnProperty(region);

  return (
    <CssVarsProvider>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            maxWidth: "80ch",
            margin: "0 auto",
            padding: "1rem",
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
          section: {
            paddingTop: "2rem",
          },
        }}
      />
      <header>
        <Typography level="h1">Zwift Racing League Local Times</Typography>
      </header>
      <main>
        <FormControl className="question">
          <Typography level="h3" color="neutral">
            What's your main division?
          </Typography>
          <RadioGroup defaultValue="open" name="division-group">
            <Radio
              checked={division === "women"}
              label="Women's"
              onChange={handleDivisionChange}
              value="women"
              variant="outlined"
            />
            <Radio
              checked={division === "open"}
              label="Open/Mixed/Co-Ed"
              onChange={handleDivisionChange}
              value="open"
              variant="outlined"
            />
          </RadioGroup>
        </FormControl>
        <FormControl className="question">
          <Typography level="h3" color="neutral">
            What's your team's ZRL region?
          </Typography>
          <Autocomplete
            onChange={(event, newValue) => {
              setRegion(newValue);
            }}
            options={regions}
            value={region}
          />
        </FormControl>
        <FormControl className="question">
          <Typography level="h3" color="neutral">
            What's your local timezone?
          </Typography>
          <Autocomplete
            onChange={(event, newValue) => {
              setTimezone(newValue);
            }}
            options={timezones}
            value={timezone}
          />
        </FormControl>
        {canShowTimes && (
          <section>
            <Typography level="h2">Your race times</Typography>
            <Table aria-label="basic table">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th>
                    <Typography startDecorator={<CalendarMonthIcon />}>
                      Date
                    </Typography>
                  </th>
                  <th>
                    <Typography startDecorator={<AccessTimeIcon />}>
                      Time
                    </Typography>
                  </th>
                  <th>
                    <Typography startDecorator={<PedalBikeIcon />}>
                      Type
                    </Typography>
                  </th>
                  <th style={{ width: "40%" }}>
                    <Typography startDecorator={<MapIcon />}>Course</Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {races.map((row) => (
                  <tr key={row.number}>
                    <td>{row.number}</td>
                    <td>
                      {moment
                        .tz(
                          `${row.date} ${zrl[division][region].time}`,
                          zrl[division][region].timezone
                        )
                        .tz(timezone)
                        .format("ll")}
                    </td>
                    <td>
                      <Typography
                        style={{ fontWeight: "var(--joy-fontWeight-lg)" }}
                      >
                        {moment
                          .tz(
                            `${row.date} ${zrl[division][region].time}`,
                            zrl[division][region].timezone
                          )
                          .tz(timezone)
                          .format("LT")}
                      </Typography>
                    </td>
                    <td>{row.type}</td>
                    <td>
                      <Link
                        href={row.courseUrl}
                        color="neutral"
                        target="_blank"
                        rel="noopener"
                      >
                        {row.course}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>
        )}
      </main>
    </CssVarsProvider>
  );
}

export default App;
