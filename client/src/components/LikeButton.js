import React, { Component } from 'react';
import MyButton from '../util/MyButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//Icons
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

//Redux
import { connect } from 'react-redux';
import { likeRamble, unlikeRamble } from '../redux/actions/dataActions';

export class LikeButton extends Component {
  likedRamble = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.rambleId === this.props.rambleId
      )
    )
      return true;
    else return false;
  };

  likeRamble = () => {
    console.log(this.props);
    this.props.likeRamble(this.props.rambleId);
  };

  unlikeRamble = () => {
    this.props.unlikeRamble(this.props.rambleId);
  };

  render() {
    const { authenticated } = this.props.user;
    const likeButton = !authenticated ? (
      <Link to='/login'>
        <MyButton tip='Like'>
          <StarBorderIcon color='primary' />
        </MyButton>
      </Link>
    ) : this.likedRamble() ? (
      <MyButton tip='Undo like' onClick={this.unlikeRamble}>
        <StarIcon color='primary' />
      </MyButton>
    ) : (
      <MyButton tip='Like' onClick={this.likeRamble}>
        <StarBorderIcon color='primary' />
      </MyButton>
    );

    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  rambleId: PropTypes.string.isRequired,
  likeRamble: PropTypes.func.isRequired,
  unlikeRamble: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeRamble,
  unlikeRamble,
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
