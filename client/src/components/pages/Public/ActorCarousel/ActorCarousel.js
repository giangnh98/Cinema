import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { makeStyles, Typography, Button } from '@material-ui/core';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import ActorCardSimple from '../ActorCardSimple/ActorCardSimple';
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

const ActorCarousel = ({ carouselClass, casts = [], title, to = null }) => {
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
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1065,
        settings: {
          slidesToShow: 3.5,
        },
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 3.2,
        },
      },
      {
        breakpoint: 875,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 830,
        settings: {
          slidesToShow: 2.8,
        },
      },
      {
        breakpoint: 780,
        settings: {
          slidesToShow: 2.5,
        },
      },
      {
        breakpoint: 710,
        settings: {
          slidesToShow: 2.2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        },
      },
      {
          breakpoint: 600,
          settings: {
              slidesToShow: 1.8
          }
      },
      {
          breakpoint: 515,
          settings: {
              slidesToShow: 1.5
          }
      },
      {
          breakpoint: 455,
          settings: {
              slidesToShow: 1.2
          }
      },
      {
          breakpoint: 380,
          settings: {
              slidesToShow: 1
          }
      }
    ],
  };
  if (!casts.length) return null;
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
        {casts.map((cast) => (
          <ActorCardSimple
            key={cast.id}
            actor={cast.actor}
            castName={cast.castName}
          />
        ))}
      </Slider>
    </div>
  );
};

export default ActorCarousel;
