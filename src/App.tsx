import React, { useState, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import "./App.css";

type Person = {
  name: string;
};

const MicrophoneIcon = FaMicrophone as React.ComponentType<{ color?: string }>;

const App: React.FC = () => {
  const [name, setName] = useState("");
  const defaultPeople: Person[] =[{name:'Pavan'},{name:'Viru'},{name:'Srini'},{name:'Shweta'},{name:'Zainab'},
    {name:'Sowmya'},{name:'Aidan'},{name:'Jesse'},{name:'Deepanshu'}];
  
  const shuffleArray = (array: Person[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };
  
  const [people, setPeople] = useState<Person[]>(shuffleArray(defaultPeople));
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timePerPerson, setTimePerPerson] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(15);
  const [showBlast, setShowBlast] = useState(false);

  const [remainingTime, setRemainingTime] = useState(totalTime * 60); // in seconds
const [activePeople, setActivePeople] = useState<Person[]>([]);


  const circleRadius = 200;
  

  const handleAddPerson = () => {
    if (name.trim()) {
      setPeople([...people, { name }]);
      setName("");
    }
  };

  const handleStart = () => {
    if (people.length > 0 && totalTime > 0) {
      const shuffled = shuffleArray(people);
      const totalSeconds = totalTime * 60;
      setRemainingTime(totalSeconds);
      setActivePeople(shuffled);
      const perPerson = Math.floor(totalSeconds / shuffled.length);
      setTimePerPerson(perPerson);
      setTimeLeft(perPerson);
      setCurrentIndex(0);
      setIsRunning(true);
    }
  };

  const handleNext = () => {
    const newRemaining = remainingTime - (timePerPerson - timeLeft);
    const peopleLeft = activePeople.length - (currentIndex + 1);
  
    if (peopleLeft > 0) {
      const newTimePerPerson = Math.floor(newRemaining / peopleLeft);
      setRemainingTime(newRemaining);
      setCurrentIndex((prev) => prev + 1);
      setTimePerPerson(newTimePerPerson);
      setTimeLeft(newTimePerPerson);
    } else {
      setIsRunning(false);
    }
  };
  
  
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      if (currentIndex < people.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setTimeLeft(timePerPerson);
      } else {
        setIsRunning(false);
        setShowBlast(true);
      }
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentIndex, people.length, timePerPerson]);

  return (
    <div  style={{
      padding: "20px",
      fontFamily: "Arial",
      backgroundColor: "black",
      minHeight: "100vh",
      color: "white",
    }}>
      <h2 style={{color:'white'}}>Stand-up Timer</h2>

      {/* {!isRunning && !showBlast && (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
          <button onClick={handleAddPerson}>Add</button>

          <div>
            <label>Total Time (minutes): </label>
            <input
              type="number"
              value={totalTime}
              onChange={(e) => setTotalTime(Number(e.target.value))}
            />
          </div>

          <ul>
            {people.map((p, i) => (
              <li key={i}>{p.name}</li>
            ))}
          </ul>

          <button onClick={handleStart} disabled={people.length === 0}>
            Start
          </button>
        </>
      )} */}
      {!isRunning && !showBlast && (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    marginTop: "40px",
    backgroundColor: "#1a1a1a",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 0 20px rgba(255,165,0,0.2)"
  }}>
    <h2 style={{ color: "orange", marginBottom: "10px" }}>Setup Stand-up</h2>

    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Enter name"
      style={{
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        width: "100%",
        fontSize: "16px"
      }}
    />
    <button
      onClick={handleAddPerson}
      style={{
        backgroundColor: "orange",
        border: "none",
        borderRadius: "8px",
        padding: "10px 20px",
        color: "black",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      Add
    </button>

    <div style={{ color: "white", fontSize: "16px" }}>
      <label>Total Time (minutes): </label>
      <input
        type="number"
        value={totalTime}
        onChange={(e) => setTotalTime(Number(e.target.value))}
        style={{
          padding: "6px",
          borderRadius: "6px",
          border: "none",
          marginLeft: "10px",
          width: "80px"
        }}
      />
    </div>

    <ul style={{ listStyle: "none", padding: 0, color: "white" }}>
      {people.map((p, i) => (
        <li key={i} style={{ padding: "5px 0" }}>
          {p.name}
        </li>
      ))}
    </ul>

    <button
      onClick={handleStart}
      disabled={people.length === 0}
      style={{
        backgroundColor: people.length === 0 ? "gray" : "darkorange",
        border: "none",
        borderRadius: "8px",
        padding: "12px 24px",
        color: "white",
        fontWeight: "bold",
        cursor: people.length === 0 ? "not-allowed" : "pointer",
        marginTop: "10px"
      }}
    >
      Start
    </button>
  </div>
)}


      {isRunning && (
        <div
          className="ticking-circle"
          style={{
            position: "relative",
            width: `${circleRadius * 2 + 100}px`,
            height: `${circleRadius * 2 + 100}px`,
            margin: "40px auto",
            borderRadius: "50%",
          }}
        >
          {activePeople.map((person, index) => {
            const angle = (2 * Math.PI * index) / people.length;
            const x = circleRadius + circleRadius * Math.cos(angle);
            const y = circleRadius + circleRadius * Math.sin(angle);
            const isCurrent = index === currentIndex;
            const isCompleted = index < currentIndex;


            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: `${x + 50}px`,
                  top: `${y + 50}px`,
                  transform: "translate(-50%, -50%)",
                  padding: "10px 15px",
                  borderRadius: "20px",
                  backgroundColor: isCurrent
      ? "darkorange"
      : isCompleted
      ? "green"
      : "orange",
      color: isCompleted ? "white" : "black",
                  fontWeight: isCurrent ? "bold" : "normal",
                  border: isCurrent ? "2px solid orange" : "none",
                  boxShadow: isCurrent
                    ? "0 0 10px rgba(255, 119, 0, 0.8), 0 0 20px rgba(255, 165, 0, 0.4)"
                    : "none",
                  animation: isCurrent ? "pulse 1.5s infinite" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {isCurrent && <MicrophoneIcon color="darkred" />}
                <span>{person.name}</span>
              </div>
            );
          })}
          {isRunning && (
  <div className="center-timer">
    
      {Math.floor(timeLeft / 60)}:
      {String(timeLeft % 60).padStart(2, "0")}
      <br/>
      <button onClick={handleNext}>Skip <i><b>{activePeople[currentIndex]?.name}</b></i></button>
    
    
  </div>
)}
        </div>
      )}

      {showBlast && (
        <div className="blast-screen">
          <div className="blast">💥</div><br />
          <h1>Time's Up!</h1>
        </div>
      )}
    </div>
  );
};

export default App;
