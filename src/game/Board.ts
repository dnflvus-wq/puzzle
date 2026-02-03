import type { Candy } from './CandyTypes';
import { CandyType, createCandy } from './CandyTypes';

export const BOARD_ROWS = 8;
export const BOARD_COLS = 8;

export type Board = (Candy | null)[][];

// 보드 초기화 (매칭 없이 시작)
export const createBoard = (): Board => {
    const board: Board = [];

    for (let row = 0; row < BOARD_ROWS; row++) {
        board[row] = [];
        for (let col = 0; col < BOARD_COLS; col++) {
            let candy = createCandy(row, col);

            // 초기 매칭 방지: 같은 타입이 3개 연속되지 않도록
            while (wouldCreateMatch(board, row, col, candy.type)) {
                candy = createCandy(row, col);
            }

            board[row][col] = candy;
        }
    }

    return board;
};

// 매칭 여부 확인 (초기화 시)
const wouldCreateMatch = (board: Board, row: number, col: number, type: CandyType): boolean => {
    // 가로 체크: 왼쪽 2개가 같은 타입인지
    if (col >= 2) {
        const left1 = board[row][col - 1];
        const left2 = board[row][col - 2];
        if (left1 && left2 && left1.type === type && left2.type === type) {
            return true;
        }
    }

    // 세로 체크: 위쪽 2개가 같은 타입인지
    if (row >= 2) {
        const up1 = board[row - 1][col];
        const up2 = board[row - 2][col];
        if (up1 && up2 && up1.type === type && up2.type === type) {
            return true;
        }
    }

    return false;
};

// 두 캔디 스왑
export const swapCandies = (board: Board, pos1: { row: number; col: number }, pos2: { row: number; col: number }): Board => {
    const newBoard = board.map(row => [...row]);
    const candy1 = newBoard[pos1.row][pos1.col];
    const candy2 = newBoard[pos2.row][pos2.col];

    if (candy1 && candy2) {
        // 객체 불변성 유지를 위해 복사본 생성
        const newCandy1 = { ...candy1, row: pos2.row, col: pos2.col };
        const newCandy2 = { ...candy2, row: pos1.row, col: pos1.col };

        // 스왑 (복사된 새 객체를 할당)
        newBoard[pos1.row][pos1.col] = newCandy2;
        newBoard[pos2.row][pos2.col] = newCandy1;
    }

    return newBoard;
};

// 인접한 위치인지 확인
export const isAdjacent = (pos1: { row: number; col: number }, pos2: { row: number; col: number }): boolean => {
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

// 보드 복사
export const cloneBoard = (board: Board): Board => {
    return board.map(row =>
        row.map(candy => candy ? { ...candy } : null)
    );
};
