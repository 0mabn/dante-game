import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./customProperty.js";

const SPEED = 0.05;
const DEMON_INTERVAL_MIN = 500;
const DEMON_INTERVAL_MAX = 2500;
const worldElement = document.querySelector("[data-world]");

let nextDemonTime;
export function updateDemon(delta, speedScale) {
  document.querySelectorAll("[data-demon]").forEach((demon) => {
    incrementCustomProperty(demon, "--left", delta * speedScale * SPEED * -1);

    if (getCustomProperty(demon, "--left") <= -100) {
      demon.remove();
    }
  });

  if (nextDemonTime <= 0) {
    createDemon();
    nextDemonTime =
      randomNumberBetween(DEMON_INTERVAL_MIN, DEMON_INTERVAL_MAX) / speedScale;
  }
  nextDemonTime -= delta;
}

export function setupDemon() {
  nextDemonTime = DEMON_INTERVAL_MIN;
}

function createDemon() {
  const demon = document.createElement("img");
  demon.dataset.demon = true;
  demon.src = "./img/Demon.png";
  demon.classList.add("demon");
  setCustomProperty(demon, "--left", 100);
  worldElement.append(demon);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getDemonRectangle() {
  return [...document.querySelectorAll("[data-demon]")].map((demon) => {
    return demon.getBoundingClientRect();
  });
}
