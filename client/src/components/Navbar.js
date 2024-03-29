import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';
import PostRamble from './PostRamble';
import Notifications from './Notifications';

//MAterial UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

//icons

import HomeIcon from '@material-ui/icons/Home';

export class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar>
        <Toolbar className='nav-container'>
          {authenticated ? (
            <Fragment>
              <PostRamble />
              <Link to='/'>
                <MyButton tip='Home'>
                  <HomeIcon />
                </MyButton>
              </Link>
              {/* <MyButton> */}
              <Notifications />
              {/* </MyButton> */}
            </Fragment>
          ) : (
            <Fragment>
              <Button color='inherit' component={Link} to='/login'>
                Login
              </Button>
              <Button color='inherit' component={Link} to='/'>
                Home
              </Button>
              <Button color='inherit' component={Link} to='/signup'>
                Signup
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}
const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(Navbar);
