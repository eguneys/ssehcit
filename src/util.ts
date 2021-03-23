import * as sit from './types';
import { nt, db } from 'nefs';

export type FUse<A> = (_: A) => void

export class Sub<A> {
  private subs: FUse<A>[]
  currentValue: A

  constructor(a: A) {
    this.subs = [];
    this.currentValue = a;
  }

  sub(fn: FUse<A>) {
    this.subs.push(fn);
  }

  pub(val?: A) {
    if (val) {
      this.currentValue = val;
    }
    this.subs.forEach(_ => _(this.currentValue));
  }

  mutate(fn: (_: A) => void) {
    fn(this.currentValue);
    this.pub(this.currentValue);
  }
}

export function boardPosition(ep: sit.EPos, pov: nt.Color, bounds: ClientRect): nt.Pos | undefined {
  let pfile = Math.ceil((8 * (ep[0] - bounds.left)) / bounds.width);
  let prank = Math.ceil((8 * (ep[1] - bounds.top)) / bounds.height);
  if (pov === 'w') {
    prank = 9 - prank;
  } else {
    pfile = 9 - pfile;
  }
  return db.poss.nget(pfile, prank);
}

export function eventPosition(e): sit.EPos {
  if (e.clientX || e.clientX === 0) return [e.clientX, e.clientY];
  return;
}
