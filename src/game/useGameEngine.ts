import { useReducer, useCallback, useEffect, useRef } from 'react';
import type { Board } from './Board';
import { createBoard, swapCandies, isAdjacent, cloneBoard } from './Board';
import type { Match } from './MatchDetector';
import { findAllMatches, markMatchedCandies, removeMatchedCandies, calculateScore } from './MatchDetector';
import { dropAndFill } from './GravitySystem';

export type GamePhase = 'idle' | 'swapping' | 'matching' | 'dropping' | 'checking';

interface GameState {
    board: Board;
    score: number;
    moves: number;
    combo: number;
    phase: GamePhase;
    selectedCandy: { row: number; col: number } | null;
    lastMatches: Match[];
    isAnimating: boolean;
}

type GameAction =
    | { type: 'SELECT_CANDY'; row: number; col: number }
    | { type: 'SWAP_CANDIES'; pos1: { row: number; col: number }; pos2: { row: number; col: number } }
    | { type: 'REVERT_SWAP'; pos1: { row: number; col: number }; pos2: { row: number; col: number } }
    | { type: 'PROCESS_MATCHES'; matches: Match[] }
    | { type: 'REMOVE_MATCHED' }
    | { type: 'APPLY_GRAVITY' }
    | { type: 'SET_PHASE'; phase: GamePhase }
    | { type: 'SET_ANIMATING'; isAnimating: boolean }
    | { type: 'RESET_COMBO' }
    | { type: 'RESET_GAME' };

const initialState: GameState = {
    board: createBoard(),
    score: 0,
    moves: 30,
    combo: 0,
    phase: 'idle',
    selectedCandy: null,
    lastMatches: [],
    isAnimating: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'SELECT_CANDY':
            if (state.phase !== 'idle' || state.isAnimating) return state;

            if (state.selectedCandy) {
                const pos1 = state.selectedCandy;
                const pos2 = { row: action.row, col: action.col };

                // 같은 캔디 클릭 -> 선택 해제
                if (pos1.row === pos2.row && pos1.col === pos2.col) {
                    return { ...state, selectedCandy: null };
                }

                // 인접하지 않으면 새로운 캔디 선택
                if (!isAdjacent(pos1, pos2)) {
                    return { ...state, selectedCandy: pos2 };
                }

                // 인접하면 스왑 시도
                return { ...state, phase: 'swapping', selectedCandy: null };
            }

            return { ...state, selectedCandy: { row: action.row, col: action.col } };

        case 'SWAP_CANDIES': {
            const newBoard = swapCandies(cloneBoard(state.board), action.pos1, action.pos2);
            return { ...state, board: newBoard };
        }

        case 'REVERT_SWAP': {
            const revertedBoard = swapCandies(cloneBoard(state.board), action.pos1, action.pos2);
            return { ...state, board: revertedBoard, phase: 'idle' };
        }

        case 'PROCESS_MATCHES': {
            const markedBoard = markMatchedCandies(state.board, action.matches);
            const scoreGained = calculateScore(action.matches) * (state.combo + 1);
            return {
                ...state,
                board: markedBoard,
                score: state.score + scoreGained,
                combo: state.combo + 1,
                lastMatches: action.matches,
                phase: 'matching',
            };
        }

        case 'REMOVE_MATCHED': {
            const clearedBoard = removeMatchedCandies(state.board);
            return { ...state, board: clearedBoard, phase: 'dropping' };
        }

        case 'APPLY_GRAVITY': {
            const result = dropAndFill(state.board);
            return { ...state, board: result.board, phase: 'checking' };
        }

        case 'SET_PHASE':
            return { ...state, phase: action.phase };

        case 'SET_ANIMATING':
            return { ...state, isAnimating: action.isAnimating };

        case 'RESET_COMBO':
            return { ...state, combo: 0, moves: state.moves - 1 };

        case 'RESET_GAME':
            return { ...initialState, board: createBoard() };

        default:
            return state;
    }
}

