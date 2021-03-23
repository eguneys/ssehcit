import { vmap, vh, h, VHNode } from 'hhh';
import ssehC from 'ssehc';
import Ctrl from './ctrl';
import { nt, db, f } from 'nefs';
let { poss } = db;
import * as u from './util';

export function styleTransform(pos: [number, number]) {
  return (elm: Node) => {
    (elm as HTMLElement).style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
  };
}

export default class View {

  bBounds: u.Sub<ClientRect | undefined>
  apiss: any
  ctrl: Ctrl

  constructor(ctrl) {
    this.ctrl = ctrl;
    this.bBounds = new u.Sub<ClientRect>(undefined);
  }

  vSpare(color: nt.Color) {
    let pieces = nt.roles.map(role =>
      db.pieces.pget(color, role));
    let v$spares = pieces.map(piece =>
      vh('div.no-square', {}, {
      }, [h('div', 
            [vh('piece', piece, {
              klassList: ({color, role}) => 
                [nt.longColor[color], nt.longRole[role]]
            }, [])])
           ])
        );

    return h('div.spare', v$spares);
  }

  vBoard() {

    let v$board = vh('div.board', {}, {
      resize: (bounds) => this.bBounds.pub(bounds),
      element: () => ($_: Node) => {
        this.apiss = ssehC($_ as Element, {});
        
        $_.addEventListener('mousedown', (e) => {
          let epos = u.eventPosition(e);
          let orig = u.boardPosition(epos,
                                     this.ctrl.subSituation.currentValue.turn,
                                     ($_ as Element).getBoundingClientRect());
          this.ctrl.select(orig, epos);
        });

        $_.addEventListener('mouseup', (e) => {
          let epos = u.eventPosition(e);
          let orig = u.boardPosition(epos,
                                     this.ctrl.subSituation.currentValue.turn,
                                     ($_ as Element).getBoundingClientRect());

          this.ctrl.unselectBoard(orig);
        });
      }
    }, [this.vDrag()]);

    this.ctrl.subSituation.sub((situation) => {
      this.apiss.fen(f.fen(situation));
    });

    return v$board;
  }

  vDrag() {

    let dProps = {
      fPosToTranslate: _ => _,
      piece: { role: 'r', color: 'w' }, 
      hidden: true,
      pos: [0, 0] 
    };

    let v$drag = vh('piece.dragging', dProps, {
      element: ({ pos, fPosToTranslate }) => styleTransform(fPosToTranslate(pos)),
      klassList: ({piece, hidden}) => [hidden?'hidden':[], nt.longRole[piece.role], nt.longColor[piece.color]].flat()
    }, [], {});

    this.ctrl.selection.sub(selection => {
      if (selection.active) {
        v$drag.update({
          hidden: false,
          piece: selection.piece,
          pos: selection.epos
        });
      } else {
        v$drag.update({
          hidden: true
        });
      }
    });

    this.bBounds.sub((bounds) => {
      let fPosToTranslate = pos => {
        return [pos[0] - bounds.left - bounds.width / 16, pos[1] - bounds.top - bounds.height / 16];
      };
      v$drag.update({
        fPosToTranslate
      });
    });

    return v$drag;
  }

  vApp() {
    return h('div.board-editor', [
      this.vSpare('b'),
      this.vBoard(),
      this.vSpare('w')
    ]);  
  }

}
