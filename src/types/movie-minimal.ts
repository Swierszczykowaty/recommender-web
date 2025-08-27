import { Movie } from "./movie"; // Adjust the path if needed

export type MinimalMovie = Pick<
  Movie,
  "id" | "title" | "poster_path" | "release_date" | "vote_average" | "genres"
>;
