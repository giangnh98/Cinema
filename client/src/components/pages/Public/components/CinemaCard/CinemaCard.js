import React from 'react';
import classNames from 'classnames';
import {Typography, withStyles} from '@material-ui/core';
import CustomPager from "../../../../Paper/Paper";
//import styles
import styles from "./styles";

const CinemaCard = (props) => {
    const {className, cinema, classes} = props;
    const cinemaImage =
        cinema && cinema.image
            ? cinema.image
            : 'https://source.unsplash.com/featured/?cinema';

    const rootClassName = classNames(classes.root, className);
    return (
        <CustomPager className={rootClassName}>
            <div className={classes.imageWrapper}>
                <div className={classes.star}>
                    <Typography variant="h4" style={{fontSize: 15}}>
                        {parseFloat(cinema.star)} / 5
                    </Typography>
                </div>
                <img alt="cinema" className={classes.image} src={cinemaImage}/>
            </div>
            <div className={classes.details}>
                <Typography className={classes.name} variant="h4">
                    {cinema.name}
                </Typography>
                <Typography variant="body1" className={classes.address}>
                    {cinema.address}
                </Typography>
                <Typography className={classes.city} variant="body1">
                    {cinema.city}
                </Typography>
            </div>
            {/*<div className={classes.stats}>*/}
            {/*    <EventSeat className={classes.eventIcon}/>*/}
            {/*    <Typography className={classes.eventText} variant="body2">*/}
            {/*        {cinema.seatsAvailable} seats Available*/}
            {/*    </Typography>*/}
            {/*</div>*/}
        </CustomPager>
    );
};

export default withStyles(styles)(CinemaCard);