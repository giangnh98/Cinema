import React from "react";
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogContentText,
   DialogActions,
   Button
} from "@material-ui/core";

const ConfirmDialog = (props) => {
   const { open, handleClose, handleConfirm } = props;

   return (
      <Dialog
         open={open}
         onClose={handleClose}
      >
         <DialogTitle>
            Delete Record
         </DialogTitle>
         <DialogContent>
            <DialogContentText>
               Are you sure you want to delete this record?
            </DialogContentText>
         </DialogContent>
         <DialogActions>
            <Button onClick={handleClose} color="primary" variant="outlined">
               Cancel
            </Button>
            <Button onClick={handleConfirm} color="secondary" variant="outlined">
               Delete
            </Button>
         </DialogActions>
      </Dialog>
   );
};

export default ConfirmDialog;