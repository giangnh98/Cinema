import React from 'react';
import { withStyles, CircularProgress, Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import styles from './styles';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import CityCard from './CityCard';
import Divider from '@material-ui/core/Divider';

const AnimatedModal = ({ classes, id }) => {
  const [shows, setShows] = React.useState([]);
  const [option, setOption] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await fetch(`/api/showtimes/date?movieId=${id}`);
      const data = await response.json();
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      const res = data.filter((it) => moment(it).diff(d) >= 0).sort();
      setShows(res);
      setOption(res[0]);
      setLoading(false);
    })();
  }, [id]);

  return (
    <div className={classes.root}>
      {!loading ? (
        shows.length > 0 ? (
          <>
            <div className={classes.date}>
              {shows.map((show, index) => (
                <Card
                  className={
                    option === show ? classes.card : classes.cardNoBorder
                  }
                  key={`${show}-${index}`}
                  onClick={() => setOption(show)}
                >
                  <CardContent className={classes.content}>
                    <div className={classes.no}>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        {
                          moment(show)
                            .format('ddd DD/MM/YYYY')
                            .split(' ')[1]
                            .split('/')[1]
                        }
                      </Typography>
                      <Typography color="textSecondary">
                        {moment(show).format('ddd DD/MM/YYYY').split(' ')[0]}
                      </Typography>
                    </div>
                    <Typography variant="h2" component="h1">
                      {
                        moment(show)
                          .format('ddd DD/MM/YYYY')
                          .split(' ')[1]
                          .split('/')[0]
                      }
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Divider />
            <CityCard
              released={moment(option).format('YYYY-MM-DD')}
              movieId={id}
            />
          </>
        ) : (
          <Grid
            alignItems="center"
            style={{ minHeight: 300, with: '100%' }}
            justify="center"
          >
            <Typography
              variant="h2"
              style={{ with: '100%', height: '100%', textAlign: 'Center' }}
            >
              Empty
            </Typography>
          </Grid>
        )
      ) : (
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{ minHeight: 100 }}
        >
          <CircularProgress />
        </Grid>
      )}
    </div>
  );
};

export default withStyles(styles)(AnimatedModal);
