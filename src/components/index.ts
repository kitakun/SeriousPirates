export { default as Camera } from './camera';
export { default as staticSprite, register as registerStaticSprite } from './staticSprite';
export * from "./control/playerInput";

import { register as registerStaticSprite } from './staticSprite';

export function registerCustomComponents() {
    registerStaticSprite();
}