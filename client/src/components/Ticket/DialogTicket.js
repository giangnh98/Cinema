import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";

const DialogTicket = (props) => {
   const { open, handleClose, title, children } = props;

   return (
      <Dialog
         open={open}
         onClose={handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
      >
         <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
         <DialogContent>
            {children}
         </DialogContent>
         <DialogActions>
            <Button onClick={handleClose} color="primary">
               Close
            </Button>
         </DialogActions>
      </Dialog>
   );
};

DialogTicket.propTypes = {
   children: PropTypes.node ,
   open: PropTypes.bool.isRequired,
   title: PropTypes.string.isRequired,
   handleClose: PropTypes.func.isRequired
};

export default DialogTicket;