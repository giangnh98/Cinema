import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {makeStyles} from "@material-ui/core/styles";

// Component styles
const useStyles = makeStyles(theme => ({
    root: {
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.border}`,
        borderTopLeftRadius: '2px',
        borderTopRightRadius: '2px',
        display: 'flex',
        height: '64px',
        justifyContent: 'space-between',
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        position: 'relative'
    },
    noDivider: {
        borderBottom: 'none'
    },
    noPadding: {
        padding: 0
    }
}));

const PortletHeader = props => {
    const {className, noDivider, noPadding, children, ...rest} = props;
    const classes = useStyles();

    const rootClassName = classNames(
        {
            [classes.root]: true,
            [classes.noDivider]: noDivider,
            [classes.noPadding]: noPadding
        },
        className
    );

    return (
        <div {...rest} className={rootClassName}>
            {children}
        </div>
    );
};

PortletHeader.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    noDivider: PropTypes.bool,
    noPadding: PropTypes.bool
};

export default PortletHeader;