import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { makeStyles, Typography, Button } from '@material-ui/core';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import TrailerCardSimple from '../TrailerCardSimple/TrailerCardSimple';
import styles from './styles';

const useStyles = makeStyles(styles);

const NextArrow = (props) => {
  const { currentSlide, slideCount, onClick } = props;
  const classes = useStyles({ currentSlide, slideCount });
  return (
    <div className={classnames(classes.arrow, 'nextArrow')} onClick={onClick}>
      <ArrowForwardIos color="inherit" fontSize="large" />
    </div>
  );
};

const PrevArrow = (props) => {
  const { currentSlide, onClick } = props;
  const classes = useStyles({ currentSlide });
  return (
    <div className={classnames(classes.arrow, 'prevArrow')} onClick={onClick}>
      <ArrowBackIos color="inherit" fontSize="large" />
    </div>
  );
};

const TrailerCarousel = ({
  carouselClass,
  trailers = [],
  title,
  to = null,
  handleOpen
}) => {
  const classes = useStyles();
  const settings = {
    centerMode: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    swipeToSlide: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 1.5,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  if (!trailers.length) return null;
  return (
    <div className={carouselClass}>
      <div className={classes.container}>
        <Typography className={classes.h2} variant="h2" color="inherit">
          {title}
        </Typography>
        {to == null ? null : (
          <Link to={to} style={{ textDecoration: 'none' }}>
            <Button className={classes.button} color="primary">
              Explore All
            </Button>
          </Link>
        )}
      </div>
      <Slider {...settings} className={classes.slider}>
        {trailers.map((trailer) => (
          <TrailerCardSimple
            key={trailer.id}
            trailer={trailer}
            handleOpen={handleOpen}
          />
        ))}
      </Slider>
    </div>
  );
};

export default TrailerCarousel;
