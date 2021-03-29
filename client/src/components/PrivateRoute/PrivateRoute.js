import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router';
import { UserContext } from '../../App';

const PrivateRoute = ({ children, ...rest }) => {

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);

    return (
        <Route
            {...rest}
            render={({ location }) =>
                // যদি user login থাকে >>> তাহলে এই children এ ঢুকতে পারবে 
                loggedInUser.email ? (
                    children
                ) : (
                    // যদি user login না থাকে >>> তাহলে এই children এ ঢুকতে পারবে না
                    // তাকে user login page এ পাঠানো হবে login করার জন্য 
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;