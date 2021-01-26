import { withStyles } from '@material-ui/styles';
import React from 'react';
import { Card, Grid, CircularProgress, Link } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import styles from './styles';
import Divider from '@material-ui/core/Divider';

const CityCard = ({ released, movieId, classes }) => {
  const [data, setData] = React.useState(null);
  const [option, setOption] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await fetch(
        `/api/cinemas?released=${released}&movie=${movieId}`
      );
      const result = await response.json();
      setData(result);
      setOption(Object.keys(result).length > 0 ? Object.keys(result)[0] : '');
      setLoading(false);
    })();
  }, [released, movieId]);

  return (
    <div className={classes.root}>
      {!loading ? (
        data ? (
          <>
            <div className={classes.date}>
              {!data.hasOwnProperty('statusCode') &&
                Object.keys(data).map((it, index) => (
                  <Card
                    className={
                      option === it ? classes.card : classes.cardNoBorder
                    }
                    key={`${it}-${index}`}
                    onClick={() => setOption(it)}
                  >
                    <CardContent className={classes.content}>
                      <Typography variant="h5" component="h5">
                        {it}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
            </div>
            <Divider />
            {data[option] &&
              Object.keys(data[option]).map((it, index) => (
                <div key={`${it}-${index}`}>
                  <Typography
                    variant="h5"
                    component="h5"
                    style={{ marginTop: 20 }}
                  >
                    {it}
                  </Typography>
                  <div className={classes.date}>
                    {data[option][it][0].shows &&
                      data[option][it][0].shows.length > 0 &&
                      data[option][it][0].shows.map((i, index) => (
                        <Link
                          href={`/movie/booking/${i.id}/${i.room.id}`}
                          style={{ textDecoration: 'none' }}
                          key={`${i.id}-${index}`}
                        >
                          <Card className={classes.card2}>
                            <CardContent className={classes.content}>
                              <Typography variant="h5" component="h5">
                                {parseFloat(i.time.split(':').join('.')) >= 12
                                  ? `${i.time} PM`
                                  : `${i.time} AM`}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                  </div>
                  <Divider />
                </div>
              ))}
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
          style={{ minHeight: 200 }}
        >
          <CircularProgress />
        </Grid>
      )}
    </div>
  );
};

export default withStyles(styles)(CityCard);
