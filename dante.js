import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./customProperty.js";

const danteElement = document.querySelector("[data-dante]");
const JUMP_SPEED = 0.45;
const GRAVITY = 0.00145;
const DANTE_RUNNING_FRAME_COUNT = 3;
const DANTE_JUMPING_FRAME_COUNT = 2;
const FRAME_TIME = 300;

let isJumping;
let danteFrame;
let currentFrameTime;
let velocityY;
let danteJumpingFrame;
export function updateDante(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

export function setupDante() {
  isJumping = false;
  danteFrame = 0;
  danteJumpingFrame = 0;
  currentFrameTime = 0;
  velocityY = 0;
  setCustomProperty(danteElement, "--bottom", 0);
  document.removeEventListener("keydown", onJump);
  document.addEventListener("keydown", onJump);
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    danteJumpingFrame = (danteJumpingFrame + 2) % DANTE_JUMPING_FRAME_COUNT;
    danteElement.src = `./img/dante-jumping-${danteJumpingFrame}.png`;
    return;
  }
  if (currentFrameTime > -FRAME_TIME) {
    danteFrame = (danteFrame + 1) % DANTE_RUNNING_FRAME_COUNT;
    danteElement.src = `img/dante-running-${danteFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;

  incrementCustomProperty(danteElement, "--bottom", velocityY * delta);

  if (getCustomProperty(danteElement, "--bottom") < 0) {
    setCustomProperty(danteElement, "-bottom", 0);
    isJumping = false;
  }

  velocityY -= GRAVITY * delta;
}

export function getDanteRectangle() {
  return danteElement.getBoundingClientRect();
}

export function setDanteLose() {
  danteElement.src = "./img/dante-standing.png";
}

function onJump(e) {
  if (e.code !== "Space" || isJumping) return;

  velocityY = JUMP_SPEED;
  isJumping = true;
}
