import React from 'react';
import { useSpring, animated, config } from 'react-spring';
import './TimerBar.css';


export const TimerBar = (props) => {
    const maxDuration = 9000;
    const timerDuration = props.waitTime - new Date().getTime();
    const current_width = 100 - ((maxDuration - timerDuration) / maxDuration) * 100;

    const timerAnimation = useSpring({
        from: { "width": `${current_width}%` },
        to: { "width": "0%" },
        config: {
            duration: timerDuration,
            config: config.wobbly
        },
        onRest(ds) {
            props.updateGameState(props.gameStates.InProgress);
        }
    }
    )

    return (
        <div className="background">
            <animated.div style={timerAnimation} className="timer">

            </animated.div>
        </div>
    )
}
