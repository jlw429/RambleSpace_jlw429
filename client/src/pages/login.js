/* eslint-disable no-unused-vars */
import React, { Component, useState, useEffect } from 'react';
// import withStyles from '@material-ui/core/styles/withStyles';
import { withStyles } from '@material-ui/core/styles';
import AppIcon from '../images/favicon.ico';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';

// MatUi
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

//Redux
import { connect, useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const styles = (theme) => {
  return {
    ...theme.spread,
  };
};

const Login = (props) => {
  const [state, setState] = useState({
    email: '',
    password: '',
    errors: {},
  });
  const UI = useSelector((state) => state.UI);
  const { classes } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  //errors (password must match, field cannot be blank, etc)
  useEffect(() => {
    if (UI.errors) {
      setState((state) => {
        return {
          ...state,
          errors: UI.errors,
        };
      });
    }
  }, [UI]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };

    dispatch(loginUser(userData, history));
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm>
        <img src={AppIcon} alt='main_image' className={classes.image} />
        <Typography variant='h3' className={classes.pageTitle}>
          Login
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            id='email'
            name='email'
            type='email'
            label='Email'
            className={classes.textField}
            helperText={state.errors.email}
            error={state.errors.email ? true : false} //this ternary op ? is a shortcut instead of the if statement
            value={state.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            id='password'
            name='password'
            type='password'
            label='Password'
            className={classes.textField}
            helperText={state.errors.password}
            error={state.errors.password ? true : false}
            value={state.password}
            onChange={handleChange}
            fullWidth
          />
          {state.errors.general && (
            <Typography variant='body2' className={classes.customError}>
              {state.errors.general}
            </Typography>
          )}
          <Button
            type='submit'
            variant='contained'
            color='primary'
            className={classes.button}
            disabled={UI.loading}
          >
            Login
            {UI.loading && (
              <CircularProgress size={20} className={classes.progress} />
            )}
          </Button>
          <br />
          <small>
            Don't have an account yet? <Link to='/signup'>Join Now!</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
};

export default withStyles(styles)(Login);

// class login extends Component {
//   constructor() {
//     super();
//     this.state = {
//       email: '',
//       password: '',
//       errors: {},
//     };
//   }
//   componentWillReceiveProps(nextProps) {
//     if (nextProps.UI.errors) {
//       this.setState({ errors: nextProps.UI.errors });
//     }
//   }

//   handleSubmit = (event) => {
//     event.preventDefault();
//     const userData = {
//       email: this.state.email,
//       password: this.state.password,
//     };
//     this.props.loginUser(userData, this.props.history);
//   };

//   handleChange = (event) => {
//     this.setState({
//       [event.target.name]: event.target.value,
//     });
//   };

//   render() {
//     const {
//       classes,
//       UI: { loading },
//     } = this.props;
//     const { errors } = this.state;
//     return (
//       <Grid container className={classes.form}>
//         <Grid item sm />
//         <Grid item sm>
//           <img src={AppIcon} alt='main_image' className={classes.image} />
//           <Typography variant='h3' className={classes.pageTitle}>
//             Login
//           </Typography>
//           <form noValidate onSubmit={this.handleSubmit}>
//             <TextField
//               id='email'
//               name='email'
//               type='email'
//               label='Email'
//               className={classes.textField}
//               helperText={errors.email}
//               error={errors.email ? true : false} //this ternary op ? is a shortcut instead of the if statement
//               value={this.state.email}
//               onChange={this.handleChange}
//               fullWidth
//             />
//             <TextField
//               id='password'
//               name='password'
//               type='password'
//               label='Password'
//               className={classes.textField}
//               helperText={errors.password}
//               error={errors.password ? true : false}
//               value={this.state.password}
//               onChange={this.handleChange}
//               fullWidth
//             />
//             {errors.general && (
//               <Typography variant='body2' className={classes.customError}>
//                 {errors.general}
//               </Typography>
//             )}
//             <Button
//               type='submit'
//               variant='contained'
//               color='primary'
//               className={classes.button}
//               disabled={loading}
//             >
//               Login
//               {loading && (
//                 <CircularProgress size={20} className={classes.progress} />
//               )}
//             </Button>
//             <br />
//             <small>
//               Don't have an account yet? <Link to='/signup'>Join Now!</Link>
//             </small>
//           </form>
//         </Grid>
//         <Grid item sm />
//       </Grid>
//     );
//   }
// }

// login.propTypes = {
//   classes: PropTypes.object.isRequired,
//   loginUser: PropTypes.func.isRequired,
//   user: PropTypes.object.isRequired,
//   UI: PropTypes.object.isRequired,
// };

// const mapStateToProps = (state) => ({
//   user: state.user,
//   UI: state.UI,
// });

// const mapActionsToProps = {
//   loginUser,
// };

// export default connect(
//   mapStateToProps,
//   mapActionsToProps
// )(withStyles(styles)(login));
