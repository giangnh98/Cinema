import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Typography} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center'
    },
    icon: {
        fontSize: '1.3rem',
        marginRight: theme.spacing(1),
        color: theme.palette.text.secondary,
        alignItems: 'center',
        display: 'flex'
    },
    title: {
        fontWeight: 500
    },
    subtitle: {
        fontWeight: 400,
        marginLeft: theme.spacing(1),
        color: theme.palette.text.secondary
    }
}));

const PortletLabel = props => {
    const {className, icon, title, subtitle, ...rest} = props;
    const classes = useStyles();

    const rootClassName = classNames(classes.root, className);

    return (
        <div {...rest} className={rootClassName}>
            {icon && <span className={classes.icon}>{icon}</span>}
            {title && (
                <Typography className={classes.title} variant="h5">
                    {title}
                </Typography>
            )}
            {subtitle && (
                <Typography className={classes.subtitle} variant="subtitle2">
                    {subtitle}
                </Typography>
            )}
        </div>
    );
};

PortletLabel.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    icon: PropTypes.node,
    subtitle: PropTypes.string,
    title: PropTypes.string
};

export default PortletLabel;