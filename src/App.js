import { useEffect, useState } from "react";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  AccessTime,
  CalendarMonth,
  Launch,
  Map,
  PedalBike,
} from "@mui/icons-material";
import {
  Autocomplete,
  CssBaseline,
  FormControl,
  GlobalStyles,
  Link,
  Radio,
  RadioGroup,
  Table,
  Typography,
} from "@mui/joy";
import { CssVarsProvider } from "@mui/joy/styles";

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
  const [womenRegions, setWomenRegions] = useState([]);
  const [openRegions, setOpenRegions] = useState([]);
  const [regions, setRegions] = useState([]);

  const handleDivisionChange = (event) => {
    setDivision(event.target.value);
  };

  const timezones = moment.tz.names();

  useEffect(() => {
    const fetchZrl = async () => {
      fetch("./zrl-2024-01-06.json")
        .then((response) => response.json())
        .then((data) => {
          setZrl(data);
          setWomenRegions(Object.keys(data.women));
          setOpenRegions(Object.keys(data.open));
        });
    };
    fetchZrl();
  }, []);

  useEffect(() => {
    const fetchRaces = async () => {
      fetch("./races-2023-2024-round-3.json")
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

  useEffect(() => {
    setRegions(division === "women" ? womenRegions : openRegions);
  }, [division, openRegions, womenRegions]);

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
            maxWidth: "70ch",
            margin: "0 auto",
            padding: "1rem",
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
          <RadioGroup
            defaultValue="open"
            orientation="horizontal"
            name="division-group"
          >
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
                    <Typography startDecorator={<CalendarMonth />}>
                      Date
                    </Typography>
                  </th>
                  <th>
                    <Typography startDecorator={<AccessTime />}>
                      Time
                    </Typography>
                  </th>
                  <th>
                    <Typography startDecorator={<PedalBike />}>Type</Typography>
                  </th>
                  <th style={{ width: "40%" }}>
                    <Typography startDecorator={<Map />}>Course</Typography>
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
                        endDecorator={<Launch />}
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
      <footer>
        <Typography level="title-sm" color="neutral">
          Brought to you by{" "}
          <Link href="https://instagram.com/janoma_cl">janoma</Link>.
        </Typography>
      </footer>
    </CssVarsProvider>
  );
}

export default App;
