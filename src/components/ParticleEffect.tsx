import React from 'react';
import { motion } from 'framer-motion';
import type { Match } from '../game/MatchDetector';
import { CANDY_COLORS } from '../game/CandyTypes';

interface ParticleEffectProps {
    matches: Match[];
    cellSize: number;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({ matches, cellSize }) => {
    const particles: React.ReactNode[] = [];

    matches.forEach((match, matchIndex) => {
        match.candies.forEach((candy, candyIndex) => {
            const colors = CANDY_COLORS[candy.type];
            const centerX = candy.col * cellSize + cellSize / 2;
            const centerY = candy.row * cellSize + cellSize / 2;

            // 각 캔디마다 여러 개의 파티클 생성
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const distance = 50 + Math.random() * 50;
                const targetX = centerX + Math.cos(angle) * distance;
                const targetY = centerY + Math.sin(angle) * distance;

                particles.push(
                    <motion.div
                        key={`particle-${matchIndex}-${candyIndex}-${i}`}
                        style={{
                            position: 'absolute',
                            left: centerX,
                            top: centerY,
                            width: 8 + Math.random() * 8,
                            height: 8 + Math.random() * 8,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${colors.secondary}, ${colors.primary})`,
                            boxShadow: `0 0 10px ${colors.glow}`,
                            pointerEvents: 'none',
                        }}
                        initial={{
                            x: 0,
                            y: 0,
                            opacity: 1,
                            scale: 1
                        }}
                        animate={{
                            x: targetX - centerX,
                            y: targetY - centerY,
                            opacity: 0,
                            scale: 0
                        }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeOut',
                            delay: Math.random() * 0.1,
                        }}
                    />
                );
            }

            // 별 모양 이펙트
            particles.push(
                <motion.div
                    key={`star-${matchIndex}-${candyIndex}`}
                    style={{
                        position: 'absolute',
                        left: centerX - 20,
                        top: centerY - 20,
                        width: 40,
                        height: 40,
                        pointerEvents: 'none',
                    }}
                    initial={{ scale: 0, rotate: 0, opacity: 1 }}
                    animate={{ scale: 2, rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                    <svg viewBox="0 0 40 40" fill="none">
                        <path
                            d="M20 0 L23 15 L40 20 L23 25 L20 40 L17 25 L0 20 L17 15 Z"
                            fill={colors.secondary}
                            opacity={0.8}
                        />
                    </svg>
                </motion.div>
            );
        });
    });

    return (
        <div
            className="particle-layer"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 100,
            }}
        >
            {particles}
        </div>
    );
};
