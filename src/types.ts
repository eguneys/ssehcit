import { nt } from 'nefs';

export type EPos = [number, number]

export type PovPos = [nt.File, nt.Rank]

export type Selection = {
  active: boolean,
  epos?: EPos
  piece?: nt.Piece,
  source?: nt.Pos
}
