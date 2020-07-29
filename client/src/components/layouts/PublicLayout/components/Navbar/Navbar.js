import React, {Fragment, useState, useEffect} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import classnames from 'classnames';
import {Typography, List, ListItem, withStyles} from '@material-ui/core';
// Component styles
import styles from './styles';
import UserPopover from './components/UserPopover/UserPopover';
import { connect } from "react-redux";
import { logout } from "../../../../../store/user/user.thunk";

const Navbar = (props) => {
    const {classes, isAuthenticated, user, logout} = props;
    const [showMenu, setShowMenu] = useState(false);
    const [scrollPos, setScrollPos] = useState(window.pageYOffset);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
        //eslint-disable-next-line
    }, []);

    const handleScroll = () => {
        setScrollPos(window.pageYOffset);
    };

    const onLogout = () => {
        logout();
    };

    return (
        <Fragment>
            <nav
                className={classnames({
                    [classes.navbar]: true,
                    [classes.navbarColor]: scrollPos > 30
                })}>
                <RouterLink className={classes.logoLink} to="/">
                    <Typography className={classes.logo} variant="h2">
                        Cinema +
                    </Typography>
                </RouterLink>
                <div className={classes.navLinks}>
                    <RouterLink className={classes.navLink} to="/">
                        Home
                    </RouterLink>
                    <RouterLink className={classes.navLink} to="/movies/category/nowShowing">
                        Now Showing
                    </RouterLink>
                    <RouterLink className={classes.navLink} to="/movies/category/comingSoon">
                        Coming Soon
                    </RouterLink>
                    <RouterLink className={classes.navLink} to="/cinemas">
                        Cinemas
                    </RouterLink>
                </div>

                <div className={classes.navAccount}>
                    <UserPopover logout={logout}>
                        <List component="nav">
                            {user && (
                                <ListItem>
                                    <RouterLink
                                        className={classes.navLink}
                                        to={
                                            user.role !== 'guest'
                                                ? '/admin/dashboard'
                                                : '/myDashboard'
                                        }>
                                        Dashboard
                                    </RouterLink>
                                </ListItem>
                            )}

                            {isAuthenticated ? (
                                <ListItem>
                                    <RouterLink className={classes.navLink} onClick={onLogout} to="/">
                                        Logout
                                    </RouterLink>
                                </ListItem>
                            ) : (
                                <ListItem>
                                    <RouterLink className={classes.navLink} to="/login">
                                        Login
                                    </RouterLink>
                                </ListItem>
                            )}
                        </List>
                    </UserPopover>
                </div>

                <div className={classes.navMobile}>
                    <div
                        className={classes.navIcon}
                        onClick={() => setShowMenu(!showMenu)}>
                        <div
                            className={classnames(
                                classes.navIconLine,
                                classes.navIconLine__left
                            )}
                        />
                        <div className={classes.navIconLine}/>
                        <div
                            className={classnames(
                                classes.navIconLine,
                                classes.navIconLine__right
                            )}
                        />
                    </div>
                </div>
            </nav>
            <div
                className={classnames({
                    [classes.navActive]: showMenu,
                    [classes.nav]: true
                })}>
                <div className={classes.navContent}>
                    <div className={classes.currentPageShadow}>Movies</div>
                    <ul
                        className={classes.innerNav}
                        onClick={() => setShowMenu(!showMenu)}>
                        <li className={classes.innerNavListItem}>
                            <RouterLink className={classes.innerNavLink} to="/">
                                Home
                            </RouterLink>
                        </li>
                        <li className={classes.innerNavListItem}>
                            <RouterLink
                                className={classes.innerNavLink}
                                to="/movies/category/nowShowing">
                                Now Showing
                            </RouterLink>
                        </li>
                        <li className={classes.innerNavListItem}>
                            <RouterLink
                                className={classes.innerNavLink}
                                to="/movies/category/comingSoon">
                                Coming Soon
                            </RouterLink>
                        </li>
                        <li className={classes.innerNavListItem}>
                            <RouterLink className={classes.innerNavLink} to="/cinemas">
                                Cinemas
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </Fragment>
    );
};

const mapStateToProps = ({userState}) => ({
    isAuthenticated: userState.isAuthenticated,
    user: userState.user
});

const mapDispatchToProps = {
    logout
};

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(withStyles(styles)(Navbar));
