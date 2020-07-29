import React, {useState, useEffect} from "react";
import LinearProgress from '@material-ui/core/LinearProgress';
import PropsType from "prop-types";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: 1
    },
    hide: {
        display: 'none'
    }
});

const CustomLinearProgress = ({loading, classes}) => {
    const [completed, setCompleted] = useState(0);
    const [isShow, setIsShow] = useState(true);

    const progress = () => {
        setCompleted(oldCompleted => {
            if (completed === 100) {
                return 0;
            }
            const diff = Math.random() * 10;
            return Math.min(oldCompleted + diff, 100);
        });
    };

    useEffect(() => {
        let timer;
        if (loading) {
            timer = setInterval(progress, 500);
        } else {
            timer = setInterval(progress, 1);
        }

        return () => {
            clearInterval(timer);
        };
        //eslint-disable-next-line
    }, [loading]);

    const clearShow = () => {
        setTimeout(() => setIsShow(false), 500);
    };

    if (completed === 100) {
        clearShow();
    }

    return (
        <>
            {isShow && (
                <div className={classes.root}>
                    <LinearProgress variant="determinate" value={completed}/>
                </div>
            )}
        </>
    );
};

CustomLinearProgress.propsType = {
    loading: PropsType.bool.isRequired
};

export default withStyles(styles)(CustomLinearProgress);