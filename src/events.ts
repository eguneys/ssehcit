import { eventPosition } from './util';


export default function bindDocument(ctrl) {

  document.addEventListener('mousemove', (e) => {
    ctrl.move(eventPosition(e));
  });
  document.addEventListener('mouseup', (e) => {
    ctrl.unselect(eventPosition(e));
  });
  
}
