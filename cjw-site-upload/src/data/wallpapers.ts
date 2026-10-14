/**
 * 壁纸合集（单文件预存多张壁纸）
 * ------------------------------------------------------------------
 * 所有壁纸拼在一张「雪碧图」里：public/images/wallpapers.jpg
 * 切换壁纸只改坐标，不需要再下载任何文件 —— 秒切、零额外流量。
 *
 * 现在的合集是 2 × 2 格，每格 1280×720：
 *   ┌──────────┬──────────┐
 *   │ 0,0 晚霞 │ 1,0 山谷 │
 *   ├──────────┼──────────┤
 *   │ 0,1 雪夜 │ 1,1 暮色 │
 *   └──────────┴──────────┘
 *
 * 想加壁纸：把新图拼进 public/images/wallpapers.jpg（改大格子数），
 * 然后在这里加一行、并同步修改 COLS / ROWS 即可。
 */
export const WALLPAPER_PACK = '/images/wallpapers.jpg'; // 轻量档：每格 1280×720，约 440KB
export const WALLPAPER_PACK_HD = '/images/wallpapers-hd.jpg'; // 高清档：每格 1920×1080，约 1.0MB
export const COLS = 2;
export const ROWS = 2;

export interface Wallpaper {
  key: string;
  label: string;
  col: number;
  row: number;
}

export const WALLPAPERS: Wallpaper[] = [
  { key: 'sunset', label: '晚霞', col: 0, row: 0 },
  { key: 'valley', label: '山谷', col: 1, row: 0 },
  { key: 'snow', label: '雪夜', col: 0, row: 1 },
  { key: 'dusk', label: '暮色', col: 1, row: 1 },
];

export const DEFAULT_WALLPAPER = 'sunset';
