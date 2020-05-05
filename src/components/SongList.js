import React from "react";
import {
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Typography,
  makeStyles,
  CardActions,
  IconButton,
} from "@material-ui/core";
import { PlayArrow, AddCircle, Clear, Pause } from "@material-ui/icons";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { GET_SONGS } from "../graphql/subscriptions";
import { SongContext } from "../App";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(1),
  },
  songInfoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  songInfo: {
    width: "50%",
    display: "flex",
  },
  thumbnail: {
    objectFit: "cover",
    width: "140px",
    height: "140px",
  },
}));

const SongList = () => {
  const { data, loading, error } = useSubscription(GET_SONGS);

  // const song = {
  //   title: "Lunne",
  //   artist: "Moon",
  //   thumbnail: "http://img.youtube.com/vi/--ZtUFsIgMk/0.jpg",
  // };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "120px",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>ERROR FETCHING SONGS</div>;
  }

  return (
    <div>
      {data.songs.map((song) => (
        <Song key={song.id} song={song} />
      ))}
    </div>
  );
};

function Song({ song }) {
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
    },
  });
  const { state, dispatch } = React.useContext(SongContext);
  const classes = useStyles();
  const { title, artist, thumbnail } = song;
  const [currentSongPlaying, setCurrentSongPlaying] = React.useState(false);

  React.useEffect(() => {
    const isSongPlaying = state.isPlaying && song.id === state.song.id;
    setCurrentSongPlaying(isSongPlaying);
  }, [song.id, state.song.id, state.isPlaying]);

  function handleTogglePlay() {
    dispatch({ type: "SET_SONG", payload: { song } });
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  }

  function handleAddOrRemoveFromQueue() {
    addOrRemoveFromQueue({
      variables: {
        input: { ...song, __typename: "Song" },
      },
    });
  }

  return (
    <Card className={classes.container}>
      <div className={classes.songInfoContainer}>
        <CardMedia image={thumbnail} className={classes.thumbnail} />
        <div className={classes.songInfo}>
          <CardContent>
            <Typography variant="h5">{title}</Typography>
            <Typography variant="h6">{artist}</Typography>
          </CardContent>
        </div>
        <div>
          <CardActions>
            <IconButton onClick={handleTogglePlay}>
              {currentSongPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton color="primary" onClick={handleAddOrRemoveFromQueue}>
              <AddCircle />
            </IconButton>
            {/* <IconButton color="secondary">
              <Clear />
            </IconButton> */}
          </CardActions>
        </div>
      </div>
    </Card>
  );
}

export default SongList;
