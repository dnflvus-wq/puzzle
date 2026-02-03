// 캔디 타입 정의
export const CandyType = {
  RED: 'red',
  ORANGE: 'orange',
  YELLOW: 'yellow',
  GREEN: 'green',
  BLUE: 'blue',
  PURPLE: 'purple',
} as const;

export type CandyType = typeof CandyType[keyof typeof CandyType];

// 특수 캔디 타입
export const SpecialType = {
  NONE: 'none',
  STRIPED_H: 'striped_horizontal', // 가로 줄무늬 (4개 매칭)
  STRIPED_V: 'striped_vertical',   // 세로 줄무늬 (4개 매칭)
  WRAPPED: 'wrapped',               // 봉지 캔디 (L/T 매칭)
  COLOR_BOMB: 'color_bomb',         // 컬러 폭탄 (5개 매칭)
} as const;

export type SpecialType = typeof SpecialType[keyof typeof SpecialType];

// 캔디 인터페이스
export interface Candy {
  id: string;
  type: CandyType;
  special: SpecialType;
  row: number;
  col: number;
  isMatched: boolean;
  isNew: boolean;
}

// 캔디 색상 및 스타일 매핑
export const CANDY_COLORS: Record<CandyType, { primary: string; secondary: string; glow: string }> = {
  [CandyType.RED]: {
    primary: '#ff4757',
    secondary: '#ff6b81',
    glow: 'rgba(255, 71, 87, 0.6)',
  },
  [CandyType.ORANGE]: {
    primary: '#ffa502',
    secondary: '#ffbe44',
    glow: 'rgba(255, 165, 2, 0.6)',
  },
  [CandyType.YELLOW]: {
    primary: '#ffd32a',
    secondary: '#ffe066',
    glow: 'rgba(255, 211, 42, 0.6)',
  },
  [CandyType.GREEN]: {
    primary: '#2ed573',
    secondary: '#7bed9f',
    glow: 'rgba(46, 213, 115, 0.6)',
  },
  [CandyType.BLUE]: {
    primary: '#1e90ff',
    secondary: '#70a1ff',
    glow: 'rgba(30, 144, 255, 0.6)',
  },
  [CandyType.PURPLE]: {
    primary: '#a855f7',
    secondary: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.6)',
  },
};

// 캔디 타입 배열 (랜덤 생성용)
export const CANDY_TYPES = Object.values(CandyType) as CandyType[];

// 랜덤 캔디 타입 생성
export const getRandomCandyType = (): CandyType => {
  return CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
};

// 고유 ID 생성
export const generateCandyId = (): string => {
  return `candy_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// 새 캔디 생성
export const createCandy = (row: number, col: number, type?: CandyType): Candy => {
  return {
    id: generateCandyId(),
    type: type ?? getRandomCandyType(),
    special: SpecialType.NONE,
    row,
    col,
    isMatched: false,
    isNew: true,
  };
};
