import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Grid} from "@material-ui/core";
import PropsType from "prop-types";

const CustomCircularProgress = ({height}) => {
    return (
        <Grid container justify={"center"} alignItems={"flex-start"} style={{height: height}}>
            <CircularProgress/>
        </Grid>
    )
};

CustomCircularProgress.propsType = {
    height: PropsType.number.isRequired
};

export default CustomCircularProgress;