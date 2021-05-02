import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Rambles from '../components/Rambles';
import Grid from '@material-ui/core/Grid';
import StaticProfile from '../components/StaticProfile';
import RambleSkeleton from '../util/RambleSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class user extends Component {
  state = {
    profile: null,
    rambleIdParam: null,
  };
  componentDidMount() {
    const handle = this.props.match.params.handle;
    const rambleId = this.props.match.params.rambleId;

    if (rambleId) this.setState({ rambleIdParam: rambleId });

    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({
          profile: res.data.user,
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { rambles, loading } = this.props.data;
    const { rambleIdParam } = this.state;

    const ramblesMarkup = loading ? (
      <RambleSkeleton />
    ) : rambles === null ? (
      <p>No Rambles yet.</p>
    ) : !rambleIdParam ? (
      rambles.map((ramble) => (
        <Rambles key={ramble.rambleId} rambles={ramble} openDialog={false} />
      ))
    ) : (
      rambles.map((ramble) => {
        if (ramble.rambleId !== rambleIdParam)
          return (
            <Rambles
              key={ramble.rambleId}
              rambles={ramble}
              openDialog={false}
            />
          );
        else
          return (
            <Rambles
              key={ramble.rambleId}
              rambles={ramble}
              openDialog={false}
            />
          );
      })
    );

    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {ramblesMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getUserData })(user);
