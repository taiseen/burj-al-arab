import React, { useContext } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.Config';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';

//############################################################
// Initialize Firebase
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}
//############################################################

const Login = () => {

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);

    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };


    const handleGoogleSignIn = () => {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {

                //################################
                //################################
                //################################
                const { displayName, email } = result.user;

                // creating a new object...
                const signInUser = {
                    name: displayName,
                    email,
                }

                // broadcast to entire application
                // user logging -> tracking start...
                setLoggedInUser(signInUser);

                // set for Token
                setAuthToken();
                // // send back to user that page... 
                // // from where he going to prevent... 
                // history.replace(from);

                console.log(signInUser);
                //################################
                //################################
                //################################

            }).catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    const setAuthToken = () => {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            console.log(idToken);
            sessionStorage.setItem('token', idToken);
            // send back to user that page... 
            // from where he going to prevent... 
            history.replace(from);
        }).catch(function (error) {
            // Handle error
        });
    }



    //##################################################################
    return (
        <div>
            <h1>This is Login</h1>
            <button onClick={handleGoogleSignIn}>Google Login</button>
        </div>
    );
};

export default Login;