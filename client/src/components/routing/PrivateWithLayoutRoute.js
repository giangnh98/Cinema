import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";

const PrivateWithLayoutRoute = (
   {
      layout: Layout,
      component: Component,
      user,
      ...rest
   }
) => {

   return (
      <Route
         {...rest}
         render={props => user ? (
            <Layout>
               <Component {...props} />
            </Layout>
         ) : (
            <Redirect
               to={{
                  pathname: "/login",
                  state: { from: props.location }
               }}
            />
         )}
      />
   );
};

const mapStateToProps = state => ({
   user: state.userState.user
});

export default connect(mapStateToProps)(PrivateWithLayoutRoute);
