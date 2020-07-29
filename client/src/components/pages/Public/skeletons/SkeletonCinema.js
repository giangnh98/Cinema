import React from "react";
import {Container, Grid, Typography} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import Box from "@material-ui/core/Box";

const SkeletonCinema = () => {

    // noinspection JSMismatchedCollectionQueryUpdate
    let rows = [];
    for (let it = 0; it < 8; ++it) {
        rows.push(
            <Grid item xs={12} md={4} lg={3} key={`cinema-${it}-cgv`}>
                <Box style={{
                    maxWidth: '100%',
                    paddingBottom: 16,
                    height: 450,
                    borderRadius: '10px',
                    cursor: 'pointer',
                }}>
                    <Skeleton variant={"rect"} height={200}/>
                    <Box style={{
                        padding: 24
                    }}>
                        <Skeleton variant={"text"} width={"80%"}/>
                        <Skeleton variant={"text"} style={{padding: 10}}/>
                        <Skeleton variant={"text"} width={"20%"}/>
                        <Skeleton variant={"text"} style={{marginTop: 20}} width={"50%"}/>
                    </Box>
                </Box>
            </Grid>
        );
    }

    return (
        <Container maxWidth="xl">
            <Grid container spacing={2} style={{marginBottom: 50}}>
                <Grid item xs={12}>
                    <Typography style={{
                        fontSize: '3rem',
                        lineHeight: '3rem',
                        textAlign: 'center',
                        marginTop: '120px',
                        marginBottom: '24px'
                    }} variant="h2" color="inherit">
                        Our Cinemas
                    </Typography>
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    alignItems="center"
                    justify="flex-start"
                    spacing={2}>
                    {rows}
                </Grid>
            </Grid>
        </Container>
    )
};

export default SkeletonCinema;