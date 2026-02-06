import ICommand from '../core/ICommand.js';
import { displayAsciiArt } from '../utils/ascii.js';

export default class BzBombCommand extends ICommand {
  constructor(term) {
    super('bzbomb', 'Activate the Bounzi Bomb');
    this.term = term;
  }

  async execute() {
    const EXPLOSION = [
      '                  .               ',
      '                 .                ',
      '                 .       :       ',
      '                 :      .        ',
      '        :..   :  : :  .          ',
      '           ..  ; :: .            ',
      '              ... .. :..         ',
      '             ::: :...            ',
      '         ::.:.:...;; .....       ',
      '      :..     .;.. :;     ..     ',
      '            . :. .  ;.           ',
      '             .: ;;: ;.           ',
      '            :; .BRRRV;           ',
      '               YB BMMMBR         ',
      '              ;BVIMMMMMt         ',
      '        .=YRBBBMMMMMMMB          ',
      '      =RMMMMMMMMMMMMMM;          ',
      '    ;BMMR=VMMMMMMMMMMMV.         ',
      '   tMMR::VMMMMMMMMMMMMMB:        ',
      '  tMMt ;BMMMMMMMMMMMMMMMB.       ',
      ' ;MMY ;MMMMMMMMMMMMMMMMMMV       ',
      ' XMB .BMMMMMMMMMMMMMMMMMMM:      ',
      ' BMI +MMMMMMMMMMMMMMMMMMMMi      ',
      ' .MM= XMMMMMMMMMMMMMMMMMMMMY     ',
      ' BMt YMMMMMMMMMMMMMMMMMMMMi      ',
      ' VMB +MMMMMMMMMMMMMMMMMMMM:      ',
      ' ;MM+ BMMMMMMMMMMMMMMMMMMR       ',
      '  tMBVBMMMMMMMMMMMMMMMMMB.       ',
      '   tMMMMMMMMMMMMMMMMMMMB:        ',
      '    ;BMMMMMMMMMMMMMMMMY          ',
      '      +BMMMMMMMMMMMBY:           ',
      '        :+YRBBBRVt;              '
    ];
    await displayAsciiArt(EXPLOSION, this.term, {
      speed: 150,
      startingText: 'RUN FOR YOUR LIFE',
      finalText: 'THE BOUNZI BOMB HAS BEEN ACTIVATED',
    });
  }
}
