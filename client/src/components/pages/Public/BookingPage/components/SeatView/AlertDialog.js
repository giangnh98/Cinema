import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { Typography } from '@material-ui/core';

export default function AlertDialog({ alert, handleClose }) {
  return (
    <Dialog
      fullWidth={true}
      open={alert.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ReportProblemOutlinedIcon style={{ fontSize: 50, color: 'red' }} />
          <Typography
            variant="h3"
            component="h3"
            style={{
              color: 'red',
              fontStyle: 'bold',
            }}
          >
            Error!!
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          style={{
            fontSize: 18,
            fontStyle: 'bold',
            textAlign: 'center',
          }}
        >
          {alert.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant={'outlined'}
          size={'large'}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
