import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = () => {
  // Icon components
  const RefreshCcwIcon = getIcon('RefreshCcw');
  const SettingsIcon = getIcon('Settings');
  const InfoIcon = getIcon('Info');
  const CheckIcon = getIcon('Check');
  const GripIcon = getIcon('Grip');
  const UserPlusIcon = getIcon('UserPlus');
  const UserMinusIcon = getIcon('UserMinus');

  // Game state
  const [gridSize, setGridSize] = useState(4);
  const [showSettings, setShowSettings] = useState(false);
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", color: "primary", colorClass: "primary", score: 0 },
    { id: 2, name: "Player 2", color: "secondary", colorClass: "secondary", score: 0 }

  ]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [completedLines, setCompletedLines] = useState([]);
  const [completedSquares, setCompletedSquares] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  // Initialize the grid
  const generateGrid = (size) => {
    const dots = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        dots.push({ id: `${x}-${y}`, x, y });
      }
    }
    return dots;
  };

  const generateLines = (size) => {
    const lines = [];
    // Horizontal lines
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size - 1; x++) {
        lines.push({
          id: `h-${x}-${y}`,
          type: 'horizontal',
          start: `${x}-${y}`,
          end: `${x + 1}-${y}`,
          completed: false,
          owner: null
        });
      }
    }
    // Vertical lines
    for (let y = 0; y < size - 1; y++) {
      for (let x = 0; x < size; x++) {
        lines.push({
          id: `v-${x}-${y}`,
          type: 'vertical',
          start: `${x}-${y}`,
          end: `${x}-${y + 1}`,
          completed: false,
          owner: null
        });
      }
    }
    return lines;
  };

  const generateSquares = (size) => {
    const squares = [];
    for (let y = 0; y < size - 1; y++) {
      for (let x = 0; x < size - 1; x++) {
        squares.push({
          id: `sq-${x}-${y}`,
          top: `h-${x}-${y}`,
          right: `v-${x + 1}-${y}`,
          bottom: `h-${x}-${y + 1}`,
          left: `v-${x}-${y}`,
          owner: null
        });
      }
    }
    return squares;
  };

  const [dots, setDots] = useState(generateGrid(gridSize));
  const [lines, setLines] = useState(generateLines(gridSize));
  const [squares, setSquares] = useState(generateSquares(gridSize));

  // Player color mapping
  const playerColors = [
    { id: 1, color: "primary", colorClass: "primary" },
    { id: 2, color: "secondary", colorClass: "secondary" },
    { id: 3, color: "accent", colorClass: "accent" },
    { id: 4, color: "emerald-500", colorClass: "emerald-500" },
    { id: 5, color: "violet-500", colorClass: "violet-500" },
    { id: 6, color: "rose-500", colorClass: "rose-500" }
  ];

  // Get next available player color
  const getNextPlayerColor = (index) => {
    return playerColors[index % playerColors.length];
  };

  // Reset game
  const resetGame = () => {
    setDots(generateGrid(gridSize));
    setLines(generateLines(gridSize));
    setSquares(generateSquares(gridSize));
    setCompletedLines([]);
    setCompletedSquares([]);
    
    // Reset scores but keep player settings
    setPlayers(players.map(player => ({
      ...player,
      score: 0
    })));
    
    setCurrentPlayer(1);
    setGameOver(false);
    toast.success("New game started!");
  };

  // Update grid size
  useEffect(() => {
    resetGame();
  }, [gridSize]);

  // Handle line click
  const handleLineClick = (lineId) => {
    if (gameOver) return;
    
    // Find the clicked line
    const updatedLines = lines.map(line => {
      if (line.id === lineId && !line.completed) {
        return { ...line, completed: true, owner: currentPlayer };
      }
      return line;
    });
    
    setLines(updatedLines);
    setCompletedLines([...completedLines, lineId]);
    
    // Check if squares are completed
    let squareCompleted = false;
    const updatedSquares = squares.map(square => {
      if (square.owner === null) {
        const squareLines = [square.top, square.right, square.bottom, square.left];
        const allLinesCompleted = squareLines.every(lineId => {
          const line = updatedLines.find(l => l.id === lineId);
          return line && line.completed;
        });
        
        if (allLinesCompleted) {
          squareCompleted = true;
          setCompletedSquares([...completedSquares, square.id]);
          
          // Update player score
          setPlayers(players.map(player => {
            if (player.id === currentPlayer) {
              return { ...player, score: player.score + 1 };
            }
            return player;
          }));
          
          return { ...square, owner: currentPlayer };
        }
      }
      return square;
    });
    
    setSquares(updatedSquares);
    
    // Check if game is over
    const allLinesCompleted = updatedLines.every(line => line.completed);
    if (allLinesCompleted) {
      setGameOver(true);
      const winner = players.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
      );
      
      if (winner.score > 0) {
        toast.info(`Game Over! ${winner.name} wins with ${winner.score} points!`);
      } else {
        toast.info("Game Over! It's a tie!");
      }
    } else if (!squareCompleted) {
      // Switch player only if no square was completed
      // Find the next player in the cycle
      const currentPlayerIndex = players.findIndex(p => p.id === currentPlayer);
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      const nextPlayer = players[nextPlayerIndex].id;
      
      setCurrentPlayer(nextPlayer);
    }
  };

  // Apply grid size
  const applySettings = () => {
    setShowSettings(false);
    resetGame();
  };

  // Add a new player
  const addPlayer = () => {
    if (players.length >= 6) {
      toast.warning("Maximum 6 players allowed!");
      return;
    }
    
    const newPlayerId = players.length + 1;
    const playerColor = getNextPlayerColor(newPlayerId - 1);
    
    setPlayers([
      ...players,
      { 
        id: newPlayerId, 
        name: `Player ${newPlayerId}`, 
        color: playerColor.color,
        colorClass: playerColor.colorClass,
        score: 0 
      }
    ]);
    
    toast.success(`Added Player ${newPlayerId}`);
  };

  // Remove the last player
  const removePlayer = () => {
    if (players.length <= 2) {
      toast.warning("Minimum 2 players required!");
      return;
    }
    setPlayers(players.slice(0, -1));
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Game Board</h2>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-200 hover:bg-surface-300 dark:hover:bg-surface-600 flex items-center gap-2"
          >
            <SettingsIcon size={18} />
            <span className="hidden sm:inline">Settings</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="btn btn-primary flex items-center gap-2"
          >
            <RefreshCcwIcon size={18} />
            <span className="hidden sm:inline">New Game</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setInfoVisible(!infoVisible)}
            className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-200 hover:bg-surface-300 dark:hover:bg-surface-600"
            aria-label="Game rules"
          >
            <InfoIcon size={18} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {infoVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-surface-100 dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
              <h3 className="font-semibold text-lg mb-2">How to Play:</h3>
              <ul className="list-disc pl-5 space-y-1 text-surface-700 dark:text-surface-300">
                <li>Players take turns drawing lines between adjacent dots</li>
                <li>When a player completes a square, they earn a point and get another turn</li>
                <li>The player with the most squares when all lines are drawn wins!</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-surface-100 dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
              <h3 className="font-semibold text-lg mb-3">Game Settings</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Grid Size</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="3"
                    max="8"
                    value={gridSize}
                    onChange={(e) => setGridSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-surface-300 dark:bg-surface-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-lg font-medium w-8 text-center">{gridSize}</span>
                </div>
                <p className="text-xs text-surface-500 mt-1">Size: {gridSize}×{gridSize}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Players</label>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg font-medium">{players.length}</span>
                  <div className="flex space-x-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addPlayer}
                      className="p-1 rounded bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300"
                      aria-label="Add player"
                    >
                      <UserPlusIcon size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={removePlayer}
                      disabled={players.length <= 2}
                      className={`p-1 rounded ${
                        players.length <= 2 
                          ? 'bg-surface-200 dark:bg-surface-800 text-surface-400 dark:text-surface-600 cursor-not-allowed' 
                          : 'bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300'
                      }`}
                      aria-label="Remove player"
                    >
                      <UserMinusIcon size={18} />
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {players.map((player, index) => (
                    <div key={player.id} className="flex items-center space-x-2 p-2 rounded bg-surface-200 dark:bg-surface-700">
                      <div className={`w-3 h-3 rounded-full bg-${player.color}`}></div>
                      <span className="text-sm">{player.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-surface-500 mt-1">Add or remove players (2-6)</p>
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={applySettings}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <CheckIcon size={18} />
                  Apply
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="md:col-span-3 card overflow-hidden">
          <div className="flex justify-center items-center p-2 mb-4 overflow-auto">
            <div className="relative"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${gridSize * 2 - 1}, minmax(auto, 1fr))`,
                  gridTemplateRows: `repeat(${gridSize * 2 - 1}, minmax(auto, 1fr))`,
                  gap: "0px",
                  width: "100%",
                  maxWidth: "500px",
                  aspectRatio: "1/1"
                }}
            >
              {/* Render the dots and lines */}
              {dots.map((dot) => {
                const { x, y, id } = dot;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-center"
                    style={{
                      gridColumn: x * 2 + 1,
                      gridRow: y * 2 + 1,
                    }}
                  >
                    <div className="dot w-3 h-3 md:w-4 md:h-4"></div>
                  </div>
                );
              })}

              {/* Render horizontal lines */}
              {lines.filter(line => line.type === 'horizontal').map((line) => {
                const isCompleted = line.completed;
                const lineClass = isCompleted 
                  ? `line-h line-active-player${line.owner}` 
                  : "line-h";
                const [startX, startY] = line.start.split('-').map(Number);
                return (
                  <div
                    key={line.id}
                    className="flex items-center justify-center"
                    style={{
                      gridColumn: startX * 2 + 2,
                      gridRow: startY * 2 + 1,
                    }}
                    onClick={() => !isCompleted && handleLineClick(line.id)}
                  >
                    <div className={`${lineClass} w-full h-1 md:h-2`}></div>
                  </div>
                );
              })}

              {/* Render vertical lines */}
              {lines.filter(line => line.type === 'vertical').map((line) => {
                const isCompleted = line.completed;
                const lineClass = isCompleted 
                  ? `line-v line-active-player${line.owner}` 
                  : "line-v";
                const [startX, startY] = line.start.split('-').map(Number);
                return (
                  <div
                    key={line.id}
                    className="flex items-center justify-center"
                    style={{
                      gridColumn: startX * 2 + 1,
                      gridRow: startY * 2 + 2,
                    }}
                    onClick={() => !isCompleted && handleLineClick(line.id)}
                  >
                    <div className={`${lineClass} h-full w-1 md:w-2`}></div>
                  </div>
                );
              })}

              {/* Render squares */}
              {squares.map((square) => {
                const { id, owner } = square;
                if (!owner) return null;
                
                const [_, x, y] = id.split('-'); // sq-x-y
                const squareX = parseInt(x);
                const squareY = parseInt(y);
                
                return (
                  <div
                    key={id}
                    className={`square-player${owner} flex items-center justify-center text-xs md:text-sm font-semibold`}
                    style={{
                      gridColumn: squareX * 2 + 2,
                      gridRow: squareY * 2 + 2,
                      zIndex: -1
                    }}
                  >
                    <span className={owner === 1 ? "text-primary-dark" : "text-secondary-dark"}>
                      P{owner}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GripIcon size={20} className="text-surface-500" />
              Player Scores
            </h3>
            
            <div className="space-y-3">
              {players.map((player) => (
                <div 
                  key={player.id} 
                  className={`p-3 rounded-lg ${
                    currentPlayer === player.id && !gameOver
                      ? `bg-${player.color}/10 border border-${player.color}/30`
                      : "bg-surface-100 dark:bg-surface-800"
                  } flex justify-between items-center`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${player.colorClass}`}></div>
                    <span className="font-medium">{player.name}</span>
                  </div>
                  <div className="text-xl font-bold">
                    {player.score}
                  </div>
                </div>
              ))}
            </div>
            
            {gameOver && (
              <div className="mt-4 p-3 bg-surface-100 dark:bg-surface-800 rounded-lg text-center">
                <p className="font-medium text-surface-700 dark:text-surface-300">
                  Game Over! 
                  {(() => {
                    // Find player(s) with highest score
                    const maxScore = Math.max(...players.map(p => p.score));
                    const winners = players.filter(p => p.score === maxScore);
                    
                    if (winners.length > 1) {
                      return " It's a tie between " + winners.map(w => w.name).join(", ") + "!";
                    } else if (winners.length === 1) {
                      return ` ${winners[0].name} wins!`;
                    }
                    return "";
                  })()}
                </p>
              </div>
            )}
          </div>
          
          {!gameOver && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Current Turn</h3>
              {players.find(p => p.id === currentPlayer) && (
              <div className={`p-3 rounded-lg bg-${players.find(p => p.id === currentPlayer).colorClass}/10 border border-${players.find(p => p.id === currentPlayer).colorClass}/30`}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${players.find(p => p.id === currentPlayer).colorClass}`}></div>
                  <span className="font-medium">{players.find(p => p.id === currentPlayer)?.name}'s Turn</span>
                </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainFeature;