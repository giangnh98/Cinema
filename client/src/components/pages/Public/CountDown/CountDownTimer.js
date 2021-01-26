import React from "react";
import Countdown from "react-countdown-now";
import Typography from "@material-ui/core/Typography";
import {Box} from "@material-ui/core";

const Completionist = () => <span>You are good to go!</span>;

const renderer = ({minutes, seconds, completed}) => {
    if (completed) {
        // Render a complete state
        return <Completionist/>;
    } else {
        // Render a countdown
        return (
            <Box width={1} style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
            }}>
                <Box style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                }}>
                    <Typography variant="h4" style={{
                        marginRight: 20,
                        fontSize: 15
                    }}>
                        Time for checkout
                    </Typography>
                    <Typography variant="h6" style={{
                        fontSize: 12
                    }}>
                        ( minutes : seconds )
                    </Typography>
                </Box>
                <Box style={{
                    backgroundColor: '#03A9F4',
                    width: '100px',
                    display: "flex",
                    justifyContent: "center",
                    padding: '8px',
                    borderRadius: '10px',
                }}>
                    <Typography variant="h4" component="h4">
                        {minutes} : {seconds}
                    </Typography>
                </Box>
            </Box>
        );
    }
};

const CountDownTimer = ({timer}) => {
    return (
        <Countdown date={Date.now() + timer} renderer={renderer}/>
    )
};

export default CountDownTimer;