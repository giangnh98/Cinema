import React from 'react';
import PropTypes from 'prop-types';
import {Typography, withStyles, Link} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const styles = theme => ({
    card: {
        maxWidth: 400,
        position: 'relative',
        maxHeight: 500,
        overflow: 'hidden',
        backgroundColor: 'transparent',
        borderRadius: 10,
        color: theme.palette.common.white,
        boxShadow: 'unset',
    },
    media: {
        height: 500,
        transition: '500ms ease-in-out',
        overflow: 'hidden',
        '&:hover': {
            opacity: '0.45',
            transform: 'scale(1.2)',
        }
    },
    text: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    h5: {
        textTransform: 'capitalize'
    }
});

const MovieCardSimple = props => {
    const {movie, classes} = props;

    return (
        <Link href={`/movie/${movie.id}?label=${movie.label}`} style={{textDecoration: 'none'}}>
            <Card className={classes.card}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={movie.image}
                        title={movie.title}
                    />
                    <CardContent className={classes.text}>
                        <Typography
                            className={classes.h5}
                            gutterBottom
                            variant="h5"
                            component="h2"
                            color="inherit">
                            {movie.title}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    );
};

MovieCardSimple.propTypes = {
    movie: PropTypes.object.isRequired
};

export default withStyles(styles)(MovieCardSimple);