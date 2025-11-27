const legoPalette = [
  '#FFFFFF', '#F2F3F2', '#C4281B', '#F5CD2F', '#0D69AB', '#237841', '#923978', '#FF6D8D',
  '#A0A5A9', '#6D6E5C', '#B40000', '#E16E1A', '#F9BA00', '#4C9135', '#0F2A2A', '#1B2A34'
];

export const matchColor = (color: string) => {
  const { r, g, b } = hexToRgb(color);
  let closest = legoPalette[0];
  let min = Infinity;
  legoPalette.forEach((hex) => {
    const { r: pr, g: pg, b: pb } = hexToRgb(hex);
    const dist = Math.sqrt((r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2);
    if (dist < min) {
      min = dist;
      closest = hex;
    }
  });
  return closest;
};

export const hexToRgb = (hex: string) => {
  const value = hex.replace('#', '');
  const bigint = parseInt(value, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};
