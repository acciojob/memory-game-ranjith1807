import React, { useState, useEffect } from "react";
import "./../styles/App.css";

const App = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [flippedTiles, setFlippedTiles] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const startGame = (level) => {
    if (!level) return;

    setDifficulty(level);
    setMatchedPairs([]);
    setFlippedTiles([]);
    setAttempts(0);
    setGameCompleted(false);

    let tileCount = level === "easy" ? 8 : level === "normal" ? 16 : 32;

    const numbers = [];
    for (let i = 1; i <= tileCount / 2; i++) {
      numbers.push(i, i);
    }

    shuffleArray(numbers);

    setTiles(
      numbers.map((num, idx) => ({
        id: idx,
        value: num,
        isMatched: false
      }))
    );
  };

  const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  const handleTileClick = (id) => {
    if (
      flippedTiles.includes(id) ||
      tiles.find((t) => t.id === id)?.isMatched ||
      flippedTiles.length === 2
    ) {
      return;
    }

    const newFlips = [...flippedTiles, id];
    setFlippedTiles(newFlips);

    if (newFlips.length === 2) {
      setAttempts((a) => a + 1);

      const [a, b] = newFlips.map((i) =>
        tiles.find((t) => t.id === i)
      );

      if (a.value === b.value) {
        setTiles((prev) =>
          prev.map((t) =>
            t.id === a.id || t.id === b.id
              ? { ...t, isMatched: true }
              : t
          )
        );
        setMatchedPairs((p) => [...p, a.value]);
      }

      setTimeout(() => setFlippedTiles([]), 800);
    }
  };

  useEffect(() => {
    if (tiles.length && matchedPairs.length === tiles.length / 2) {
      setGameCompleted(true);
    }
  }, [matchedPairs, tiles]);

  const resetGame = () => {
    setDifficulty(null);
    setSelectedDifficulty(null);
    setTiles([]);
    setFlippedTiles([]);
    setMatchedPairs([]);
    setAttempts(0);
    setGameCompleted(false);
  };

  return (
    <div>
      {!difficulty ? (
        <div className="levels_container">
          <h1>Welcome!</h1>
          <h4 data-testid="select-difficulty">
            Select Difficulty Level: <span>{selectedDifficulty ? 1 : 0}</span>
          </h4>
          <div>
            <label htmlFor="easy">
              <input
                type="radio"
                id="easy"
                name="difficulty"
                value="easy"
                onChange={() => startGame("easy")}
              />
              Easy (8 tiles)
            </label>
            <label htmlFor="normal">
              <input
                type="radio"
                id="normal"
                name="difficulty"
                value="normal"
                onChange={() => startGame("normal")}
              />
              Normal (16 tiles)
            </label>
            <label htmlFor="hard">
              <input
                type="radio"
                id="hard"
                name="difficulty"
                value="hard"
                onChange={() => startGame("hard")}
              />
              Hard (32 tiles)
            </label>
          </div>
          <button
            id="start-game-btn"
            disabled={!selectedDifficulty}
            onClick={() => startGame(selectedDifficulty)}
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="game-info">
            <h4>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode</h4>
            <h4>Attempts: {attempts}</h4>
            <p>Matches: {matchedPairs.length} / {tiles.length / 2}</p>
            {!gameCompleted && <button onClick={resetGame}>Reset Game</button>}
          </div>

          {gameCompleted ? (
            <div className="game-completed">
              <h2>Congratulations!</h2>
              <button onClick={resetGame}>Play Again</button>
            </div>
          ) : (
            <div className={`cells_container ${difficulty}`}>
              {tiles.map((tile) => (
                <div
                  key={tile.id}
                  data-testid={`tile-${tile.id}`}
                  className={`tile ${flippedTiles.includes(tile.id) || tile.isMatched
                    ? "flipped"
                    : ""
                    }`}
                  onClick={() => handleTileClick(tile.id)}
                >
                  <div>
                    <span>
                      {flippedTiles.includes(tile.id) || tile.isMatched
                        ? tile.value
                        : "?"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
