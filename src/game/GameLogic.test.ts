import { describe, it, expect } from 'vitest';
import { createBoard, swapCandies, BOARD_ROWS, BOARD_COLS } from './Board';
import { findAllMatches, markMatchedCandies, removeMatchedCandies } from './MatchDetector';
import { dropAndFill } from './GravitySystem';
import { createCandy, CandyType, SpecialType } from './CandyTypes';

describe('Candy Crush Game Logic', () => {
    it('should create an 8x8 board without initial matches', () => {
        const board = createBoard();
        expect(board.length).toBe(BOARD_ROWS);
        expect(board[0].length).toBe(BOARD_COLS);

        // 모든 셀에 캔디가 있어야 함
        for (let row = 0; row < BOARD_ROWS; row++) {
            for (let col = 0; col < BOARD_COLS; col++) {
                expect(board[row][col]).not.toBeNull();
            }
        }

        // 초기 매칭이 없어야 함
        const matches = findAllMatches(board);
        expect(matches.length).toBe(0);
    });

    it('should swap candies correctly', () => {
        const board = createBoard();
        const pos1 = { row: 0, col: 0 };
        const pos2 = { row: 0, col: 1 };

        const candy1 = board[pos1.row][pos1.col];
        const candy2 = board[pos2.row][pos2.col];

        if (!candy1 || !candy2) throw new Error('Candies init failed');

        const newBoard = swapCandies(board, pos1, pos2);

        expect(newBoard[pos1.row][pos1.col]?.id).toBe(candy2.id);
        expect(newBoard[pos2.row][pos2.col]?.id).toBe(candy1.id);
    });

    it('should detect horizontal matches', () => {
        const board = createBoard();

        // 강제로 가로 3개 매칭 생성
        // (0,0), (0,1), (0,2)를 RED로 설정
        board[0][0] = createCandy(0, 0, CandyType.RED);
        board[0][1] = createCandy(0, 1, CandyType.RED);
        board[0][2] = createCandy(0, 2, CandyType.RED);

        // (0,3)은 다른 색으로 설정하여 4개 매칭 방지 (랜덤 생성 변수 제거)
        board[0][3] = createCandy(0, 3, CandyType.BLUE);

        const matches = findAllMatches(board);
        // 정확히 우리가 만든 (0,0) 시작 매칭 찾기
        const horizontalMatch = matches.find(m =>
            m.type === 'horizontal' &&
            m.candies.some(c => c.row === 0 && c.col === 0)
        );

        expect(horizontalMatch).toBeDefined();
        expect(horizontalMatch?.candies.length).toBe(3);
        expect(horizontalMatch?.candies[0].type).toBe(CandyType.RED);
    });

    it('should detect vertical matches', () => {
        const board = createBoard();

        // 강제로 세로 3개 매칭 생성
        // (0,0), (1,0), (2,0)를 BLUE로 설정
        board[0][0] = createCandy(0, 0, CandyType.BLUE);
        board[1][0] = createCandy(1, 0, CandyType.BLUE);
        board[2][0] = createCandy(2, 0, CandyType.BLUE);

        // (3,0)은 다른 색으로 설정 (랜덤 변수 제거)
        board[3][0] = createCandy(3, 0, CandyType.RED);

        const matches = findAllMatches(board);
        const verticalMatch = matches.find(m =>
            m.type === 'vertical' &&
            m.candies.some(c => c.row === 0 && c.col === 0)
        );

        expect(verticalMatch).toBeDefined();
        expect(verticalMatch?.candies.length).toBe(3);
    });

    it('should detect special candies (4 match)', () => {
        const board = createBoard();

        // 강제로 가로 4개 매칭 생성 -> STRIPED_H
        board[1][0] = createCandy(1, 0, CandyType.GREEN);
        board[1][1] = createCandy(1, 1, CandyType.GREEN);
        board[1][2] = createCandy(1, 2, CandyType.GREEN);
        board[1][3] = createCandy(1, 3, CandyType.GREEN);

        // (1,4)는 다른 색으로 설정 (5개 매칭 방지)
        board[1][4] = createCandy(1, 4, CandyType.RED);

        const matches = findAllMatches(board);
        const match = matches.find(m =>
            m.type === 'horizontal' &&
            m.candies.length === 4 &&
            m.candies.some(c => c.row === 1 && c.col === 0)
        );

        expect(match).toBeDefined();
        expect(match?.specialToCreate).toBe(SpecialType.STRIPED_H);
    });

    it('should remove matched candies and fill empty spaces', () => {
        let board = createBoard();

        // 매칭 생성 및 제거 시뮬레이션
        board[0][0] = createCandy(0, 0, CandyType.PURPLE);
        board[0][1] = createCandy(0, 1, CandyType.PURPLE);
        board[0][2] = createCandy(0, 2, CandyType.PURPLE);

        const matches = findAllMatches(board);
        expect(matches.length).toBeGreaterThan(0);

        board = markMatchedCandies(board, matches);
        board = removeMatchedCandies(board);

        // 제거된 자리는 비어있어야 함 (Gravity 적용 전)
        expect(board[0][0]).toBeNull();
        expect(board[0][1]).toBeNull();
        expect(board[0][2]).toBeNull();

        // 중력 및 채우기 적용
        const result = dropAndFill(board);
        const filledBoard = result.board;

        // 빈 자리가 채워져야 함
        expect(filledBoard[0][0]).not.toBeNull();
        expect(filledBoard[0][1]).not.toBeNull();
        expect(filledBoard[0][2]).not.toBeNull();
    });
});
