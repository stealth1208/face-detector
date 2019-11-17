import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { Home } from './pages';
import './styles/_layout.scss';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      // 'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(',')
  }
});

function Index() {
  return <Home />;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

function AppRouter() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div>
          <nav>
            <ul>
              <li>
                <Link to='/'>Home</Link>{' '}
              </li>
            </ul>
          </nav>

          <Route path='/' exact={true} component={Index} />
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default AppRouter;
