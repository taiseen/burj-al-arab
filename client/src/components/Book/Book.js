import React, { useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { UserContext } from '../../App';
import Button from '@material-ui/core/Button';
import Bookings from '../Bookings/Bookings';

const Book = () => {
    const { bedType } = useParams();

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [selectedDate, setSelectedDate] = useState({
        checkIn: new Date(),
        checkOut: new Date(),
    });

    const handleCheckIn = (date) => {
        const newDate = { ...selectedDate };
        newDate.checkIn = date;
        setSelectedDate(newDate);
    };
    const handleCheckOut = (date) => {
        const newDate = { ...selectedDate };
        newDate.checkOut = date;
        setSelectedDate(newDate);
    };

    const handleBooking = () => {

        const newUserBooking = { ...loggedInUser, ...selectedDate };

        const url = 'http://localhost:5000/addBooking';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(newUserBooking),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(data => console.log(data));

        console.log("Coping ==> ",newUserBooking);
        
    }
    //#######################################################################
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Let's book a {bedType} Room.</h1>
            <p>Want a <Link to="/home">different room?</Link> </p>


            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                    <KeyboardDatePicker
                        // disableToolbar
                        // variant="inline"
                        margin="normal"
                        id="date-picker-dialog"
                        label="Check In"
                        format="dd/MM/yyyy"
                        value={selectedDate.checkIn}
                        onChange={handleCheckIn}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Check Out"
                        format="dd/MM/yyyy"
                        value={selectedDate.checkOut}
                        onChange={handleCheckOut}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    {/* <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        label="Time picker"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                    /> */}
                </Grid>

                <Button onClick={handleBooking} variant="contained" color="primary">
                    Book Now
                </Button>
            </MuiPickersUtilsProvider>
            <Bookings></Bookings>
        </div>
    );
};

export default Book;