"use client";

import React, { useState, useEffect, useCallback, startTransition, useRef } from "react";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const EMPTY_CELL = 0;

interface TetrominoDef {
  shape: number[][];
  color: string;
}

const TETROMINOES: Record<string, TetrominoDef> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "#06B6D4",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#EAB308",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#A855F7",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "#22C55E",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "#EF4444",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#3B82F6",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#F97316",
  },
};

const TETROMINO_KEYS = Object.keys(TETROMINOES);

interface Piece {
  shape: number[][];
  color: string;
  position: { x: number; y: number };
  type: string;
}

export interface BlockGameProps {
  backgroundColor?: string;
  boardBackgroundColor?: string;
  headerBackgroundColor?: string;
  cellBorderColor?: string;
  placedBlockColor?: string;
  textColor?: string;
  cardBackgroundColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  borderRadius?: number;
  cellSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

const getInitialPreviewBoard = (): number[][] => {
  const b = Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL));
  // Render demo blocks at the bottom so the grid is vibrant and not blank
  b[15][4] = 1; b[15][5] = 1;
  b[16][1] = 1; b[16][2] = 1; b[16][4] = 1; b[16][5] = 1; b[16][7] = 1; b[16][8] = 1;
  b[17][0] = 1; b[17][1] = 1; b[17][2] = 1; b[17][4] = 1; b[17][7] = 1; b[17][8] = 1;
  b[18][0] = 1; b[18][2] = 1; b[18][3] = 1; b[18][5] = 1; b[18][6] = 1; b[18][7] = 1; b[18][8] = 1;
  b[19][0] = 1; b[19][1] = 1; b[19][2] = 1; b[19][3] = 1; b[19][5] = 1; b[19][6] = 1; b[19][7] = 1; b[19][8] = 1;
  // Falling tetromino preview at rows 7-8
  b[7][4] = 2;
  b[8][3] = 2; b[8][4] = 2; b[8][5] = 2;
  return b;
};

