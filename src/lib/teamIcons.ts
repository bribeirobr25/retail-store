import {
  Rainbow,
  Flower,
  Dog,
  Squirrel,
  Cherry,
  Croissant,
  Gem,
  Rocket,
  Gift,
  Origami,
  ScanFace,
  HatGlasses,
  TreePalm,
  FlameKindling,
  Palette,
  Handbag,
  Award,
  Medal,
} from 'lucide-react';

import svgCat from '../../images/svg/cat.svg';
import svgBall from '../../images/svg/ball.svg';
import svgPuppy from '../../images/svg/puppy.svg';
import svgPrincess from '../../images/svg/princess.svg';
import svgPanda from '../../images/svg/panda.svg';
import svgUnicorn from '../../images/svg/unicorn.svg';
import svgTeacat from '../../images/svg/teacat.svg';
import svgCupcakebear from '../../images/svg/cupcakebear.svg';
import svgRabbit from '../../images/svg/rabbit.svg';
import svgPrinces from '../../images/svg/princes.svg';

import type { TeamIcon } from '../shared/types';

export const TEAM_ICONS: TeamIcon[] = [
  // Custom SVGs
  { type: 'svg', src: svgCat },
  { type: 'svg', src: svgBall },
  { type: 'svg', src: svgPuppy },
  { type: 'svg', src: svgPrincess },
  { type: 'svg', src: svgPanda },
  { type: 'svg', src: svgUnicorn },
  { type: 'svg', src: svgTeacat },
  { type: 'svg', src: svgCupcakebear },
  { type: 'svg', src: svgRabbit },
  { type: 'svg', src: svgPrinces },
  // Lucide icons
  { type: 'lucide', icon: Rainbow },
  { type: 'lucide', icon: Flower },
  { type: 'lucide', icon: Dog },
  { type: 'lucide', icon: Squirrel },
  { type: 'lucide', icon: Cherry },
  { type: 'lucide', icon: Croissant },
  { type: 'lucide', icon: Gem },
  { type: 'lucide', icon: Rocket },
  { type: 'lucide', icon: Gift },
  { type: 'lucide', icon: Origami },
  { type: 'lucide', icon: ScanFace },
  { type: 'lucide', icon: HatGlasses },
  { type: 'lucide', icon: TreePalm },
  { type: 'lucide', icon: FlameKindling },
  { type: 'lucide', icon: Palette },
  { type: 'lucide', icon: Handbag },
  { type: 'lucide', icon: Award },
  { type: 'lucide', icon: Medal },
];

export const randomIconIndex = (): number => Math.floor(Math.random() * TEAM_ICONS.length);

// TEAM_ICONS is a const array with 28 entries, so this lookup is always defined.
// The non-null assertion is safe and avoids polluting every call site with a fallback.
export function getTeamIcon(idx: number): TeamIcon {
  return TEAM_ICONS[idx % TEAM_ICONS.length]!;
}
