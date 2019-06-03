/* global Cesium */

const DegreeConvertBack = (value) => {
  let du = value.split("°")[0];
  let fen = value.split("°")[1].split("'")[0];
  let miao = value.split("°")[1].split("'")[1].split('"')[0];
  return (Math.abs(du) + (Math.abs(fen) / 60 + Math.abs(miao) / 3600)).toFixed(4);
}

const randomColor = () => {
  const r = Math.round(Math.random()*255);
  const g = Math.round(Math.random()*255);
  const b = Math.round(Math.random()*255);

  const a = ( (Math.random()*5 + 5) / 10 ).toFixed(2)

  const color = `rgba(${r},${g},${b},${a})`

  // console.log(color)
  return color;

}

const removeInputAction = (type,cesiumControl) => {
  switch(type)
  {
    case "drawLine":
      cesiumControl.measure("destoryLine");
      break;
    case "drawPloy":
      cesiumControl.measure("destoryPloy");
      break;
  }
}

export {
  DegreeConvertBack,
  randomColor,
  removeInputAction,
};
