import { vinit } from 'hhh';
import events from './events';
import Ctrl from './ctrl';
import View from './view';

export default function app(element) {

  let recons = vinit();

  let ctrl = new Ctrl();
  let view = new View(ctrl);
  events(ctrl);

  let $_ = recons(view.vApp());
  element.appendChild($_);
  ctrl.initPub();
}
