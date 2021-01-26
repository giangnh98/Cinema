import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Divider,
  Typography,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { ToTitleCase } from '../../../../../../ultils/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  chartContainer: {
    position: 'relative',
    height: '300px',
  },
  stats: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  device: {
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  deviceIcon: {
    color: theme.palette.icon,
  },
}));

const UsersByDevice = (props) => {
  const { className, bestMovies, ...rest } = props;

  const classes = useStyles();
  const theme = useTheme();

  const colors = [
    theme.palette.primary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
  ];

  const data = {
    datasets: [
      {
        data: bestMovies.map((it) => it.count),
        backgroundColor: colors,
        borderWidth: 8,
        borderColor: theme.palette.white,
        hoverBorderColor: theme.palette.white,
      },
    ],
    labels: bestMovies.map((it) => ToTitleCase(it.movie.title)),
  };

  const options = {
    legend: {
      display: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      borderWidth: 1,
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.white,
      titleFontColor: theme.palette.text.primary,
      bodyFontColor: theme.palette.text.secondary,
      footerFontColor: theme.palette.text.secondary,
    },
  };

  const totalCount = bestMovies.reduce((initial, it) => {
    return initial + it.count;
  }, 0);

  const devices = bestMovies.map((it, index) => ({
    title: ToTitleCase(it.movie.title),
    value: (it.count / totalCount) * 100,
    color: colors[index],
  }));

  return (
    <Card {...rest} className={classnames(classes.root, className)}>
      <CardHeader
        action={
          <IconButton size="small">
            <RefreshIcon />
          </IconButton>
        }
        title="Best Movies"
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <Doughnut data={data} options={options} />
        </div>
        <div className={classes.stats}>
          {devices.map((device) => (
            <div className={classes.device} key={device.title}>
              <span className={classes.deviceIcon}>{device.icon}</span>
              <Typography variant="body1">{device.title}</Typography>
              <Typography style={{ color: device.color }} variant="h2">
                {device.value}%
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

UsersByDevice.propTypes = {
  className: PropTypes.string,
};

export default UsersByDevice;
