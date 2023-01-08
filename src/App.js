import React, { useEffect } from "react";
import "./styles.css";

const zeroPad = (numStr) => (Number(numStr) < 10 ? "0" + numStr : numStr);

const MINUTE_MARKS_AMOUNT = 60;
const MINUTE_MARKS_ARR = Array(MINUTE_MARKS_AMOUNT).fill();
const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const DEGREE_OF_ONE_MINUTE = 6;
const DEGREE_OF_ONE_HOUR = 30;

export default function App() {
  const audioRef = React.useRef(null);
  const [seconds, setSeconds] = React.useState(null);
  const [minutes, setMinutes] = React.useState(null);
  const [hours, setHours] = React.useState(null);

  const updateTime = React.useCallback(() => {
    const date = new Date();
    const newSeconds = date.getSeconds();

    setSeconds(newSeconds);
    console.log(newSeconds);
    if (newSeconds === 0) {
      setMinutes(date.getMinutes());
    }

    if (date.getMinutes() === 0) {
      setHours(date.getHours());
    }
  }, []);

  const handleVoiceButtonClick = () => {
    audioRef.current.play();
  };

  useEffect(() => {
    setTimeout(() => {
      audioRef.current.play();
    }, 1000);
    const date = new Date();
    setHours(date.getHours());
    setMinutes(date.getMinutes());
    setSeconds(date.getSeconds());

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [updateTime]);

  const currentHourDegree = hours * DEGREE_OF_ONE_HOUR + minutes / 2;
  const currentMinuteDegree = minutes * DEGREE_OF_ONE_MINUTE + seconds / 10;

  return (
    <div>
      {audioRef.current && audioRef.current.paused && (
        <button className="muteControl" onClick={handleVoiceButtonClick}>
          Unmute
        </button>
      )}
      <audio autoPlay controls loop preload="none" ref={audioRef}>
        <source src="/clock-ticking-natural-room.mp3" type="audio/mp3" />
      </audio>
      <div id="watch">
        <div className="frame-face"></div>
        <ul className="minute-marks">
          {MINUTE_MARKS_ARR.map((_, index) => {
            const deg = (index + 1) * 6;
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
          style={{ transform: `rotate(${seconds * DEGREE_OF_ONE_MINUTE}deg)` }}
        />
      </div>
    </div>
  );
}
