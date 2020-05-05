import React from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
} from "@material-ui/core";
import { Link, Add } from "@material-ui/icons";
import YouTubePlayer from "react-player";
import SoundCloudPlayer from "react-player";
import ReactPlayer from "react-player";
import { ADD_SONG } from "../graphql/mutations";
import { useMutation } from "@apollo/react-hooks";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
  },
  urlInput: {
    marginRight: theme.spacing(1),
  },
  dialog: {
    textAlign: "center",
  },
  thumbnail: {
    width: "90%",
  },
}));

const AddSong = () => {
  const [addSong, { error }] = useMutation(ADD_SONG);
  const [url, setUrl] = React.useState("");
  const classes = useStyles();
  const [dialog, setDialog] = React.useState(false);
  const [playable, setPlayable] = React.useState(false);
  const [song, setSong] = React.useState({
    title: "",
    artist: "",
    thumbnail: "",
    duration: 0,
  });

  React.useEffect(() => {
    const isPlayable =
      SoundCloudPlayer.canPlay(url) || YouTubePlayer.canPlay(url);
    setPlayable(isPlayable);
  }, [url]);

  function handleToggleDialog() {
    setDialog(true);
  }

  function handleCloseDialog() {
    setDialog(false);
  }

  //populate dialog

  async function handleEditSong({ player }) {
    const nestedPlayer = player.player.player;
    let songData;
    if (nestedPlayer.getVideoData) {
      songData = getYouTubeInfo(nestedPlayer);
    } else if (nestedPlayer.getCurrentSound) {
      const songData = await getSoundcloudInfo(nestedPlayer);
    }
    setSong({ ...songData, url });
  }

  function getYouTubeInfo(player) {
    const duration = player.getDuration();
    const { title, author, video_id } = player.getVideoData();
    const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
    return {
      duration,
      title,
      artist: author,
      thumbnail,
    };
  }

  function getSoundcloudInfo(player) {
    return new Promise((resolve) => {
      player.getCurrentSound((songData) => {
        if (songData) {
          resolve({
            duration: Number(songData.duration / 1000),
            title: songData.title,
            artist: songData.user.username,
            thumbnail: songData.artwork_url.replace("-large", "t500x500"),
          });
        }
      });
    });
  }

  function handleTextSong(event) {
    const { name, value } = event.target;
    setSong((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleAddSong() {
    try {
      const { url, title, artist, thumbnail, duration } = song;
      await addSong({
        variables: {
          url: url.length > 0 ? url : null,
          title: title.length > 0 ? title : null,
          thumbnail: thumbnail.length > 0 ? thumbnail : null,
          duration: duration > 0 ? duration : null,
          artist: artist.length > 0 ? artist : null,
        },
      });
      handleCloseDialog();
      setSong({
        title: "",
        artist: "",
        thumbnail: "",
        duration: 0,
      });
      setUrl("");
    } catch (error) {
      console.error("Error adding song", error);
    }
  }

  function handleError(field) {
    return error && error.graphQLErrors[0].extensions.path.includes(field);
  }

  const { title, artist, thumbnail } = song;

  return (
    <div className={classes.container}>
      <Dialog
        open={dialog}
        onClose={handleCloseDialog}
        className={classes.dialog}
      >
        <DialogTitle
          style={{
            color: "#76ff03",
          }}
        >
          EDIT SONG
        </DialogTitle>
        <DialogContent>
          <img
            src={thumbnail}
            alt="song thumbnail"
            className={classes.dialog}
          />

          <TextField
            helperText={handleError("title") && "Fill out this field"}
            error={handleError("title")}
            onChange={handleTextSong}
            value={title}
            margin="normal"
            name="title"
            label="Title"
            className={classes.thumbnail}
          />
          <TextField
            helperText={handleError("artist") && "Fill out this field"}
            error={handleError("artist")}
            onChange={handleTextSong}
            value={artist}
            margin="normal"
            name="artist"
            label="Artist"
            className={classes.thumbnail}
          />
          <TextField
            helperText={handleError("thumbnail") && "Fill out this field"}
            error={handleError("thumbnail")}
            onChange={handleTextSong}
            value={thumbnail}
            margin="normal"
            name="thumbnail"
            label="Thumbnail"
            className={classes.thumbnail}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddSong}
            variant="outlined"
            color="primary"
            className={classes.urlInput}
          >
            Add Song
          </Button>
        </DialogActions>
      </Dialog>
      <TextField
        onChange={(event) => setUrl(event.target.value)}
        value={url}
        placeholder="Paste your youtube or soundcloud URL"
        fullWidth
        type="url"
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment>
              <Link className={classes.urlInput} />
            </InputAdornment>
          ),
        }}
        className={classes.urlInput}
      />
      <Button
        disabled={!playable}
        variant="outlined"
        color="primary"
        endIcon={<Add />}
        onClick={handleToggleDialog}
      >
        Add
      </Button>
      <ReactPlayer hidden url={url} onReady={handleEditSong} />
    </div>
  );
};

export default AddSong;
