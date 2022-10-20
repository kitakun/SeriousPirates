export { default as Camera } from './control/camera';
export { default as staticSprite, register as registerStaticSprite } from './graphical/staticSprite';
export * from "./control";
export * from "./graphical";

import { register as registerStaticSprite } from './graphical/staticSprite';

export function registerCustomComponents() {
    registerStaticSprite();
}