import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {makeStyles} from "@material-ui/core/styles";

// Component styles
const useStyles = makeStyles(theme => ({
    root: {
        paddingBottom: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        borderTop: `1px solid ${theme.palette.border}`,
        borderBottomLeftRadius: '2px',
        borderBottomRightRadius: '2px'
    },
    noDivider: {
        borderTop: 'none'
    }
}));

const PortletFooter = props => {
    const {className, noDivider, children, ...rest} = props;
    const classes = useStyles();

    const rootClassName = classNames(
        {
            [classes.root]: true,
            [classes.noDivider]: noDivider
        },
        className
    );

    return (
        <div {...rest} className={rootClassName}>
            {children}
        </div>
    );
};

PortletFooter.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    noDivider: PropTypes.bool
};

export default PortletFooter;
