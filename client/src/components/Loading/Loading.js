import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
    root: {background: theme.palette.common.black, height: '100vh'}
});

export default withStyles(styles)(({classes}) => {
    return <div className={classes.root}/>;
});
