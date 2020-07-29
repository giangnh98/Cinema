import React from 'react';
import { Divider, Typography, Link } from '@material-ui/core';
import useStyles from './styles';

const Footer = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Divider />
            <Typography className={classes.copyright} variant="body1">
                &copy; River Pink. 2020
            </Typography>
            <Typography variant="caption">
                Crafted with love |{' '}
                <Link href="https://www.facebook.com/giang.hong.nguyen1998" target="_blank" rel="noopener">
                    River Pink
                </Link>
            </Typography>
        </div>
    );
};

export default Footer;