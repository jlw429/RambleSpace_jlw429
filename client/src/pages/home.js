/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { getRambles } from '../redux/actions/dataActions';
import PropTypes from 'prop-types';

import Rambles from '../components/Rambles';
import Profile from '../components/Profile';
import RambleSkeleton from '../util/RambleSkeleton';

class home extends Component {
  componentDidMount() {
    this.props.getRambles();
  }

  render() {
    const { rambles, loading } = this.props.data;
    console.log(this.props.data);
    let recentRamblesMarkup = !loading ? (
      rambles.map((ramble) => (
        <Rambles openDialog={false} key={ramble.rambleId} rambles={ramble} />
      ))
    ) : (
      <RambleSkeleton />
    );
    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {recentRamblesMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getRambles: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getRambles })(home);
