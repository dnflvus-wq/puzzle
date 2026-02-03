import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Candy as CandyData } from '../game/CandyTypes';
import { CANDY_COLORS, SpecialType } from '../game/CandyTypes';
import './Candy.css';

// 캔디 이미지 에셋
import {
    RedBean, OrangeLozenge, YellowDrop, GreenSquare, BlueSphere, PurpleFlower, ColorBomb
} from './CandyShapes';

interface CandyProps {
    candy: CandyData;
    isSelected: boolean;
    onClick: () => void;
    onSwipe: (direction: 'up' | 'down' | 'left' | 'right') => void;
    cellSize: number;
    isDragging: boolean;
}

export const Candy: React.FC<CandyProps> = ({ candy, isSelected, onClick, onSwipe, cellSize }) => {
    const colors = CANDY_COLORS[candy.type];

    // 스와이프 감지용 ref
    const startPos = useRef<{ x: number; y: number } | null>(null);
    const hasSwiped = useRef(false);
    const activePointerId = useRef<number | null>(null);

    // SVG 컴포넌트 선택
    const CandyComponent = (() => {
        if (candy.special === SpecialType.COLOR_BOMB) return ColorBomb;
        switch (candy.type) {
            case 'red': return RedBean;
            case 'orange': return OrangeLozenge;
            case 'yellow': return YellowDrop;
            case 'green': return GreenSquare;
            case 'blue': return BlueSphere;
            case 'purple': return PurpleFlower;
            default: return RedBean;
        }
    })();

    // 스와이프 시작
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        // 이미 활성화된 포인터가 있으면 무시
        if (activePointerId.current !== null) return;

        e.preventDefault();
        startPos.current = { x: e.clientX, y: e.clientY };
        hasSwiped.current = false;
        activePointerId.current = e.pointerId;

        try {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
            // 포인터 캡처 실패해도 계속 진행
        }
    }, []);

    // 스와이프 감지
    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        // 활성 포인터가 아니면 무시
        if (activePointerId.current !== e.pointerId) return;
        if (!startPos.current || hasSwiped.current) return;

        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        const threshold = cellSize * 0.3; // 30% 이상 움직이면 스와이프

        // 한 방향으로만 스와이프 감지
        if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
            hasSwiped.current = true;

            if (Math.abs(dx) > Math.abs(dy)) {
                // 좌우 스와이프
                onSwipe(dx > 0 ? 'right' : 'left');
            } else {
                // 상하 스와이프
                onSwipe(dy > 0 ? 'down' : 'up');
            }
        }
    }, [cellSize, onSwipe]);

    // 스와이프 종료 (공통 정리 함수)
    const cleanupPointer = useCallback((e: React.PointerEvent, checkClick: boolean = false) => {
        // 활성 포인터가 아니면 무시
        if (activePointerId.current !== e.pointerId) return;

        // 클릭 처리
        if (checkClick && !hasSwiped.current && startPos.current) {
            const dx = Math.abs(e.clientX - startPos.current.x);
            const dy = Math.abs(e.clientY - startPos.current.y);
            if (dx < 5 && dy < 5) {
                onClick();
            }
        }

        // 포인터 캡처 해제
        try {
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
            // 해제 실패해도 무시
        }

        // 상태 초기화
        startPos.current = null;
        hasSwiped.current = false;
        activePointerId.current = null;
    }, [onClick]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        cleanupPointer(e, true);
    }, [cleanupPointer]);

    const handlePointerCancel = useCallback((e: React.PointerEvent) => {
        cleanupPointer(e, false);
    }, [cleanupPointer]);

    // 포인터가 요소를 벗어났을 때도 정리
    const handlePointerLeave = useCallback((e: React.PointerEvent) => {
        // 포인터 캡처 중이 아닐 때만 정리
        if (activePointerId.current === e.pointerId) {
            cleanupPointer(e, false);
        }
    }, [cleanupPointer]);

    return (
        <motion.div
            className={`candy-wrapper ${isSelected ? 'selected' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerLeave}
            initial={candy.isNew ? { scale: 0, y: -100 } : false}
            animate={{
                scale: candy.isMatched ? 0 : 1,
                x: candy.col * cellSize,
                y: candy.row * cellSize,
                rotate: candy.isMatched ? 180 : 0,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                mass: 0.8,
            }}
            style={{
                width: cellSize,
                height: cellSize,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: isSelected ? 10 : 1,
                cursor: 'pointer',
                touchAction: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* SVG 캔디 렌더링 */}
            <CandyComponent
                style={{
                    width: '90%', // SVG 크기 조정 (약간 여백)
                    height: '90%',
                    filter: `${isSelected ? 'brightness(1.2)' : 'none'} drop-shadow(0 4px 4px rgba(0,0,0,0.3))`,
                }}
            />

            {/* 선택 효과 (Glow) */}
            {isSelected && (
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
                    opacity: 0.5,
                    zIndex: -1,
                }} />
            )}

            {/* 특수 캔디 표시 */}
            {candy.special === SpecialType.STRIPED_H && (
                <div className="special-stripe horizontal" />
            )}
            {candy.special === SpecialType.STRIPED_V && (
                <div className="special-stripe vertical" />
            )}
            {candy.special === SpecialType.WRAPPED && (
                <div className="special-wrapped" />
            )}
            {candy.special === SpecialType.COLOR_BOMB && (
                <div className="special-color-bomb" />
            )}
        </motion.div>
    );
};
