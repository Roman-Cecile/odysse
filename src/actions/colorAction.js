export const CHANGE_COLOR = 'CHANGE_COLOR';

export const changeColor = (hex, rgb, name) => ({
  type: CHANGE_COLOR,
  hex,
  rgb,
  name,
});
