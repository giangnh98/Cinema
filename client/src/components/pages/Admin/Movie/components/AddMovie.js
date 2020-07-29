import React, { useState } from "react";
import { withStyles, Button, Typography, TextField } from "@material-ui/core";
import { makeStyles, AntSwitch } from "./styles";
import classNames from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { regexUrl } from "../../../../../ultils/utils";
import YouTube from "react-youtube";
import { saveMovie, updateMovie } from "../../../../../store/movie/movie.thunk";
import moment from "moment";

const AddMovie = (props) => {
   const { classes, className, loading, saveMovie, updateMovie, selectedMovie } = props;
   const rootClassName = classNames(classes.root, className);
   const [movie, setMovie] = useState({
      title: "",
      region: "",
      description: "",
      genre: "",
      videoId: "",
      image: "",
      director: "",
      duration: "",
      started: "",
      src: false
   });
   const [message, setMessage] = useState({
      title: "",
      region: "",
      description: "",
      genre: "",
      videoId: "",
      image: "",
      director: "",
      duration: ""
   });

   React.useEffect(() => {
      if (selectedMovie) {
         setMovie({
            ...movie,
            title: selectedMovie.title,
            region: selectedMovie.region,
            description: selectedMovie.description,
            genre: selectedMovie.genre,
            videoId: selectedMovie.videoId,
            image: selectedMovie.image,
            director: selectedMovie.director,
            duration: selectedMovie.duration,
            started: moment(selectedMovie.started).format("YYYY-MM-DD"),
         });
      }
      //eslint-disable-next-line
   }, []);

   const isValid = (message.title !== "" || message.region !== ""
      || message.description !== "" || message.genre !== ""
      || message.videoId !== "" || message.image !== ""
      || message.director !== "" || message.duration !== "");

   const showErrors = (e, error) => setMessage({ ...message, [e.target.name]: error });

   const onTitleChange = (e) => {
      setMovie({ ...movie, [e.target.name]: e.target.value });
      if (e.target.name === "title"
         && e.target.value.length > 0
         && (e.target.value.length < 10 || e.target.value.length > 200)) {
         showErrors(e, "Movie Name must be greater than 10 characters and less than 200 characters.");
      } else {
         showErrors(e, "");
      }
   };

   const onChange = (e) => {
      setMovie({ ...movie, [e.target.name]: e.target.value });
   };

   const onDescriptionChange = (e) => {
      setMovie({ ...movie, [e.target.name]: e.target.value });
      if (e.target.name === "description"
         && e.target.value.length > 0
         && (e.target.value.length < 10 || e.target.value.length > 1000)) {
         showErrors(e, "Movie Description must be greater than 10 characters and less than 1000 characters.");
      } else {
         showErrors(e, "");
      }
   };

   const onImageChange = (e) => {
      setMovie({ ...movie, [e.target.name]: e.target.value });
      if (e.target.name === "image"
         && e.target.value.length > 0
         && regexUrl.exec(e.target.value) === null) {
         showErrors(e, "Image not matches with http or https.");
      } else {
         showErrors(e, "");
      }
   };

   const onDurationChange = (e) => {
      setMovie({ ...movie, [e.target.name]: e.target.value });
      if (isNaN(e.target.value)) {
         showErrors(e, "Duration must be Numeric.");
      } else {
         showErrors(e, "");
      }
   };

   const addDefaultSrc = (e) => {
      setMovie({ ...movie, src: false });
      e.target.src = "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1024x576.png";
      e.target.onerror = null;
   };

   const checkImageLoad = (e) => {
      if (e.target.src === "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1024x576.png") {
         setMovie({ ...movie, src: false });
      } else {
         setMovie({ ...movie, src: true });
      }
   };

   const onAddMovie = (e) => {
      e.preventDefault();
      const { title, region, description, genre, videoId, image, director, duration, started } = movie;
      saveMovie({
         title, region, description, genre, videoId, image, director, duration, started
      });
   };

   const onUpdateMovie = (e, id) => {
      e.preventDefault();
      const { title, region, description, genre, videoId, image, director, duration, started } = movie;
      updateMovie(
         id,
         {
            title, region, description, genre, videoId, image, director, duration, started
         }
      );
   };

   const title = selectedMovie ? "Edit Movie" : "Add Movie";
   const submitButton = selectedMovie ? "Update Movie" : "Add Movie";
   const submitAction = selectedMovie
      ? (e) => onUpdateMovie(e, selectedMovie.id)
      : (e) => onAddMovie(e);

   return (
      <div className={rootClassName}>
         {loading && (
            <Grid container justify={"center"} alignItems={"center"}>
               <CircularProgress color="secondary"/>
            </Grid>
         )}
         <Typography variant="h4" className={classes.title}>
            {title}
         </Typography>
         <form onSubmit={submitAction}>
            <div className={classes.field}>
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Movie Name"
                  margin="dense"
                  name="title"
                  required
                  value={movie.title}
                  onChange={onTitleChange}
                  error={message.title !== ""}
                  helperText={message.title || "Please specify the Movie Name"}
                  variant="outlined"
                  rowsMax={1}
                  inputProps={{
                     minLength: 10,
                     maxLength: 200
                  }}
               />
            </div>
            <div className={classes.field}>
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Region"
                  margin="dense"
                  name="region"
                  value={movie.region}
                  error={message.region !== ""}
                  helperText={message.region}
                  onChange={onChange}
                  variant="outlined"
                  required
                  rowsMax={1}
               />
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Duration"
                  margin="dense"
                  name="duration"
                  value={movie.duration}
                  error={message.duration !== ""}
                  helperText={message.duration}
                  variant="outlined"
                  onChange={onDurationChange}
                  required
                  rowsMax={1}
               />
            </div>
            <div className={classes.field}>
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Image"
                  margin="dense"
                  name="image"
                  value={movie.image}
                  error={message.image !== ""}
                  helperText={message.image}
                  variant="outlined"
                  onChange={onImageChange}
                  required
                  rowsMax={1}
               />
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="VideoId"
                  margin="dense"
                  name="videoId"
                  value={movie.videoId}
                  error={message.videoId !== ""}
                  helperText={message.videoId}
                  variant="outlined"
                  onChange={onChange}
                  required
                  rowsMax={1}
               />
            </div>
            <div className={classes.field}>
               <div className={classes.textField}>
                  <img
                     className={classes.img}
                     style={{ paddingRight: 20 }}
                     src={movie.image}
                     onLoad={e => checkImageLoad(e)}
                     onError={e => addDefaultSrc(e)}
                     alt={""}
                  />
               </div>
               <div className={classes.textField}>
                  <div style={{ width: "400px", paddingRight: 20 }}>
                     <YouTube videoId={movie.videoId} opts={{ width: "100%", height: "255px" }}/>
                  </div>
               </div>
            </div>
            <div className={classes.field}>
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Genre"
                  margin="dense"
                  name="genre"
                  value={movie.genre}
                  error={message.genre !== ""}
                  helperText={message.genre}
                  variant="outlined"
                  onChange={onChange}
                  required
                  rowsMax={1}
               />
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Director"
                  margin="dense"
                  name="director"
                  value={movie.director}
                  error={message.director !== ""}
                  helperText={message.director}
                  variant="outlined"
                  onChange={onChange}
                  required
                  rowsMax={1}
               />
            </div>
            <div className={classes.field}>
               <TextField
                  id="date"
                  label="Start Date"
                  type="date"
                  name="started"
                  value={movie.started}
                  className={classes.textField}
                  required
                  onChange={onChange}
                  variant="outlined"
                  InputLabelProps={{
                     shrink: true
                  }}
               />
            </div>
            <div className={classes.field}>
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Description"
                  margin="dense"
                  name="description"
                  value={movie.description}
                  variant="outlined"
                  onChange={onDescriptionChange}
                  error={message.description !== ""}
                  helperText={message.description}
                  multiline
                  rows="10"
                  required
               />
            </div>
            <Button
               className={classes.buttonFooter}
               color="primary"
               type="submit"
               variant="contained"
               disabled={isValid || loading || !movie.src}>
               {submitButton}
            </Button>
         </form>
      </div>
   );
};

const mapStateToProps = state => ({
   loading: state.movieState.loading
});

const mapDispatchToProps = {
   saveMovie,
   updateMovie
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(makeStyles)(AddMovie));