export default function BlockGame({
  backgroundColor = "#FFFFFF",
  boardBackgroundColor = "#FFFFFF",
  headerBackgroundColor = "#F5EFEB",
  cellBorderColor = "rgba(0, 0, 0, 0.08)",
  placedBlockColor = "#374151",
  textColor = "#111827",
  cardBackgroundColor = "#FFFFFF",
  buttonColor = "#111827",
  buttonTextColor = "#FFFFFF",
  borderRadius = 16,
  cellSize = 9.5,
  className = "",
  style = {},
}: BlockGameProps) {
  const [board, setBoard] = useState<number[][]>(getInitialPreviewBoard);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const createNewPiece = useCallback((): Piece => {
    const randomType =
      TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
    const tetromino = TETROMINOES[randomType];
    return {
      shape: tetromino.shape,
      color: tetromino.color,
      position: {
        x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
        y: 0,
      },
      type: randomType,
    };
  }, []);

  const canPlacePiece = useCallback(
    (piece: Piece, newPosition: { x: number; y: number }) => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = newPosition.x + x;
            const newY = newPosition.y + y;
            if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
              return false;
            }
            if (newY >= 0 && board[newY][newX] !== EMPTY_CELL) {
              return false;
            }
          }
        }
      }
      return true;
    },
    [board]
  );

  const rotatePiece = useCallback((piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map((row) => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  const placePieceOnBoard = useCallback(
    (piece: Piece) => {
      const newBoard = board.map((row) => [...row]);
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const boardY = piece.position.y + y;
            const boardX = piece.position.x + x;
            if (boardY >= 0) {
              newBoard[boardY][boardX] = 1;
            }
          }
        }
      }
      return newBoard;
    },
    [board]
  );

  const clearLines = useCallback((boardToClear: number[][]) => {
    const newBoard = boardToClear.filter((row) =>
      row.some((cell) => cell === EMPTY_CELL)
    );
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL));
    }
    return { newBoard, linesCleared };
  }, []);

  const movePieceDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const newPosition = {
      ...currentPiece.position,
      y: currentPiece.position.y + 1,
    };
    if (canPlacePiece(currentPiece, newPosition)) {
      startTransition(() => {
        setCurrentPiece({ ...currentPiece, position: newPosition });
      });
    } else {
      const newBoard = placePieceOnBoard(currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      const points = [0, 40, 100, 300, 1200][linesCleared] * level;
      startTransition(() => {
        setBoard(clearedBoard);
        setScore((prev) => prev + points);
        setLines((prev) => prev + linesCleared);
        const nextPiece = createNewPiece();
        if (canPlacePiece(nextPiece, nextPiece.position)) {
          setCurrentPiece(nextPiece);
        } else {
          setGameOver(true);
        }
      });
    }
  }, [
    currentPiece,
    gameOver,
    isPaused,
    canPlacePiece,
    placePieceOnBoard,
    clearLines,
    level,
    createNewPiece,
  ]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent | KeyboardEvent) => {
      if (!currentPiece || gameOver || isPaused || !gameStarted) return;
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          const leftPosition = {
            ...currentPiece.position,
            x: currentPiece.position.x - 1,
          };
          if (canPlacePiece(currentPiece, leftPosition)) {
            startTransition(() =>
              setCurrentPiece({ ...currentPiece, position: leftPosition })
            );
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          const rightPosition = {
            ...currentPiece.position,
            x: currentPiece.position.x + 1,
          };
          if (canPlacePiece(currentPiece, rightPosition)) {
            startTransition(() =>
              setCurrentPiece({ ...currentPiece, position: rightPosition })
            );
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          movePieceDown();
          break;
        case "ArrowUp":
        case " ":
          event.preventDefault();
          const rotated = rotatePiece(currentPiece);
          if (canPlacePiece(rotated, rotated.position)) {
            startTransition(() => setCurrentPiece(rotated));
          }
          break;
      }
    },
    [currentPiece, gameOver, isPaused, canPlacePiece, movePieceDown, rotatePiece, gameStarted]
  );

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        handleKeyPress(e);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameStarted, gameOver, isPaused, handleKeyPress]);

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;
    const speed = Math.max(100, 800 - (level - 1) * 70);
    const interval = setInterval(movePieceDown, speed);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, isPaused, level, movePieceDown]);

  useEffect(() => {
    startTransition(() => setLevel(Math.floor(lines / 10) + 1));
  }, [lines]);

  const startGame = () => {
    startTransition(() => {
      setBoard(
        Array(BOARD_HEIGHT)
          .fill(null)
          .map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL))
      );
      setCurrentPiece(createNewPiece());
      setScore(0);
      setLevel(1);
      setLines(0);
      setGameOver(false);
      setIsPaused(false);
      setGameStarted(true);
    });
    setTimeout(() => {
      wrapperRef.current?.focus();
    }, 50);
  };

  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.position.y + y;
            const boardX = currentPiece.position.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = 2;
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} style={{ display: "flex" }}>
        {row.map((cell, x) => (
          <div
            key={x}
            style={{
              width: cellSize,
              height: cellSize,
              border: `1px solid ${cellBorderColor}`,
              backgroundColor:
                cell === 1
                  ? placedBlockColor
                  : cell === 2
                  ? currentPiece?.color || "#6B7280"
                  : "#FFFFFF",
              boxSizing: "border-box",
            }}
          />
        ))}
      </div>
    ));
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: cardBackgroundColor,
    borderRadius: 7,
    padding: "5px 9px",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
  };

  const statLabelStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: 9,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.02em",
  };

  const statValueStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: 13.5,
    fontWeight: "bold",
    color: textColor,
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: buttonColor,
    color: buttonTextColor,
    border: "none",
    borderRadius: 7,
    padding: "6px 11px",
    cursor: "pointer",
    width: "100%",
    fontFamily: "monospace",
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: "0.02em",
  };

  const outlineButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "transparent",
    border: `1px solid ${buttonColor}`,
    color: buttonColor,
  };

  return (
    <div
      ref={wrapperRef}
      tabIndex={0}
      onKeyDown={handleKeyPress}
      aria-label="Block Game - Tetris game board"
      role="application"
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.04)",
        outline: "none",
        width: "fit-content",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Tan/cream Header Background */}
      <div
        style={{
          width: "100%",
          backgroundColor: headerBackgroundColor,
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h3
          style={{
            fontFamily: "monospace",
            fontSize: 13.5,
            fontWeight: 700,
            color: "#2D2A26",
            margin: 0,
            letterSpacing: "-0.01em",
            textAlign: "center",
          }}
        >
          Block Game
        </h3>
      </div>

      <div
        style={{
          padding: "10px 12px 12px 12px",
          display: "flex",
          gap: 10,
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {/* Game Board Box (white background) */}
        <div
          style={{
            backgroundColor: boardBackgroundColor,
            borderRadius: 6,
            padding: 2,
            border: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              border: `1.5px solid ${cellBorderColor}`,
              backgroundColor: boardBackgroundColor,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            {renderBoard()}
          </div>
        </div>

        {/* Side Stats (consistent internal spacing) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            minWidth: 92,
          }}
        >
          <div style={cardStyle}>
            <div style={statLabelStyle}>Score</div>
            <div style={statValueStyle}>{score}</div>
          </div>

          <div style={cardStyle}>
            <div style={statLabelStyle}>Level</div>
            <div style={statValueStyle}>{level}</div>
          </div>

          <div style={cardStyle}>
            <div style={statLabelStyle}>Lines</div>
            <div style={statValueStyle}>{lines}</div>
          </div>

          <div style={cardStyle}>
            <div style={{ ...statLabelStyle, marginBottom: 2 }}>Controls</div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                lineHeight: 1.35,
                color: "#4B5563",
              }}
            >
              <div>← → Move</div>
              <div>↓ Soft drop</div>
              <div>↑ / Space Rotate</div>
            </div>
          </div>

          <div>
            {!gameStarted || gameOver ? (
              <button
                onClick={startGame}
                style={buttonStyle}
                className="hover:opacity-90 active:scale-95 cursor-pointer transition-all"
              >
                {gameOver ? "Play Again" : "Start Game"}
              </button>
            ) : (
              <button
                onClick={() =>
                  startTransition(() => setIsPaused((prev) => !prev))
                }
                style={outlineButtonStyle}
                className="hover:bg-black/5 active:scale-95 cursor-pointer transition-all"
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
            )}
          </div>

          {/* Red banner when game ends */}
          {gameOver && (
            <div
              style={{
                backgroundColor: "#DC2626",
                color: "#FFFFFF",
                borderRadius: 7,
                padding: "6px 5px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(220, 38, 38, 0.35)",
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  fontSize: 9.5,
                  letterSpacing: "-0.01em",
                }}
              >
                Game Over!
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 8.5,
                  opacity: 0.95,
                  marginTop: 1,
                }}
              >
                Final Score: {score}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
