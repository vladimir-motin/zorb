export function keyAction(code,targetTag=''){
  if(['INPUT','TEXTAREA'].includes(targetTag))return null;
  if(['KeyA','ArrowLeft'].includes(code))return 'left';
  if(['KeyD','ArrowRight'].includes(code))return 'right';
  if(['KeyR','KeyF','Space'].includes(code))return 'attack';
  if(['KeyP','Escape'].includes(code))return 'pause';
  return null;
}
export class HeldInput{
  constructor(){this.sources=new Map();}
  set(id,action){this.sources.set(id,action);}
  release(id){this.sources.delete(id);}
  clear(){this.sources.clear();}
  snapshot(){const a=[...this.sources.values()];return {left:a.includes('left'),right:a.includes('right')};}
}
export function installControls({attack,pause,active,onBlur}){
  const input=new HeldInput();
  const clear=()=>{input.clear();document.querySelectorAll('[data-control]').forEach(b=>b.classList.remove('held'));};
  window.addEventListener('keydown',e=>{
    const action=keyAction(e.code,document.activeElement?.tagName);if(!action)return;
    if(action==='pause'){if(!e.repeat){e.preventDefault();pause();clear();}return;}
    if(!active())return;e.preventDefault();
    if(action==='attack'){if(!e.repeat)attack();}else input.set(e.code,action);
  });
  window.addEventListener('keyup',e=>input.release(e.code));
  for(const button of document.querySelectorAll('[data-control]')){
    const action=button.dataset.control;
    button.addEventListener('pointerdown',e=>{
      e.preventDefault();if(!active())return;button.setPointerCapture(e.pointerId);button.classList.add('held');
      if(action==='attack')attack();else input.set(e.pointerId,action);
    });
    const release=e=>{input.release(e.pointerId);button.classList.remove('held');};
    button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
    button.addEventListener('click',e=>{if(e.detail===0&&active()&&action==='attack')attack();});
  }
  window.addEventListener('blur',()=>{clear();onBlur();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clear();onBlur();}});
  return {input,clear};
}
