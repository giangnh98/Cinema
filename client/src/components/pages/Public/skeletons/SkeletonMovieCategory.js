import React from "react";
import {Grid} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

const SkeletonMovieCategory = () => {
    return (
        <Grid container>
            <>
                <Grid
                    container
                    item
                    xs={12}
                    style={{marginTop: 200}}
                    direction="row"
                    justify="center"
                    spacing={2}>
                    <Grid item>
                        <Skeleton variant="text" width={400} height={30}/>
                        <Skeleton variant="text" width={200} height={30}/>
                        <Skeleton variant="text" width={300} height={30}/>
                        <Skeleton variant="text" width={400} height={250}/>
                    </Grid>
                    <Grid item>
                        <Skeleton variant="rect" width={400} height={350}/>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    style={{marginTop: 20}}
                    direction="row"
                    justify="center"
                    spacing={2}>
                    <Grid item>
                        <Skeleton variant="text" width={400} height={30}/>
                        <Skeleton variant="text" width={200} height={30}/>
                        <Skeleton variant="text" width={300} height={30}/>
                        <Skeleton variant="text" width={400} height={250}/>
                    </Grid>
                    <Grid item>
                        <Skeleton variant="rect" width={400} height={350}/>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    style={{marginTop: 20}}
                    direction="row"
                    justify="center"
                    spacing={2}>
                    <Grid item>
                        <Skeleton variant="text" width={400} height={30}/>
                        <Skeleton variant="text" width={200} height={30}/>
                        <Skeleton variant="text" width={300} height={30}/>
                        <Skeleton variant="text" width={400} height={250}/>
                    </Grid>
                    <Grid item>
                        <Skeleton variant="rect" width={400} height={350}/>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    style={{marginTop: 20}}
                    direction="row"
                    justify="center"
                    spacing={2}>
                    <Grid item>
                        <Skeleton variant="text" width={400} height={30}/>
                        <Skeleton variant="text" width={200} height={30}/>
                        <Skeleton variant="text" width={300} height={30}/>
                        <Skeleton variant="text" width={400} height={250}/>
                    </Grid>
                    <Grid item>
                        <Skeleton variant="rect" width={400} height={350}/>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    style={{marginTop: 20}}
                    direction="row"
                    justify="center"
                    spacing={2}>
                    <Grid item>
                        <Skeleton variant="text" width={400} height={30}/>
                        <Skeleton variant="text" width={200} height={30}/>
                        <Skeleton variant="text" width={300} height={30}/>
                        <Skeleton variant="text" width={400} height={250}/>
                    </Grid>
                    <Grid item>
                        <Skeleton variant="rect" width={400} height={350}/>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    style={{marginTop: 20, paddingBottom: 50}}
                    direction="row"
                    justify="center"
                    spacing={2}>
                    <Grid item>
                        <Skeleton variant="text" width={400} height={30}/>
                        <Skeleton variant="text" width={200} height={30}/>
                        <Skeleton variant="text" width={300} height={30}/>
                        <Skeleton variant="text" width={400} height={250}/>
                    </Grid>
                    <Grid item>
                        <Skeleton variant="rect" width={400} height={350}/>
                    </Grid>
                </Grid>
            </>
        </Grid>
    )
};

export default SkeletonMovieCategory;