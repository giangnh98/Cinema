import React, { useState } from "react";
import { withStyles, Button, Typography, TextField, MenuItem } from "@material-ui/core";
import styles from "./styles";
import classNames from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { regexUrl } from "../../../../../ultils/utils";
import { saveCinema, updateCinema } from "../../../../../store/cinema/cinema.thunk";
import { vnCity } from "../../../../data/City";

const AddCinema = (props) => {
   const { classes, className, loading, saveCinema, updateCinema, selectedCinema } = props;
   const rootClassName = classNames(classes.root, className);
   const [cinema, setCinema] = useState({
      name: "",
      address: "",
      star: "",
      image: "",
      city: "",
      src: false
   });
   const [message, setMessage] = useState({
      name: "",
      address: "",
      star: "",
      image: ""
   });

   React.useEffect(() => {
      if (selectedCinema) {
         setCinema({
            ...cinema,
            name: selectedCinema.name,
            address: selectedCinema.address,
            image: selectedCinema.image,
            star: selectedCinema.star,
            city: selectedCinema.city
         });
      }
      //eslint-disable-next-line
   }, []);

   const isValid = (message.address !== "" || message.name !== "" || message.star !== "" || message.image !== "");

   const showErrors = (e, error) => setMessage({ ...message, [e.target.name]: error });

   const onChange = (e) => {
      setCinema({ ...cinema, [e.target.name]: e.target.value });
      if (e.target.name === "name"
         && e.target.value.length > 0
         && (e.target.value.length < 10 || e.target.value.length > 200)) {
         showErrors(e, "Cinema Name must be greater than 10 characters and less than 200 characters.");
      } else {
         showErrors(e, "");
      }
   };

   const onAddressChange = (e) => {
      setCinema({ ...cinema, [e.target.name]: e.target.value });
      if (e.target.name === "address"
         && e.target.value.length > 0
         && (e.target.value.length < 10 || e.target.value.length > 300)) {
         showErrors(e, "Cinema address must be greater than 10 characters and less than 300 characters.");
      } else {
         showErrors(e, "");
      }
   };

   const onStartChange = (e) => {
      setCinema({ ...cinema, [e.target.name]: e.target.value });
      if (isNaN(e.target.value)) {
         showErrors(e, "Star must be Numeric.");
      } else if (e.target.name === "star"
         && parseFloat(e.target.value) > 0
         && parseFloat(e.target.value) > 5) {
         showErrors(e, "Star must be less than 5.0.");
      } else {
         showErrors(e, "");
      }
   };

   const onImageChange = (e) => {
      setCinema({ ...cinema, [e.target.name]: e.target.value });
      if (e.target.name === "image"
         && e.target.value.length > 0
         && regexUrl.exec(e.target.value) === null) {
         showErrors(e, "Image not matches with http or https.");
      } else {
         showErrors(e, "");
      }
   };

   const addDefaultSrc = (e) => {
      setCinema({ ...cinema, src: false });
      e.target.src = "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1024x576.png";
      e.target.onerror = null;
   };

   const checkImageLoad = (e) => {
      if (e.target.src === "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1024x576.png") {
         setCinema({ ...cinema, src: false });
      } else {
         setCinema({ ...cinema, src: true });
      }
   };

   const onAddCinema = (e) => {
      e.preventDefault();
      const { name, address, city, image, star } = cinema;
      saveCinema({
         name, address, city, image, star
      });
   };

   const onUpdateCinema = (e, id) => {
      e.preventDefault();
      const { name, address, city, image, star } = cinema;
      updateCinema(
         id,
         {
            name, address, city, image, star
         }
      );
   };

   const title = selectedCinema ? "Edit Cinema" : "Add Cinema";
   const submitButton = selectedCinema ? "Update Cinema" : "Add Cinema";
   const submitAction = selectedCinema
      ? (e) => onUpdateCinema(e, selectedCinema.id)
      : (e) => onAddCinema(e);

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
                  label="Cinema Name"
                  margin="dense"
                  name="name"
                  required
                  value={cinema.name}
                  onChange={onChange}
                  error={message.name !== ""}
                  helperText={message.name || "Please specify the Cinema Name"}
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
                  label="Address"
                  margin="dense"
                  name="address"
                  value={cinema.address}
                  error={message.address !== ""}
                  helperText={message.address}
                  onChange={onAddressChange}
                  variant="outlined"
                  required
                  rowsMax={1}
               />
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Start"
                  margin="dense"
                  name="star"
                  value={cinema.star}
                  variant="outlined"
                  onChange={onStartChange}
                  error={message.star !== ""}
                  helperText={message.star}
                  rowsMax={1}
                  required
               />
            </div>
            <div className={classes.field}>
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Image"
                  margin="dense"
                  name="image"
                  value={cinema.image}
                  error={message.image !== ""}
                  helperText={message.image}
                  variant="outlined"
                  onChange={onImageChange}
                  required
                  rowsMax={1}
               />
               <TextField
                  fullWidth
                  select
                  className={classes.textField}
                  value={cinema.city}
                  onChange={e => setCinema({ ...cinema, city: e.target.value })}
                  label="City"
                  required
                  variant="outlined">
                  {vnCity.map((city, index) => (
                     <MenuItem key={index} value={city}>
                        {city}
                     </MenuItem>
                  ))}
               </TextField>
            </div>
            <div className={classes.field}>
               <img
                  className={classes.img}
                  src={cinema.image}
                  onLoad={e => checkImageLoad(e)}
                  onError={e => addDefaultSrc(e)}
                  alt={""}
               />
            </div>
            <Button
               className={classes.buttonFooter}
               color="primary"
               type="submit"
               variant="contained"
               disabled={isValid || loading || !cinema.src}>
               {submitButton}
            </Button>
         </form>
      </div>
   );
};

const mapStateToProps = state => ({
   loading: state.cinemaState.loading
});

const mapDispatchToProps = {
   updateCinema,
   saveCinema
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddCinema));