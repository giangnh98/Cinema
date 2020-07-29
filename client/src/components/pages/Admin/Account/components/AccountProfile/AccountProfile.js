import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import {Avatar, Typography, withStyles} from '@material-ui/core';
import Portlet from "../../../../../Portlet/Portlet";
import PortletContent from "../../../../../PortletContent/PortletContent";
// Component styles
import styles from "./styles";

const AccountProfile = (props) => {
    const {user, className, classes} = props;
    const rootClassName = classNames(classes.root, className);

    return (
        <Portlet className={rootClassName}>
            <PortletContent>
                <div className={classes.details}>
                    <div className={classes.info}>
                        <Typography variant="h2">{user.name}</Typography>
                        <Typography className={classes.emailText} variant="body1">
                            {user.email}
                        </Typography>
                        <Typography className={classes.dateText} variant="body1">
                            Join at : {moment(user.created).format('HH:mm a, dddd DD/MM/YYYY')}
                        </Typography>
                    </div>
                    <Avatar
                        className={classes.avatar}
                        src="https://cdn.24h.com.vn/upload/2-2020/images/2020-06-21/16-1592755417-735-width650height814.jpg"
                    />
                </div>
            </PortletContent>
        </Portlet>
    );
};

AccountProfile.propTypes = {
    className: PropTypes.string,
    user: PropTypes.object.isRequired
};

export default withStyles(styles)(AccountProfile);
