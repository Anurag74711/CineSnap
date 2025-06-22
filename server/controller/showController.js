import axios from 'axios';
import Movie from '../models/Movies.js';
import Show from '../models/Show.js';

// Fetch now playing movies from TMDB
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    });

    const movies = data.results;
    res.json({ success: true, movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error?.response?.data?.status_message || error.message || 'Unknown error occurred',
    });
  }
};

// Add new show to database
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    if (!movieId || !Array.isArray(showsInput) || !showPrice) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    let movie = await Movie.findById(movieId);

    if (!movie) {
      const [detailsRes, creditsRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
      ]);

      const movieApiData = detailsRes.data;
      const movieCreditsData = creditsRes.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || '',
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };

      movie = await Movie.create(movieDetails);
    }

    const showsToCreate = [];
    showsInput.forEach(({ date, time }) => {
      if (Array.isArray(time)) {
        time.forEach((t) => {
          const dateTimeString = `${date}T${t}`;
          showsToCreate.push({
            movie: movieId,
            showDateTime: new Date(dateTimeString),
            showPrice,
            occupiedSeats: {},
          });
        });
      }
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.json({ success: true, message: 'Show added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error?.response?.data?.status_message || error.message || 'Unknown error occurred',
    });
  }
};

// Get upcoming shows for all movies
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 });

    const uniqueMovies = new Map();
    shows.forEach((show) => {
      if (!uniqueMovies.has(show.movie._id.toString())) {
        uniqueMovies.set(show.movie._id.toString(), show.movie);
      }
    });

    res.json({ success: true, shows: Array.from(uniqueMovies.values()) });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error?.response?.data?.status_message || error.message || 'Unknown error occurred',
    });
  }
};

// Get shows for a specific movie
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } });
    const movie = await Movie.findById(movieId);

    const dateTime = {};
    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split('T')[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({ time: show.showDateTime.toISOString().split('T')[1], showId: show._id });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error?.response?.data?.status_message || error.message || 'Unknown error occurred',
    });
  }
};

