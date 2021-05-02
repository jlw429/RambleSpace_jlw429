import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';
import { deleteRamble } from '../redux/actions/dataActions';
//MUI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

//Redux
import { connect } from 'react-redux';

const styles = {
  deleteButton: {
    left: '90%',
    position: 'absolute',
    top: '10%',
  },
};

class DelRamble extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  deleteRamble = () => {
    this.props.deleteRamble(this.props.rambleId);
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton
          tip='Delete Ramble'
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteOutline color='secondary' />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxwidth='sm'
        >
          <DialogTitle>Are you sure about this?</DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.deleteRamble} color='secondary'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

DelRamble.propTypes = {
  deleteRamble: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  rambleId: PropTypes.string.isRequired,
};

export default connect(null, { deleteRamble })(withStyles(styles)(DelRamble));
