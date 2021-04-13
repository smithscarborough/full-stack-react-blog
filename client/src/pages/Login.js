import { Button, Grid, Paper, TextField } from '@material-ui/core';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setUser } from '../redux/actions';


export default function Login() {

const history = useHistory();
const dispatch = useDispatch();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // fetch request using the api route that we set up in the routes
    // the second parameter is the 
    fetch('/api/v1/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: form.username,
            password: form.password,
        }),
    })
    // Next, if the above is successful, we want to take the user to the 
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert(data.error)
        } else {
            alert('User Logged In Successfully');
            dispatch(setUser(data));
            history.push('/');
        }
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Paper elevation={3}>
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              label="Username"
              type="text"
              onChange={handleChange}
              value={form.username}
              name="username"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              onChange={handleChange}
              value={form.password}
              name="password"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit">Register</Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}