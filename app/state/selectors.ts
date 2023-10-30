import { selector } from 'recoil';
import { sideNavState } from './atoms';

// export const vetSideNavState = selector({
//     key: 'vetSideNavState',
//     get: ({get}) => {
//         const getCurrentState = get(sideNavState) === 'expand'
//         return getCurrentState
//     }
// })