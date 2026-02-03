import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameEngine } from '../game/useGameEngine';
import { Candy } from './Candy';
import { BOARD_ROWS, BOARD_COLS } from '../game/Board';
import { ParticleEffect } from './ParticleEffect';
import './GameBoard.css';

const CELL_SIZE = 65;

export const GameBoard: React.FC = () => {
    const {
        board,
        score,
        moves,
        combo,
        phase,
        selectedCandy,
        lastMatches,
        selectCandy,
        swapByDrag,
        resetGame,
    } = useGameEngine();

    return (
        <div className="game-container">
            {/* 점수판 */}
            <div className="score-panel">
                <div className="score-item">
                    <span className="label">점수</span>
                    <motion.span
                        className="value"
                        key={score}
                        initial={{ scale: 1.5, color: '#ffd700' }}
                        animate={{ scale: 1, color: '#ffffff' }}
                        transition={{ duration: 0.3 }}
                    >
                        {score.toLocaleString()}
                    </motion.span>
                </div>
                <div className="score-item">
                    <span className="label">이동</span>
                    <span className="value moves">{moves}</span>
                </div>
                {combo > 1 && (
                    <motion.div
                        className="combo-display"
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                    >
                        <span className="combo-text">x{combo}</span>
                        <span className="combo-label">콤보!</span>
                    </motion.div>
                )}
            </div>

            {/* 게임 보드 */}
            <div
                className="game-board"
                style={{
                    width: CELL_SIZE * BOARD_COLS,
                    height: CELL_SIZE * BOARD_ROWS,
                }}
            >
                {/* 배경 그리드 */}
                <div className="board-background">
                    {Array.from({ length: BOARD_ROWS * BOARD_COLS }).map((_, i) => (
                        <div
                            key={i}
                            className={`grid-cell ${(Math.floor(i / BOARD_COLS) + i % BOARD_COLS) % 2 === 0 ? 'even' : 'odd'}`}
                            style={{
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                            }}
                        />
                    ))}
                </div>

                {/* 캔디들 */}
                <div className="candies-layer">
                    <AnimatePresence>
                        {board.map((row, rowIndex) =>
                            row.map((candy, colIndex) =>
                                candy && (
                                    <Candy
                                        key={candy.id}
                                        candy={candy}
                                        isSelected={
                                            selectedCandy?.row === rowIndex &&
                                            selectedCandy?.col === colIndex
                                        }
                                        onClick={() => selectCandy(rowIndex, colIndex)}
                                        onSwipe={(direction) => swapByDrag(rowIndex, colIndex, direction)}
                                        cellSize={CELL_SIZE}
                                        isDragging={phase === 'swapping'}
                                    />
                                )
                            )
                        )}
                    </AnimatePresence>
                </div>

                {/* 파티클 효과 */}
                <AnimatePresence>
                    {phase === 'matching' && lastMatches.length > 0 && (
                        <ParticleEffect matches={lastMatches} cellSize={CELL_SIZE} />
                    )}
                </AnimatePresence>
            </div>

            {/* 게임 오버 또는 리셋 */}
            {moves <= 0 && (
                <motion.div
                    className="game-over"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <h2>게임 종료!</h2>
                    <p>최종 점수: {score.toLocaleString()}</p>
                    <button className="reset-button" onClick={resetGame}>
                        다시 시작
                    </button>
                </motion.div>
            )}

            <button className="reset-button small" onClick={resetGame}>
                🔄 새 게임
            </button>
        </div>
    );
};
