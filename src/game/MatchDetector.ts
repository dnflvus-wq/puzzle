import type { Board } from './Board';
import { BOARD_ROWS, BOARD_COLS } from './Board';
import type { Candy } from './CandyTypes';
import { SpecialType } from './CandyTypes';

export interface Match {
    candies: Candy[];
    type: 'horizontal' | 'vertical' | 'L' | 'T';
    specialToCreate?: SpecialType;
}

// 모든 매칭 찾기
export const findAllMatches = (board: Board): Match[] => {
    const matches: Match[] = [];
    const visited = new Set<string>();

    // 가로 매칭 찾기
    for (let row = 0; row < BOARD_ROWS; row++) {
        for (let col = 0; col < BOARD_COLS - 2; col++) {
            const candy = board[row][col];
            if (!candy) continue;

            const matchCandies: Candy[] = [candy];
            let c = col + 1;

            while (c < BOARD_COLS) {
                const next = board[row][c];
                if (next && next.type === candy.type) {
                    matchCandies.push(next);
                    c++;
                } else {
                    break;
                }
            }

            if (matchCandies.length >= 3) {
                const key = matchCandies.map(c => `${c.row}-${c.col}`).sort().join('|');
                if (!visited.has(key)) {
                    visited.add(key);
                    matches.push({
                        candies: matchCandies,
                        type: 'horizontal',
                        specialToCreate: getSpecialType(matchCandies.length, 'horizontal'),
                    });
                }
            }
        }
    }

    // 세로 매칭 찾기
    for (let col = 0; col < BOARD_COLS; col++) {
        for (let row = 0; row < BOARD_ROWS - 2; row++) {
            const candy = board[row][col];
            if (!candy) continue;

            const matchCandies: Candy[] = [candy];
            let r = row + 1;

            while (r < BOARD_ROWS) {
                const next = board[r][col];
                if (next && next.type === candy.type) {
                    matchCandies.push(next);
                    r++;
                } else {
                    break;
                }
            }

            if (matchCandies.length >= 3) {
                const key = matchCandies.map(c => `${c.row}-${c.col}`).sort().join('|');
                if (!visited.has(key)) {
                    visited.add(key);
                    matches.push({
                        candies: matchCandies,
                        type: 'vertical',
                        specialToCreate: getSpecialType(matchCandies.length, 'vertical'),
                    });
                }
            }
        }
    }

    return matches;
};

// 매칭 길이에 따른 특수 캔디 타입 결정
const getSpecialType = (length: number, direction: 'horizontal' | 'vertical'): SpecialType | undefined => {
    if (length === 4) {
        return direction === 'horizontal' ? SpecialType.STRIPED_H : SpecialType.STRIPED_V;
    }
    if (length >= 5) {
        return SpecialType.COLOR_BOMB;
    }
    return undefined;
};

// 매칭된 캔디들 마킹
export const markMatchedCandies = (board: Board, matches: Match[]): Board => {
    const newBoard = board.map(row => row.map(candy => candy ? { ...candy } : null));

    for (const match of matches) {
        for (const candy of match.candies) {
            const boardCandy = newBoard[candy.row][candy.col];
            if (boardCandy) {
                boardCandy.isMatched = true;
            }
        }
    }

    return newBoard;
};

// 매칭된 캔디 제거
export const removeMatchedCandies = (board: Board): Board => {
    return board.map(row =>
        row.map(candy => (candy && candy.isMatched ? null : candy))
    );
};

// 점수 계산
export const calculateScore = (matches: Match[]): number => {
    let score = 0;
    for (const match of matches) {
        const baseScore = match.candies.length * 10;
        const multiplier = match.candies.length > 3 ? match.candies.length - 2 : 1;
        score += baseScore * multiplier;
    }
    return score;
};

// 유효한 스왑인지 확인 (매칭이 발생하는지)
export const isValidSwap = (board: Board): boolean => {
    const matches = findAllMatches(board);
    return matches.length > 0;
};
