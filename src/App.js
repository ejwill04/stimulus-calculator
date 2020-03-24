import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import TextField from '@material-ui/core/TextField';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
        A Monday Night, {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  toggleContainer: {
    margin: theme.spacing(2, 0),
  },
}));

const TopBar = () => {
  return (
    <AppBar position="relative">
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap>
          Coronavirus Check Calculator
          </Typography>
      </Toolbar>
    </AppBar>
  )
}

const Footer = classes => {
  return (
    <footer className = { classes.footer } >
      <Typography variant="h6" align="center" gutterBottom>
        Times are hard
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
        And so is MATH
      </Typography>
      <Copyright />
    </footer >
  )
}

const StatusSelector = ({ classes, status, setStatus }) => {
  return (
    <Grid>
      <div className={classes.toggleContainer}>
        <ToggleButtonGroup
          value={status}
          exclusive
          onChange={(e, value) => setStatus(value)}
          aria-label="filing status"
        >
          <ToggleButton value="single" aria-label="single status">
            Single
          </ToggleButton>
          <ToggleButton value="married" aria-label="married status">
            Married Filing Jointly
          </ToggleButton>
          <ToggleButton value="hoh" aria-label="head of household status">
            Head of Household
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </Grid>
  )
}

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}><ChildCareIcon /></span>;
}

const ChildSelector = ({ children, setChildren }) => {

  return (
    <div>
      <Box component="fieldset" mb={children} borderColor="transparent">
        <Typography component="legend">Number of Children</Typography>
        <Rating
          name="customized-icons"
          defaultValue={children}
          max={10}
          onChange={(event, newValue) => {
            setChildren(newValue || 0);
          }}
          IconContainerComponent={IconContainer}
        />
      </Box>
    </div>
  );
}

const AGISelector = ({ agi, setAgi }) => {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField 
      value={agi}
      onChange={e => setAgi(e.target.value)}
      id="standard-basic" 
      type="number"
      helperText="Adjusted Gross Income"
      label="$" />
    </form>
  );
}

const PHASEOUT_START = {
  single: 75000,
  hoh: 112500,
  married: 150000
}

const PROVISIONS = {
  single: 1200,
  hoh: 2400,
  married: 2400,
  children: 500
}


export default function App() {
  // const [amount, setAmount] = useState(0)
  const [status, setStatus] = useState('single')
  const [children, setChildren] = useState(0)
  const [agi, setAgi] = useState()
  const classes = useStyles();
  

  let amount = 0
  if (agi > PHASEOUT_START[status]) {
    // $5 reduction for every $1000 over
    amount = Math.max(PROVISIONS[status] + (children * PROVISIONS.children) - (((+agi - PHASEOUT_START[status])/ 100) * 5), 0)
  } else {
    amount = PROVISIONS[status] + (children * PROVISIONS.children)
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <TopBar />
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="md">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Coronavirus Check Calculator
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              How much will I get from the U.S. government?
            </Typography>
            <div className={classes.paper}>
                <StatusSelector classes={classes} status={status} setStatus={setStatus} />
                <ChildSelector children={children} setChildren={setChildren} />
                <AGISelector agi={agi} setAgi={setAgi} />
            </div>
            <Typography variant="h3" align="center" paragraph color="textPrimary" gutterBottom>
              Amount {`$`}{amount}
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
              Helpful Links:
            </Typography>
            <Typography align="center">
              <Link 
                href="https://www.vox.com/future-perfect/2020/3/23/21190955/stimulus-checks-from-government-approved"
                target="_blank"
              >Vox article explaining stimulus
              </Link>
            </Typography>
            <Typography align="center">
              <Link
                href="https://www.nerdwallet.com/blog/taxes/adjusted-gross-income-agi/"
                target="_blank"
              >What is adjusted gross income?
              </Link>
            </Typography>
          </Container>
        </div>
      </main>
      <Footer classes={classes} />
    </React.Fragment>
  );
}