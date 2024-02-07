import { updateGround, setupGround } from "./ground.js";
import {
  updateDante,
  setupDante,
  getDanteRectangle,
  setDanteLose,
} from "./dante.js";
import { updateDemon, setupDemon, getDemonRectangle } from "./demon.js";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElement = document.querySelector("[data-world]");
const scoreElement = document.querySelector("[data-score]");
const startScreenElement = document.querySelector("[data-start]");
const highScoreElement = document.querySelector("[data-highscore]");

let lastTime;
let speedScale;
let score;
let highScore = 0;

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("keydown", handleStart, { once: true });
setupGround();

function update(time) {
  if (!lastTime) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }

  const delta = time - lastTime;

  updateGround(delta, speedScale);
  updateDante(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  updateDemon(delta, speedScale);

  if (checkLose()) return handleLose();

  lastTime = time;
  window.requestAnimationFrame(update);
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function handleStart() {
  lastTime = null;
  speedScale = 1;
  score = 0;
  setupGround();
  setupDante();
  setupDemon();
  startScreenElement.classList.add("hide");
  window.requestAnimationFrame(update);
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreElement.textContent = Math.floor(score);

  if (score > highScore) {
    highScore = score;
    updateHighScore();
  }
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function checkLose() {
  const danteRect = getDanteRectangle();
  return getDemonRectangle().some((rect) => isCollision(rect, danteRect));
}

function handleLose() {
  setDanteLose();
  if (score > highScore) {
    highScore = score;
    updateHighScore();
  }

  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true });
    startScreenElement.classList.remove("hide");
  }, 100);
}

function updateHighScore() {
  highScoreElement.textContent = Math.floor(highScore);
}

function setPixelToWorldScale() {
  const aspectRatio = window.innerWidth / window.innerHeight;
  const worldToPixelScale =
    aspectRatio < WORLD_WIDTH / WORLD_HEIGHT
      ? window.innerWidth / WORLD_WIDTH
      : window.innerHeight / WORLD_HEIGHT;

  worldElement.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElement.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}
