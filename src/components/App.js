import React, { useState } from "react";
import "./../styles/App.css";

const levelConfig = {
  easy: 8,
  normal: 16,
  hard: 32,
};

const App = () => {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [level, setLevel] = useState("");
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  // 1. Added attempts state
  const [attempts, setAttempts] = useState(0);

  const createBoard = (totalCards) => {
    const pairCount = totalCards / 2;
    const numbers = [];

    for (let i = 1; i <= pairCount; i++) {
      numbers.push(i);
      numbers.push(i);
    }

    const shuffled = numbers
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
      }));

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setDisabled(false);
    // 2. Reset attempts on new game
    setAttempts(0);
  };

  const startGame = () => {
    if (!selectedLevel) return;

    setLevel(selectedLevel);
    createBoard(levelConfig[selectedLevel]);
  };

  const handleCardClick = (card) => {
    if (
      disabled ||
      flipped.find((c) => c.id === card.id) ||
      matched.includes(card.value)
    ) {
      return;
    }

    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      // 3. Increment attempt counter when a pair is tested
      setAttempts((prev) => prev + 1);

      if (newFlipped[0].value === newFlipped[1].value) {
        setMatched((prev) => [...prev, newFlipped[0].value]);

        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 800);
      }
    }
  };

  if (level === "") {
    return (
      <div className="levels_container">
        <h1>Welcome!</h1>
        <h2>Select Level</h2>

        <label>
          <input
            type="radio"
            id="easy"
            name="level"
            value="easy"
            checked={selectedLevel === "easy"}
            onChange={() => setSelectedLevel("easy")}
          />
          Easy
        </label>

        <label>
          <input
            type="radio"
            id="normal"
            name="level"
            value="normal"
            checked={selectedLevel === "normal"}
            onChange={() => setSelectedLevel("normal")}
          />
          Normal
        </label>

        <label>
          <input
            type="radio"
            id="hard"
            name="level"
            value="hard"
            checked={selectedLevel === "hard"}
            onChange={() => setSelectedLevel("hard")}
          />
          Hard
        </label>

        <br />

        <button onClick={startGame}>Start</button>
      </div>
    );
  }

  return (
    <div>
      {/* Restored to h2 */}
      <h2>{level.toUpperCase()} LEVEL</h2>

      {/* 4. Added h4 containing '0' for the attempts counter */}
      <h4>Attempts: {attempts}</h4>

      <div
        className="cells_container"
        style={{
          gridTemplateColumns:
            level === "easy"
              ? "repeat(4, 80px)"
              : level === "normal"
              ? "repeat(4, 80px)"
              : "repeat(8, 80px)",
        }}
      >
        {cards.map((card) => {
          const isOpen =
            flipped.find((c) => c.id === card.id) ||
            matched.includes(card.value);

          return (
            <div
              key={card.id}
              className={`cell ${isOpen ? "open" : ""}`}
              onClick={() => handleCardClick(card)}
            >
              {isOpen ? card.value : "?"}
            </div>
          );
        })}
      </div>

      {matched.length === levelConfig[level] / 2 && (
        <h2>🎉 You Won!</h2>
      )}
    </div>
  );
};

export default App;