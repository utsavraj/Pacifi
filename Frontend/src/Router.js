import React, { Component } from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Buddy from './pages/Buddy';
import HomeScreen from './pages/HomeScreen';
import Activity from './pages/Activity';
import Jogging from './pages/Jogging';
import Breathe from './pages/Breathe';
import CalmMusic from './pages/CalmMusic';
import Yoga from './pages/Yoga'
import Doodle from './pages/Doodle'
import UpliftingMusic from './pages/UpliftingMusic'
import RelaxMusic from './pages/RelaxMusic'
import MotivatingMusic from './pages/MotivatingMusic'
import NatureMusic from './pages/NatureMusic'

export default class Routes extends Component {
    render() {
        return (
            <Router barButtonIconStyle ={styles.barButtonIconStyle}
                hideNavBar={false} 
                navigationBarStyle={{backgroundColor: '#1565c0',}} 
                titleStyle={{color: 'white',}}
            >
                <Stack key="root">
                    <Scene key="login" component={Login} title="Login" initial/>
                    <Scene key="signup" component={Signup} title="Sign up"/>
                    <Scene key="HomeScreen" component={HomeScreen} title="Home" />
                    <Scene key="Activity" component={Activity} title="Activity"/>
                    <Scene key="Jogging" component={Jogging} title="Jog"/>
                    <Scene key="Breathe" component={Breathe} title="Breathe"/>
                    <Scene key="Yoga" component={Yoga} title="Yoga"/>
                    <Scene key="Doodle" component={Doodle} title="Doodle"/>
                    <Scene key="CalmMusic" component={CalmMusic} title="CalmMusic"/>
                    <Scene key="UpliftingMusic" component={UpliftingMusic} title="UpliftingMusic"/>
                    <Scene key="RelaxMusic" component={RelaxMusic} title="RelaxMusic"/>
                    <Scene key="MotivatingMusic" component={MotivatingMusic} title="MotivatingMusic"/>
                    <Scene key="NatureMusic" component={NatureMusic} title="NatureMusic"/>
                    <Scene key="buddy" component={Buddy} title="Buddy"/>
                </Stack>
            </Router>
        )
    }
}

const styles = {
    barButtonIconStyle: {
        tintColor: 'white'
    }
}