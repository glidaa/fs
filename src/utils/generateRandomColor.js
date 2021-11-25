export default ({...defaults}) => {
  let h = 'h' in defaults ? defaults.h : Math.floor(Math.random() * 360)
  let s = ('s' in defaults ? defaults.s : Math.floor(Math.random() * 100)) + "%"
  let l = ('l' in defaults ? defaults.l : Math.floor(Math.random() * 100)) + "%"
  return `hsl(${h}, ${s}, ${l})`;
};