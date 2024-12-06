import React, { useState, useEffect, useRef} from 'react';
import './typingTest.css';
import {paragraphs, devParagraphs} from './textData'; 

const TypingTest = () => {

  const [paragraphText, setParagraphText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [errors, setErrors] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [wpm, setWPM] = useState(0);
  const [cpm, setCPM] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [devMode, setDevMode] = useState(false); 

  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  console.log(elapsedTime);
  const loadNewParagraph = () => {
  const sourceArray = devMode ? devParagraphs : paragraphs;
  const randomParagraph = sourceArray[Math.floor(Math.random() * sourceArray.length)];
  
  setParagraphText(randomParagraph);
  setUserInput('');
  setElapsedTime(0);
  setErrors(0);
  setCharIndex(0);
  setWPM(0);
  setCPM(0);
  setIsTestRunning(false);
  setTimeLeft(60);

  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }
};

  useEffect(() => {
    loadNewParagraph();
  }, []);

  // Start and manage the timer
  useEffect(() => {
    if (isTestRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      setIsTestRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isTestRunning, timeLeft]);

  // Calculate WPM and CPM
  useEffect(() => {
    if (isTestRunning) {
      const correctChars = charIndex - errors;
      const wordsTyped = correctChars / 5;
      const timeElapsedInMinutes = (60 - timeLeft) / 60;

      const calculatedWPM = Math.round(wordsTyped / timeElapsedInMinutes) || 0;
      const calculatedCPM = Math.round(correctChars / timeElapsedInMinutes) || 0;

      setWPM(calculatedWPM);
      setCPM(calculatedCPM);
    }
  }, [charIndex, errors, timeLeft, isTestRunning]);

  const handleTyping = (event) => {
    const inputValue = event.target.value;
    const currentChar = paragraphText[charIndex];
    const typedChar = inputValue[inputValue.length - 1];

    if (!isTestRunning) {
      setIsTestRunning(true);
      startTimeRef.current = Date.now();
    }

    if (typedChar === currentChar) {
      setCharIndex((prevIndex) => prevIndex + 1);
    } else if (typedChar !== undefined) {
      setErrors((prevErrors) => prevErrors + 1);
    }

    setUserInput(inputValue);

    if (charIndex === paragraphText.length - 1) {
      setIsTestRunning(false);
      clearInterval(intervalRef.current);
    }
  };

  const resetTest = () => {
    loadNewParagraph();
  };

  const toggleDevMode = () => {
    setDevMode((prev) => !prev);
  };

  return (
    <div className="typing-test-container">
      <h1 className="typing-test-title">Speed Typing Game</h1>
      <button onClick={toggleDevMode} className="dev-mode-button">
        {devMode ? 'Switch to Normal Mode' : 'Switch to Dev Mode'}
      </button>
      <p className="typing-test-paragraph">
        {paragraphText.split('').map((char, index) => {
          let className = '';
          if (index < charIndex) {
            className = userInput[index] === char ? 'correct-char' : 'wrong-char';
          } else if (index === charIndex) {
            className = 'current-char';
          }
          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        })}
      </p>
      <textarea
        value={userInput}
        onChange={handleTyping}
        placeholder="Start typing here..."
        className="typing-test-input"
        disabled={timeLeft === 0}
      />
      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Time Left:</span>
          <span className="stat-value">{timeLeft}s</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">WPM:</span>
          <span className="stat-value">{wpm}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">CPM:</span>
          <span className="stat-value">{cpm}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Errors:</span>
          <span className="stat-value">{errors}</span>
        </div>
      </div>
      <button className="reset-button" onClick={resetTest}>
        Reset
      </button>
    </div>
  );
};

export default TypingTest;