import type { Board } from './Board';
import { BOARD_ROWS, BOARD_COLS } from './Board';
import { createCandy } from './CandyTypes';

// 빈 공간으로 캔디 떨어뜨리기
export const applyGravity = (board: Board): { board: Board; hasMoved: boolean } => {
    const newBoard = board.map(row => row.map(candy => candy ? { ...candy } : null));
    let hasMoved = false;

    // 각 열에 대해 아래에서 위로 순회
    for (let col = 0; col < BOARD_COLS; col++) {
        let writeRow = BOARD_ROWS - 1;

        for (let row = BOARD_ROWS - 1; row >= 0; row--) {
            const candy = newBoard[row][col];
            if (candy) {
                if (row !== writeRow) {
                    // 캔디를 아래로 이동 (불변성 유지 - 새 객체 생성)
                    const movedCandy = { ...candy, row: writeRow, isNew: false };
                    newBoard[writeRow][col] = movedCandy;
                    newBoard[row][col] = null;
                    hasMoved = true;
                } else {
                    // 제자리에 있어도 새 객체로 교체 (참조 문제 방지)
                    newBoard[row][col] = { ...candy, isNew: false };
                }
                writeRow--;
            }
        }
    }

    return { board: newBoard, hasMoved };
};

// 빈 공간에 새 캔디 채우기
export const fillEmptySpaces = (board: Board): { board: Board; newCandies: { row: number; col: number }[] } => {
    const newBoard = board.map(row => row.map(candy => candy ? { ...candy } : null));
    const newCandies: { row: number; col: number }[] = [];

    for (let col = 0; col < BOARD_COLS; col++) {
        for (let row = 0; row < BOARD_ROWS; row++) {
            if (!newBoard[row][col]) {
                const candy = createCandy(row, col);
                candy.isNew = true;
                newBoard[row][col] = candy;
                newCandies.push({ row, col });
            }
        }
    }

    return { board: newBoard, newCandies };
};

// 중력 + 채우기 한 번에 수행
export const dropAndFill = (board: Board): { board: Board; hasChanges: boolean } => {
    let currentBoard = board;
    let hasChanges = false;

    // 중력 적용
    const gravityResult = applyGravity(currentBoard);
    currentBoard = gravityResult.board;
    hasChanges = hasChanges || gravityResult.hasMoved;

    // 빈 공간 채우기
    const fillResult = fillEmptySpaces(currentBoard);
    currentBoard = fillResult.board;
    hasChanges = hasChanges || fillResult.newCandies.length > 0;

    return { board: currentBoard, hasChanges };
};
