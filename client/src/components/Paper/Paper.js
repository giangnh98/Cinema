import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import { Paper } from '@material-ui/core';

// Component styles
const useStyles = makeStyles(theme => ({
    root: {
        borderRadius: '4px',
        maxWidth: '100%',
        border: 0,
        boxShadow: '0 10px 40px 0 rgba(16, 36, 94, 0.2)'
    },
    squared: {
        borderRadius: 0
    },
    outlined: {
        border: 0
    }
}));

const CustomPager = (props) => {
    const classes = useStyles();
    const { className, outlined, squared, children, ...rest } = props;

    const rootClassName = classNames(
        {
            [classes.root]: true,
            [classes.squared]: squared,
            [classes.outlined]: outlined
        },
        className
    );

    return (
        <Paper {...rest} className={rootClassName}>
            {children}
        </Paper>
    );
};

CustomPager.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    elevation: PropTypes.number,
    outlined: PropTypes.bool,
    squared: PropTypes.bool
};

CustomPager.defaultProps = {
    squared: false,
    outlined: true,
    elevation: 0
};

export default CustomPager;