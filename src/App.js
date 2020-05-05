import React from "react";
import Header from "./components/Header";
import AddSong from "./components/AddSong";
import SongPlayer from "./components/SongPlayer";
import SongList from "./components/SongList";
import { Grid, useMediaQuery } from "@material-ui/core";
import songReducer from "./reducer";

export const SongContext = React.createContext({
  song: {
    id: "2b810030-7cf0-4405-a807-e661adcb6af6",
    title: "Night Drive -",
    artist: "A Chillwave Mix",
    thumbnail: "http://img.youtube.com/vi/emNgfuw8vlA/0.jpg",
    url: "https://www.youtube.com/watch?v=emNgfuw8vlA",
    duration: "3219",
  },
  isPlaying: false,
});

function App() {
  const initialState = React.useContext(SongContext);
  const [state, dispatch] = React.useReducer(songReducer, initialState);
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const greaterThanSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  return (
    <SongContext.Provider value={{ state, dispatch }}>
      <div
        style={{
          padding: "20px",
        }}
      >
        {greaterThanSm && <Header />}
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={7}
            style={{
              paddingTop: greaterThanSm ? "60px" : "20px",
            }}
          >
            <AddSong />
            <SongList />
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            style={
              greaterThanMd
                ? {
                    position: "fixed",
                    right: 0,
                    top: 0,
                    width: "100%",
                    paddingTop: "78px",
                  }
                : {
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                  }
            }
          >
            <SongPlayer />
          </Grid>
        </Grid>
      </div>
    </SongContext.Provider>
  );
}

export default App;
