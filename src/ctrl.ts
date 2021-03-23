import * as sit from './types';
import { nt, f } from 'nefs';
import { ts, b } from 'tschess';
import { Sub } from './util';

export default class Ctrl {
  
  selection: Sub<sit.Selection>
  subRecons: Sub<void>
  subSituation: Sub<nt.Situation>
  
  constructor() {
    let situation = f.situation(nt.initialFen);
    this.subRecons = new Sub<void>(undefined);
    this.subSituation = new Sub<nt.Situation>(situation);
    this.selection = new Sub<sit.Selection>({ active: false });
  }

  initPub() {
    this.subSituation.pub();
    this.subRecons.pub();
  }

  select(key: nt.Pos | undefined, epos: sit.EPos) {
    this.subSituation.mutate(situation => {
      let newBoard = b.pickup(situation.board, key)
      let piece = situation.board.get(key);

      if (newBoard) {
        this.selection.mutate(_ => {
          _.active = true;
          _.piece = piece;
          _.source = key;
        });

        situation.board = newBoard;
      }
    });
  }

  unselectBoard(key: nt.Pos) {
    this.subSituation.mutate(situation => {
      let { piece } = this.selection.currentValue;

      let b2 = b.drop(situation.board, key, piece);

      if (b2) {
        situation.board = b2;
      }
      
    });    
  }

  unselect(epos: sit.EPos) {
    this.selection.mutate(_ => _.active = false);
  }

  move(epos: sit.EPos) {
    if (this.selection.currentValue) {
      this.selection.mutate(_ => _.epos = epos);
    }
  }

}
