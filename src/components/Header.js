import React from "react";
import { AppBar, Toolbar, Typography, makeStyles } from "@material-ui/core";
import { GraphicEqRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  logo: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" color="inherit">
      <Toolbar>
        <GraphicEqRounded className={classes.logo} color="secondary" />
        <Typography variant="h5">Music Share</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
