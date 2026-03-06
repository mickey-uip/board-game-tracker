import {
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { GENRE_LABEL } from '../../constants/genres';
import type { GenreWinRate, Genre } from '../../types';
import styles from './RadarChart.module.css';

interface RadarChartProps {
  genreStats: GenreWinRate[];
  highlightGenres?: Genre[];
}

// ラベル文字列 → Genre の逆引きマップ
const LABEL_TO_GENRE = Object.entries(GENRE_LABEL).reduce<Record<string, Genre>>(
  (acc, [genre, label]) => {
    acc[label] = genre as Genre;
    return acc;
  },
  {}
);

// チャート中心座標（ReRadarChart の cx/cy はデフォルトで "50%" だが tick には渡されないため固定値で近似）
const CHART_CX = 0;
const CHART_CY = 0;
// ラベルを外側へ押し出すオフセット（px）
const TICK_OFFSET = 14;

interface CustomTickProps {
  x?: number | string;
  y?: number | string;
  cx?: number | string;
  cy?: number | string;
  payload?: { value: string };
  highlightGenres?: Genre[];
}

function CustomTick({ x = 0, y = 0, cx, cy, payload, highlightGenres = [] }: CustomTickProps) {
  const nx = typeof x === 'string' ? parseFloat(x) : x;
  const ny = typeof y === 'string' ? parseFloat(y) : y;
  // recharts は tick props に cx/cy を渡してくれるのでそれを優先
  const centerX = cx !== undefined ? (typeof cx === 'string' ? parseFloat(cx) : cx) : CHART_CX;
  const centerY = cy !== undefined ? (typeof cy === 'string' ? parseFloat(cy) : cy) : CHART_CY;

  // 中心からラベル座標への方向ベクトルを正規化し、TICK_OFFSET 分だけ外へ移動
  const dx = nx - centerX;
  const dy = ny - centerY;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ox = nx + (dx / len) * TICK_OFFSET;
  const oy = ny + (dy / len) * TICK_OFFSET;

  const label = payload?.value ?? '';
  const genre = LABEL_TO_GENRE[label];
  const isPulse = genre !== undefined && highlightGenres.includes(genre);

  return (
    <text
      x={ox}
      y={oy}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fill="#b3a68b"
      fontWeight={600}
      className={isPulse ? styles.pulseTick : undefined}
    >
      {label}
    </text>
  );
}

export function RadarChart({ genreStats, highlightGenres = [] }: RadarChartProps) {
  const data = genreStats.map((stat) => ({
    genre: GENRE_LABEL[stat.genre],
    value: Math.round(stat.winRate * 100),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ReRadarChart data={data} outerRadius={80}>
        <PolarGrid stroke="#555555" />
        <PolarAngleAxis
          dataKey="genre"
          tick={(props: CustomTickProps) => (
            <CustomTick {...props} highlightGenres={highlightGenres} />
          )}
        />
        <Radar
          name="勝率"
          dataKey="value"
          stroke="#f5c842"
          fill="#f5c842"
          fillOpacity={0.35}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  );
}