export const useGameEngine = () => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const pendingSwapRef = useRef<{ pos1: { row: number; col: number }; pos2: { row: number; col: number } } | null>(null);

    const selectCandy = useCallback((row: number, col: number) => {
        if (state.phase !== 'idle') return;

        if (state.selectedCandy) {
            const pos1 = state.selectedCandy;
            const pos2 = { row, col };

            if (pos1.row === pos2.row && pos1.col === pos2.col) {
                dispatch({ type: 'SELECT_CANDY', row, col });
                return;
            }

            if (isAdjacent(pos1, pos2)) {
                pendingSwapRef.current = { pos1, pos2 };
                dispatch({ type: 'SET_PHASE', phase: 'swapping' });
                dispatch({ type: 'SWAP_CANDIES', pos1, pos2 });
                return;
            }
        }

        dispatch({ type: 'SELECT_CANDY', row, col });
    }, [state.selectedCandy, state.phase]);

    // 드래그로 스왑
    const swapByDrag = useCallback((row: number, col: number, direction: 'up' | 'down' | 'left' | 'right') => {
        if (state.phase !== 'idle') return;

        const pos1 = { row, col };
        let pos2: { row: number; col: number };

        switch (direction) {
            case 'up':
                pos2 = { row: row - 1, col };
                break;
            case 'down':
                pos2 = { row: row + 1, col };
                break;
            case 'left':
                pos2 = { row, col: col - 1 };
                break;
            case 'right':
                pos2 = { row, col: col + 1 };
                break;
        }

        // 범위 체크
        if (pos2.row < 0 || pos2.row >= 8 || pos2.col < 0 || pos2.col >= 8) return;

        pendingSwapRef.current = { pos1, pos2 };
        dispatch({ type: 'SET_PHASE', phase: 'swapping' });
        dispatch({ type: 'SWAP_CANDIES', pos1, pos2 });
    }, [state.phase]);

    // 게임 로직 처리
    useEffect(() => {
        const processGame = async () => {
            if (state.isAnimating) return;

            switch (state.phase) {
                case 'swapping': {
                    dispatch({ type: 'SET_ANIMATING', isAnimating: true });
                    await new Promise(resolve => setTimeout(resolve, 300));

                    const matches = findAllMatches(state.board);
                    if (matches.length > 0) {
                        dispatch({ type: 'PROCESS_MATCHES', matches });
                    } else if (pendingSwapRef.current) {
                        // 매칭 없으면 되돌리기
                        dispatch({ type: 'REVERT_SWAP', pos1: pendingSwapRef.current.pos1, pos2: pendingSwapRef.current.pos2 });
                        pendingSwapRef.current = null;
                    }
                    dispatch({ type: 'SET_ANIMATING', isAnimating: false });
                    break;
                }

                case 'matching': {
                    dispatch({ type: 'SET_ANIMATING', isAnimating: true });
                    await new Promise(resolve => setTimeout(resolve, 400));
                    dispatch({ type: 'REMOVE_MATCHED' });
                    dispatch({ type: 'SET_ANIMATING', isAnimating: false });
                    break;
                }

                case 'dropping': {
                    dispatch({ type: 'SET_ANIMATING', isAnimating: true });
                    await new Promise(resolve => setTimeout(resolve, 350));
                    dispatch({ type: 'APPLY_GRAVITY' });
                    dispatch({ type: 'SET_ANIMATING', isAnimating: false });
                    break;
                }

                case 'checking': {
                    const matches = findAllMatches(state.board);
                    if (matches.length > 0) {
                        dispatch({ type: 'PROCESS_MATCHES', matches });
                    } else {
                        dispatch({ type: 'RESET_COMBO' });
                        dispatch({ type: 'SET_PHASE', phase: 'idle' });
                        pendingSwapRef.current = null;
                    }
                    break;
                }
            }
        };

        processGame();
    }, [state.phase, state.isAnimating, state.board]);

    const resetGame = useCallback(() => {
        dispatch({ type: 'RESET_GAME' });
    }, []);

    return {
        board: state.board,
        score: state.score,
        moves: state.moves,
        combo: state.combo,
        phase: state.phase,
        selectedCandy: state.selectedCandy,
        lastMatches: state.lastMatches,
        isAnimating: state.isAnimating,
        selectCandy,
        swapByDrag,
        resetGame,
    };
};
