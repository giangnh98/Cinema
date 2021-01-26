import React, { Fragment, useState, useEffect } from 'react';
import classnames from 'classnames';
import {
  Typography,
  List,
  ListItem,
  withStyles,
  Link,
} from '@material-ui/core';
// Component styles
import styles from './styles';
import UserPopover from './components/UserPopover/UserPopover';
import { connect } from 'react-redux';
import { logout } from '../../../../../store/user/user.thunk';

const Navbar = (props) => {
  const { classes, isAuthenticated, user, logout } = props;
  const [showMenu, setShowMenu] = useState(false);
  const [scrollPos, setScrollPos] = useState(window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
          [classes.navbarColor]: scrollPos > 30,
        })}
      >
        <Link className={classes.logoLink} href="/">
          <Typography className={classes.logo} variant="h2">
            Cinema +
          </Typography>
        </Link>
        <div className={classes.navLinks}>
          <Link className={classes.navLink} href="/">
            Home
          </Link>
          <Link
            className={classes.navLink}
            href="/movies/category/nowShowing"
          >
            Now Showing
          </Link>
          <Link
            className={classes.navLink}
            href="/movies/category/comingSoon"
          >
            Coming Soon
          </Link>
          <Link className={classes.navLink} href="/cinemas">
            Cinemas
          </Link>
        </div>

        <div className={classes.navAccount}>
          <UserPopover logout={logout}>
            <List component="nav">
              {user && (
                <ListItem>
                  <Link
                    className={classes.navLink}
                    href={
                      user.role !== 'guest'
                        ? '/admin/dashboard'
                        : '/myDashboard'
                    }
                  >
                    Dashboard
                  </Link>
                </ListItem>
              )}

              {isAuthenticated ? (
                <ListItem>
                  <Link
                    className={classes.navLink}
                    onClick={onLogout}
                    href="/"
                  >
                    Logout
                  </Link>
                </ListItem>
              ) : (
                <ListItem>
                  <Link className={classes.navLink} href="/login">
                    Login
                  </Link>
                </ListItem>
              )}
            </List>
          </UserPopover>
        </div>

        <div className={classes.navMobile}>
          <div
            className={classes.navIcon}
            onClick={() => setShowMenu(!showMenu)}
          >
            <div
              className={classnames(
                classes.navIconLine,
                classes.navIconLine__left
              )}
            />
            <div className={classes.navIconLine} />
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
          [classes.nav]: true,
        })}
      >
        <div className={classes.navContent}>
          <div className={classes.currentPageShadow}>Movies</div>
          <ul
            className={classes.innerNav}
            onClick={() => setShowMenu(!showMenu)}
          >
            <li className={classes.innerNavListItem}>
              <Link className={classes.innerNavLink} href="/">
                Home
              </Link>
            </li>
            <li className={classes.innerNavListItem}>
              <Link
                className={classes.innerNavLink}
                href="/movies/category/nowShowing"
              >
                Now Showing
              </Link>
            </li>
            <li className={classes.innerNavListItem}>
              <Link
                className={classes.innerNavLink}
                href="/movies/category/comingSoon"
              >
                Coming Soon
              </Link>
            </li>
            <li className={classes.innerNavListItem}>
              <Link className={classes.innerNavLink} href="/cinemas">
                Cinemas
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = ({ userState }) => ({
  isAuthenticated: userState.isAuthenticated,
  user: userState.user,
});

const mapDispatchToProps = {
  logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Navbar));
