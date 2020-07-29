import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from "../SnackbarContentWrapper/SnackbarContentWrapper";

const CustomizedSnackbar = props => {
    const {isOpen, vertical, horizontal, variant, message, removeAlert} = props;

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        removeAlert();
    };

    return (
        <Snackbar
            autoHideDuration={3000}
            anchorOrigin={{
                vertical,
                horizontal
            }}
            open={isOpen}
            onClose={handleClose}
            style={{marginTop: 50}}>
            <SnackbarContentWrapper
                style={{color: '#fff'}}
                variant={variant}
                message={message}
            />
        </Snackbar>
    );
};

CustomizedSnackbar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    vertical: PropTypes.string.isRequired,
    horizontal: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
    message: PropTypes.string.isRequired,
    removeAlert: PropTypes.func.isRequired
};
export default CustomizedSnackbar;