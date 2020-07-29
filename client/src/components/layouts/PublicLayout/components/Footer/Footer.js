import React, {Fragment} from 'react';
import {Divider, Typography, Link, withStyles} from '@material-ui/core';
import "../../../../../assets/css/footer.css"
import Cards from "../../../../../assets/images/cards.png";
import Grid from "@material-ui/core/Grid";
import styles from "./styles";

const Footer = ({classes}) => {
    return (
        <Fragment>
            <Divider/>
            <section className="footer-section">
                <Grid container justify={"center"} alignItems={"center"} style={{padding: "0 80px"}}>
                    <div className="footer-logo text-center">
                        <a href="/">
                            <Typography className={classes.logo} variant="h2">
                                Cinema +
                            </Typography>
                        </a>
                    </div>
                    <Grid item container>
                        <Grid item lg={3} sm={6}>
                            <div className="footer-widget about-widget">
                                <Typography variant="h2" gutterBottom>
                                    About
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    We are students study in National University of Civil Engineering, Ha Noi,
                                    Viet Nam.
                                    From Group 14, 61PM1 with love.
                                </Typography>
                                <img src={Cards} alt=""/>
                            </div>
                        </Grid>
                        <Grid item lg={3} sm={6}>
                            <div className="footer-widget question-widget">
                                <Typography variant="h2" gutterBottom>
                                    Questions
                                </Typography>
                                <div style={{display: "flex", justifyContent: "flex-start"}}>
                                    <ul>
                                        <li><a href="/">Partners</a></li>
                                        <li><a href="/">Bloggers</a></li>
                                        <li><a href="/">Support</a></li>
                                        <li><a href="/">Terms of Use</a></li>
                                        <li><a href="/">Press</a></li>
                                    </ul>
                                </div>
                            </div>
                        </Grid>
                        <Grid item lg={3} sm={6}>
                            <div className="footer-widget about-widget">
                                <Typography variant="h2" gutterBottom>
                                    Questions
                                </Typography>
                                <div className="fw-latest-post-widget">
                                    <div className="lp-item">
                                        <img className="lp-thumb set-bg"
                                             src={"https://f0.pngfuel.com/png/348/964/now-showing-the-retro-sign-screenshot-png-clip-art.png"}
                                             alt=""/>
                                        <div className="lp-content">
                                            <Typography variant="h6" gutterBottom>
                                                what movies now showing
                                            </Typography>
                                            <Typography variant="caption" display="block" gutterBottom>
                                                Mar 6, 2020
                                            </Typography>
                                            <Link href={"/movies/category/nowShowing"} className="readmore">Read
                                                More</Link>
                                        </div>
                                    </div>
                                    <div className="lp-item">
                                        <img className="lp-thumb set-bg"
                                             src={"https://oilgastechasia.com/wp-content/uploads/2019/02/coming-soon-01.jpg"}
                                             alt=""/>
                                        <div className="lp-content">
                                            <Typography variant="h6" gutterBottom>
                                                what movies coming soon
                                            </Typography>
                                            <Typography variant="caption" display="block" gutterBottom>
                                                Mar 6, 2020
                                            </Typography>
                                            <Link href={"/movies/category/comingSoon"} className="readmore">Read
                                                More</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item lg={3} sm={6}>
                            <div className="footer-widget contact-widget">
                                <Typography variant="h2" gutterBottom>
                                    Contact us
                                </Typography>
                                <div className="con-info">
                                    <span>U.</span>
                                    <p>National University of Civil Engineering </p>
                                </div>
                                <div className="con-info">
                                    <span>A.</span>
                                    <p>55 Giai Phong, Dong Tam, Hai Ba Trung, Ha Noi </p>
                                </div>
                                <div className="con-info">
                                    <span>P.</span>
                                    <p>094 194 2295</p>
                                </div>
                                <div className="con-info">
                                    <span>E.</span>
                                    <p>giang.hong.nguyen1998@gmail.com</p>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <div className="social-links-warp">
                    <Grid container justify={"center"} alignItems={"center"}>
                        <Grid item container>
                            <Grid item container justify={"center"} alignItems={"center"} className="social-links">
                                <Grid item className="social-links item">
                                    <a href="https://www.facebook.com/pazo.dung.94" className="instagram"><i
                                        className="fab fa-instagram"/><span>Dung Pazo</span></a>
                                </Grid>
                                <Grid item className="social-links item">
                                    <a href="https://www.facebook.com/nguyenkhuong.duy.756" className="google-plus"><i
                                        className="fab fa-google-plus"/><span>Duy Nguyen</span></a>
                                </Grid>
                                <Grid item className="social-links item">
                                    <a href="https://www.facebook.com/phamtrung.kien.12914" className="pinterest"><i
                                        className="fab fa-pinterest"/><span>Kien Pham</span></a>
                                </Grid>
                                <Grid item className="social-links item">
                                    <a href="https://www.facebook.com/giang.hong.nguyen1998" className="facebook"><i
                                        className="fab fa-facebook"/><span>Giang Nguyen</span></a>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <p className="text-white text-center mt-5">Copyright &copy;
                                {new Date().getFullYear()}
                                {' '}All rights reserved | This template is made with <i className="fa fa-heart-o"
                                                                                         aria-hidden="true"/> by <Link
                                    href="https://www.facebook.com/groups/348658492266798/" target="_blank">Group
                                    14</Link></p>
                        </Grid>
                    </Grid>
                </div>
            </section>
        </Fragment>
    );
};

export default withStyles(styles)(Footer);