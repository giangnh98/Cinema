import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {makeStyles} from "@material-ui/core/styles";

// Component styles
const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        flexGrow: 1,
        overflow: 'auto'
    },
    noPadding: {
        padding: 0
    }
}));

const PortletContent = props => {
    const {className, children, noPadding, ...rest} = props;
    const classes = useStyles();

    const rootClassName = classNames(
        {
            [classes.root]: true,
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

PortletContent.propTypes = {
    children: PropTypes.node,
    noPadding: PropTypes.bool
};

export default PortletContent;