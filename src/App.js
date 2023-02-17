import React, { useEffect } from "react";
import "./styles.css";

export default function App() {
  const {
    muted,
    seconds,
    minutes,
    hours,
    currentSecondDegree,
    currentMinuteDegree,
    currentHourDegree,
    handleMuteToggleClick,
    oneSecAudioRef,
    MINUTE_MARKS_DESGREES_ARR,
    HOURS
  } = useClockLogic();

  return (
    <div>
      <audio controls preload="none" ref={oneSecAudioRef}>
        <source src="/clock-ticking-natural-room-750ms.mp3" type="audio/mp3" />
      </audio>
      <div id="watch">
        <div className="frame-face">
          <div
            class={`switch ${muted ? "switched" : ""}`}
            onClick={handleMuteToggleClick}
          >
            <input
              id="switch-1"
              type="checkbox"
              onChange={handleMuteToggleClick}
            />
          </div>
        </div>
        <ul className="minute-marks">
          {MINUTE_MARKS_DESGREES_ARR.map((deg, index) => {
            // Don't show minute mark behind a number (hour)
            if ((index + 1) % 5 === 0) return "";

            return (
              <li
                key={index}
                style={{ transform: `rotate(${deg}deg) translateY(-12.7em)` }}
              />
            );
          })}
        </ul>
        <div className="digital-wrap">
          <div className="digit-hours">
            <div>{hours}</div>
          </div>
          <div className="digit-minutes">
            <div>{zeroPad(minutes)}</div>
          </div>
          <div className="digit-seconds">
            <div>{zeroPad(seconds)}</div>
          </div>
        </div>
        <ul className="digits">
          {HOURS.map((hour) => (
            <li key={hour}>{hour}</li>
          ))}
        </ul>
        <div
          className="hours-hand"
          style={{ transform: `rotate(${currentHourDegree}deg)` }}
        />
        <div
          className="minutes-hand"
          style={{ transform: `rotate(${currentMinuteDegree}deg)` }}
        />
        <div
          className="seconds-hand"
          style={{ transform: `rotate(${currentSecondDegree}deg)` }}
        />
      </div>
    </div>
  );
}

const zeroPad = (numStr) => (Number(numStr) < 10 ? "0" + numStr : numStr);
const MINUTE_MARKS_AMOUNT = 60;
const MINUTE_MARKS_ARR = Array(MINUTE_MARKS_AMOUNT).fill();
const MINUTE_MARKS_DESGREES_ARR = MINUTE_MARKS_ARR.map((_, index) => {
  const deg = (index + 1) * 6;
  return deg;
});
const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const DEGREE_OF_ONE_MINUTE = 6;
const DEGREE_OF_ONE_HOUR = 30;

function useClockLogic() {
  const oneSecAudioRef = React.useRef(null);
  const [seconds, setSeconds] = React.useState(null);
  const [minutes, setMinutes] = React.useState(null);
  const [hours, setHours] = React.useState(null);
  const [muted, setMuted] = React.useState(true);

  const updateTime = React.useCallback(() => {
    const date = new Date();
    const newSeconds = date.getSeconds();

    setSeconds(newSeconds);

    if (!muted && oneSecAudioRef?.current) {
      oneSecAudioRef.current.play();
    }
    if (newSeconds === 0) {
      setMinutes(date.getMinutes());
    }

    if (date.getMinutes() === 0) {
      setHours(date.getHours());
    }
  }, [muted]);

  const handleMuteToggleClick = () => {
    if (muted) {
      oneSecAudioRef.current.play();
      setMuted(false);
    } else {
      setMuted(true);
    }
  };

  useEffect(() => {
    const date = new Date();
    setHours(date.getHours());
    setMinutes(date.getMinutes());
    setSeconds(date.getSeconds());

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [updateTime]);

  const currentHourDegree = hours * DEGREE_OF_ONE_HOUR + minutes / 2;
  const currentMinuteDegree = minutes * DEGREE_OF_ONE_MINUTE + seconds / 10;
  const currentSecondDegree = seconds * 6;

  return {
    currentHourDegree,
    currentMinuteDegree,
    currentSecondDegree,
    handleMuteToggleClick,
    oneSecAudioRef,
    seconds,
    minutes,
    hours,
    muted,
    zeroPad,
    HOURS,
    MINUTE_MARKS_ARR,
    MINUTE_MARKS_DESGREES_ARR
  };
}
