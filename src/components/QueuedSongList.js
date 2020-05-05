import React from "react";
import {
  Typography,
  Avatar,
  IconButton,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { useMutation } from "@apollo/react-hooks";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";

const QueuedSongList = ({ queue }) => {
  console.log({ queue });
  const graterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  // const song = {
  //   title: "Lunne",
  //   artist: "Moon",
  //   thumbnail: "http://img.youtube.com/vi/--ZtUFsIgMk/0.jpg",
  // };

  return (
    graterThanMd && (
      <div>
        <Typography variant="button" color="textSecondary">
          QUEUE ({queue.length})
        </Typography>
        {queue.map((song, i) => (
          <QueuedSongs key={i} song={song} />
        ))}
      </div>
    )
  );
};

const useStyles = makeStyles({
  container: {
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateColumns: "50px auto 50px",
    gridGap: "12px",
    alignItems: "center",
    marginTop: "10px",
  },
  avatar: {
    height: "44px",
    width: "44px",
  },
  text: {
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  songInfo: {
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
});

function QueuedSongs({ song }) {
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
    },
  });
  const classes = useStyles();
  const { title, artist, thumbnail } = song;

  function handleAddOrRemoveFromQueue() {
    addOrRemoveFromQueue({
      variables: {
        input: { ...song, __typename: "Song" },
      },
    });
  }

  return (
    <div className={classes.container}>
      <Avatar src={thumbnail} className={classes.avatar} />
      <div className={classes.songInfo}>
        <Typography variant="subtitle1" className={classes.text}>
          {title}
        </Typography>
        <Typography variant="subtitle2" className={classes.text}>
          {artist}
        </Typography>
      </div>
      <IconButton onClick={handleAddOrRemoveFromQueue}>
        <Clear color="secondary" />
      </IconButton>
    </div>
  );
}

export default QueuedSongList;
