import React, { lazy, Suspense } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
// Loading
import Loading from "./components/Loading/Loading";
// Layouts
import WithLayoutRoute from "./components/routing/WithLayoutRoute";
import PrivateWithLayoutRoute from "./components/routing/PrivateWithLayoutRoute";
import PublicLayout from "./components/layouts/PublicLayout/PublicLayout";
import AdminLayout from "./components/layouts/AdminLayout/AdminLayout";
// Register - Login
const RegisterPage = lazy(() => import(`./components/pages/Public/Register/RegisterPage`));
const LoginPage = lazy(() => import(`./components/pages/Public/Login/LoginPage`));
// Admin
const AdminDashboardPage = lazy(() => import(`./components/pages/Admin/Dashboard/Dashboard`));
const AdminUserPage = lazy(() => import(`./components/pages/Admin/User/User`));
const AdminShowtimePage = lazy(() => import(`./components/pages/Admin/Showtime/Showtime`));
const AdminReservationPage = lazy(() => import(`./components/pages/Admin/Reservations/Reservations`));
const AdminPrebookingPage = lazy(() => import(`./components/pages/Admin/Prebooking/Prebooking`));
const AdminCinemaPage = lazy(() => import(`./components/pages/Admin/Cinema/Cinema`));
const AdminMoviePage = lazy(() => import(`./components/pages/Admin/Movie/Movie`));
const AdminRoomPage = lazy(() => import(`./components/pages/Admin/Room/Room`));
// Public
const HomePage = lazy(() => import((`./components/pages/Public/Home/HomePage`)));
const MoviePage = lazy(() => import(`./components/pages/Public/Movie/MoviePage`));
const NotFound = lazy(() => import(`./components/pages/Public/NotFound/NotFound`));
const MovieCategoryPage = lazy(() => import(`./components/pages/Public/MovieCategoryPage/MovieCategoryPage`));
const Dashboard = lazy(() => import(`./components/pages/Public/Dashboard/Dashboard`));
const CinemaPage = lazy(() => import(`./components/pages/Public/Cinema/CinemasPage`));
const BookingPage = lazy(() => import(`./components/pages/Public/BookingPage/BookingPage`));

const Routes = () => {
   return (
      <Suspense fallback={<Loading/>}>
         <Router>
            <Switch>
               <Route exact path="/login" component={LoginPage}/>

               <Route exact path="/register" component={RegisterPage}/>

               <WithLayoutRoute
                  exact
                  path="/"
                  layout={PublicLayout}
                  component={HomePage}
               />

               <WithLayoutRoute
                  exact
                  path="/movie/booking/:id"
                  layout={PublicLayout}
                  component={BookingPage}
               />

               <WithLayoutRoute
                  exact
                  path="/movie/:id"
                  layout={PublicLayout}
                  layoutProps={{ withFooter: false }}
                  component={MoviePage}
               />

               <WithLayoutRoute
                  exact
                  path="/movies/category/:category"
                  layout={PublicLayout}
                  component={MovieCategoryPage}
               />

               <WithLayoutRoute
                  exact
                  path="/cinemas"
                  layout={PublicLayout}
                  component={CinemaPage}
               />

               <PrivateWithLayoutRoute
                  exact
                  path="/myDashboard"
                  layout={PublicLayout}
                  component={Dashboard}
               />

               <PrivateWithLayoutRoute
                  exact
                  path="/admin/dashboard"
                  layout={AdminLayout}
                  component={AdminDashboardPage}
               />

               <PrivateWithLayoutRoute
                  exact
                  path="/admin/users"
                  layout={AdminLayout}
                  component={AdminUserPage}
               />

               <PrivateWithLayoutRoute
                  exact
                  path="/admin/showtimes"
                  layout={AdminLayout}
                  component={AdminShowtimePage}
               />

               <PrivateWithLayoutRoute
                  exact
                  path="/admin/reservations"
                  layout={AdminLayout}
                  component={AdminReservationPage}
               />

               <PrivateWithLayoutRoute
                  exact
                  path="/admin/prebooking"
                  layout={AdminLayout}
                  component={AdminPrebookingPage}
               />

               <PrivateWithLayoutRoute
                  exact
                  path="/admin/cinemas"
                  layout={AdminLayout}
                  component={AdminCinemaPage}
               />

               <PrivateWithLayoutRoute
                  exact
                  path="/admin/movies"
                  layout={AdminLayout}
                  component={AdminMoviePage}
               />

               <PrivateWithLayoutRoute
                  exact
                  path="/admin/rooms"
                  layout={AdminLayout}
                  component={AdminRoomPage}
               />

               <WithLayoutRoute
                  path="*"
                  layout={PublicLayout}
                  layoutProps={{ withFooter: false, withNavbar: false }}
                  component={NotFound}/>
            </Switch>
         </Router>
      </Suspense>
   );
};

export default Routes;
