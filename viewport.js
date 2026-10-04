export const verticalCamera=height=>Math.min(250,Math.max(0,540-height*2));
export function sceneFrame(width,height){
  const logicalWidth=width/height<1.5?720:960;
  const rasterHeight=Math.min(270,Math.max(120,Math.round(logicalWidth*height/width/2)));
  return {width:logicalWidth/2,height:rasterHeight,cameraY:verticalCamera(rasterHeight)};
}
