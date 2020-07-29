import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CustomPager from "../Paper/Paper";
import {makeStyles} from "@material-ui/core/styles";
// Component styles
const styles = () => ({
    root: {
        display: 'flex',
        flexDirection: 'column'
    }
});

const Portlet = props => {
    const classes = makeStyles(styles);
    const {className, children, ...rest} = props;
    const rootClassName = classNames(classes.root, className);

    return (
        <CustomPager
            {...rest}
            className={rootClassName}
            elevation={0}
            outlined
            squared={false}>
            {children}
        </CustomPager>
    );
};
Portlet.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

export default Portlet;
