import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo from "../assets/logo_transparent.png";
import axios from "axios";
import _ from "lodash";
import noThumb from "../assets/logo.png";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: "#333333",
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "#F2F3F4",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Restaurant = () => {
  const classes = useStyles();

  const [state, setstate] = useState({});
  const [city, setcity] = useState("");
  const [entity, setentity] = useState();
  const [restaurants, setrestaurants] = useState([]);
  const [loading, setloading] = useState(false);

  const config = {
    headers: {
      "user-key": "95a7aa76d5bcf444b6a0033a8013d83c",
    },
  };

  useEffect(
    _.debounce(() => {
      setloading(true);
      axios
        .get(
          `https://developers.zomato.com/api/v2.1/locations?query=${city}`,
          config
        )
        .then((res) => setentity(res.data.location_suggestions[0].entity_id))
        .then(setloading(false))
        .catch((e) => console.log(e));
    }, 500),
    [city]
  );

  useEffect(() => {
    setloading(true);
    axios
      .get(
        `https://developers.zomato.com/api/v2.1/search?entity_id=${entity}&entity_type=city`,
        config
      )
      .then((res) => setrestaurants(res.data.restaurants))
      .then(setloading(false))
      .catch((e) => console.log(e));
  }, [entity]);

  const Test = (restaurants) => (
    <>
      {restaurants.map((element) => (
        <Grid item key={element.key} xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardMedia
              height="140"
              className={classes.cardMedia}
              image={element.restaurant.thumb || noThumb}
              title="Image title"
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {element.restaurant.name}
              </Typography>
              <b>Address</b>
              <Typography variant="body2" color="textSecondary" component="p">
                {element.restaurant.location.address}
              </Typography>
              <b>Timing</b>
              <Typography variant="body2" color="textSecondary" component="p">
                {element.restaurant.timings}
              </Typography>
              <b>Phone</b>
              <Typography variant="body2" color="textSecondary" component="p">
                {element.restaurant.phone_numbers}
              </Typography>
              <b>Rating</b>
              <Typography variant="body2" color="textSecondary" component="p">
                {element.restaurant.user_rating.aggregate_rating}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View
              </Button>
              {/* <Button size="small" color="primary">
                      Edit
                    </Button> */}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </>
  );

  return (
    <React.Fragment>
      <CssBaseline />
      {/*   {!loading && <div> {restaurants} </div>} */}
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              <img style={{ width: 200, height: 200 }} src={logo}></img>
            </Typography>
            <Typography
              style={{ color: "#F2F3F4" }}
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              All food delivery markets in one place
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search city…"
                onChange={(e) => setcity(e.target.value)}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}

          {!loading && (
            <Grid container spacing={4}>
              {Test(restaurants)}
            </Grid>
          )}
        </Container>
      </main>
    </React.Fragment>
  );
};

export default Restaurant;
