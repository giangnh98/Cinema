import React, {Fragment} from "react";
import {Box} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Skeleton from "@material-ui/lab/Skeleton";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    h2: {
        fontSize: '2rem',
        color: theme.palette.common.white,
        margin: theme.spacing(3),
        textTransform: 'capitalize'
    }
}));

const SkeletonHome = () => {
    const classes = useStyles();
    return (
        <Fragment>
            <Skeleton variant="rect" height="85vh"/>
            <Box height={60}/>
            <Typography className={classes.h2} variant="h2" color="inherit">
                Suggested for you
            </Typography>
            <Grid container>
                <Grid item style={{margin: "0 70px 0 60px"}}>
                    <Skeleton variant="rect" width={350} height={370}/>
                    <Skeleton variant="text" width={300} height={30}/>
                </Grid>
                <Grid item style={{margin: "0 70px 0 0"}}>
                    <Skeleton variant="rect" width={350} height={370}/>
                    <Skeleton variant="text" width={300} height={30}/>
                </Grid>
                <Grid item style={{margin: "0 70px 0 0"}}>
                    <Skeleton variant="rect" width={350} height={370}/>
                    <Skeleton variant="text" width={300} height={30}/>
                </Grid>
            </Grid>
            <Typography className={classes.h2} variant="h2" color="inherit">
                Now Showing
            </Typography>
            <Grid container>
                <Grid item style={{margin: "0 70px 0 60px"}}>
                    <Skeleton variant="rect" width={350} height={370}/>
                    <Skeleton variant="text" width={300} height={30}/>
                </Grid>
                <Grid item style={{margin: "0 70px 0 0"}}>
                    <Skeleton variant="rect" width={350} height={370}/>
                    <Skeleton variant="text" width={300} height={30}/>
                </Grid>
                <Grid item style={{margin: "0 70px 0 0"}}>
                    <Skeleton variant="rect" width={350} height={370}/>
                    <Skeleton variant="text" width={300} height={30}/>
                </Grid>
            </Grid>
            <Typography className={classes.h2} variant="h2" color="inherit">
                Coming Soon
            </Typography>
            <Grid container style={{paddingBottom: 50}}>
                <Grid item style={{margin: "0 70px 0 60px"}}>
                    <Skeleton variant="rect" width={350} height={370}/>
                    <Skeleton variant="text" width={300} height={30}/>
                </Grid>
                <Grid item style={{margin: "0 70px 0 0"}}>
                    <Skeleton variant="rect" width={350} height={370}/>
                    <Skeleton variant="text" width={300} height={30}/>
                </Grid>
                <Grid item style={{margin: "0 70px 0 0"}}>
                    <Skeleton variant="rect" width={350} height={370}/>
                    <Skeleton variant="text" width={300} height={30}/>
                </Grid>
            </Grid>
        </Fragment>
    )
};

export default SkeletonHome;