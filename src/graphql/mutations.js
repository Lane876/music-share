import { gql } from "apollo-boost";

export const ADD_OR_REMOVE_FROM_QUEUE = gql`
  mutation addOrRemoveFromQueue($input: SongInput!) {
    addOrRemoveFromQueue(input: $input) @client
  }
`;

export const ADD_SONG = gql`
  mutation addSong(
    $artist: String!
    $title: String!
    $thumbnail: String!
    $url: String!
    $duration: Float!
  ) {
    insert_songs(
      objects: {
        artist: $artist
        duration: $duration
        thumbnail: $thumbnail
        title: $title
        url: $url
      }
    ) {
      affected_rows
    }
  }
`;
