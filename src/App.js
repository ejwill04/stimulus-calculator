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
import FormControl from '@material-ui/core/FormControl';

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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 0, 4),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  header: {
    color: 'white',
    backgroundColor: '#e3d6d7',
    padding: theme.spacing(2),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  toggleContainer: {
    margin: theme.spacing(2, 0),
    marginBottom: 30,
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
        <Typography component="legend" align="center">Filing Status</Typography>
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
      <Box component="fieldset" mb={3} borderColor="transparent">
        <Typography component="legend" align="center">Children under Age 17</Typography>
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
    <FormControl
      className={classes.toggleContainer} noValidate autoComplete="off">
      <Typography component="legend" align="center">Adjusted Gross Income (AGI)</Typography>
      <TextField 
      value={agi}
      onChange={e => setAgi(e.target.value)}
      id="standard-basic" 
      type="number"
      helperText={
        <Link
          href="https://www.nerdwallet.com/blog/taxes/adjusted-gross-income-agi/"
          target="_blank"
          >Explanation of adjusted gross income
        </Link>
      }
      />
    </FormControl>
  );
}

const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
      {/* <TopBar /> */}
      <main>
            <div className={classes.header}>
            <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
              Coronavirus Check Calculator
            </Typography>
            <Typography component="h2" variant="h6" align="center" color="textSecondary" paragraph>
              How much will I get from the U.S. government?
            </Typography>
            <Typography variant="h6" align="center" color="textSecondary" paragraph>
              Based off 2019 federal tax returns if filed, else based on 2018 filing.
            </Typography>
            </div>
        <div className={classes.heroContent}>
          <Container maxWidth="lg">
            <div className={classes.paper}>
                <StatusSelector classes={classes} status={status} setStatus={setStatus} />
                <ChildSelector children={children} setChildren={setChildren} />
                <AGISelector agi={agi} setAgi={setAgi} />
            </div>
            <Typography variant="h3" align="center" paragraph color="textPrimary" gutterBottom>
              Amount {`$`}{numberWithCommas(amount)}
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
              Helpful Links:
            </Typography>
            <Typography align="center">
              <Link
                href="https://www.congress.gov/bill/116th-congress/senate-bill/3548 "
                target="_blank"
              >CARES Act
              </Link>
            </Typography>
            <Typography align="center">
              <Link 
                href="https://www.vox.com/future-perfect/2020/3/23/21190955/stimulus-checks-from-government-approved"
                target="_blank"
              >Vox article explaining stimulus
              </Link>
            </Typography>
            <Typography align="center">
              
            </Typography>
          </Container>
        </div>
      </main>
      <Footer classes={classes} />
    </React.Fragment>
  );
}