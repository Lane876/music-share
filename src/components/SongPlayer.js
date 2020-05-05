import React from "react";
import QueuedSongList from "./QueuedSongList";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Slider,
  CardMedia,
  makeStyles,
} from "@material-ui/core";
import { SkipPrevious, Pause, SkipNext, PlayArrow } from "@material-ui/icons";
import { SongContext } from "../App";
import { useQuery } from "@apollo/react-hooks";
import { GET_QUEUED_SONGS } from "../graphql/queries";
import ReactPlayer from "react-player";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  },
  content: {
    flex: "1 0 auto",
  },
  thumbnail: {
    width: "40%",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  playIcon: {
    height: "40px",
    width: "40px",
  },
}));

const SongPlayer = () => {
  const { data } = useQuery(GET_QUEUED_SONGS);
  const { state, dispatch } = React.useContext(SongContext);
  const classes = useStyles();
  const [played, setPlayed] = React.useState(0);
  const [playedSeconds, setPlayedSeconds] = React.useState(0);
  const [positionInQueue, setPositionInQueue] = React.useState(0);
  const [seeking, setSeeking] = React.useState(false);
  const reactPlayerRef = React.useRef();

  React.useEffect(() => {
    const songIndex = data.queue.findIndex((song) => song.id === state.song.id);
    setPositionInQueue(songIndex);
  }, [data.queue, state.song.id]);

  React.useEffect(() => {
    const nextSong = data.queue[positionInQueue + 1];
    if (played >= 0.99 && nextSong) {
      setPlayed(0);
      dispatch({ type: "SET_SONG", payload: { song: nextSong } });
    }
  }, [data.queue, played, dispatch, positionInQueue]);

  function handleTogglePlay() {
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  }

  function handleProgressChange(event, newValue) {
    setPlayed(newValue);
  }
  function handleSeekMouseDown() {
    setSeeking(true);
  }

  function handleSeekMouseUp() {
    setSeeking(false);
    reactPlayerRef.current.seekTo(played);
  }

  function formatTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }

  function handlePrev() {
    const prevSong = data.queue[positionInQueue - 1];
    if (prevSong) {
      dispatch({ type: "SET_SONG", payload: { song: prevSong } });
    }
  }

  function handleNext() {
    const nextSong = data.queue[positionInQueue + 1];
    if (nextSong) {
      dispatch({ type: "SET_SONG", payload: { song: nextSong } });
    }
  }

  return (
    <div>
      <Card variant="outlined" className={classes.container}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography variant="h5" color="textPrimary">
              {state.song.title}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {state.song.artist}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <IconButton onClick={handlePrev}>
              <SkipPrevious />
            </IconButton>
            <IconButton onClick={handleTogglePlay}>
              {state.isPlaying ? (
                <Pause className={classes.playIcon} />
              ) : (
                <PlayArrow className={classes.playIcon} />
              )}
            </IconButton>
            <IconButton onClick={handleNext}>
              <SkipNext />
            </IconButton>
            <Typography
              variant="h5"
              style={{
                color: "#76ff03",
              }}
            >
              {formatTime(playedSeconds)}
            </Typography>
          </div>
          <Slider
            onMouseDown={handleSeekMouseDown}
            onMouseUp={handleSeekMouseUp}
            onChange={handleProgressChange}
            value={played}
            type="range"
            min={0}
            max={1}
            step={0.01}
          />
        </div>
        <ReactPlayer
          ref={reactPlayerRef}
          onProgress={({ played, playedSeconds }) => {
            if (!seeking) {
              setPlayed(played);
              setPlayedSeconds(playedSeconds);
            }
          }}
          hidden
          playing={state.isPlaying}
          url={state.song.url}
        />
        <CardMedia className={classes.thumbnail} image={state.song.thumbnail} />
      </Card>
      <QueuedSongList queue={data.queue} />
    </div>
  );
};

export default SongPlayer;
