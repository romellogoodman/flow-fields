import {MersenneTwister19937, Random} from 'random-js';
import SimplexNoise from 'simplex-noise';

const getRandom = () => {
  const seed = MersenneTwister19937.autoSeed();

  return new Random(seed);
};

const simplex = new SimplexNoise();
const random = getRandom();

const scale = 1;
const AMPLITUDE = 5;
const DAMPING = 0.1;
const FREQUENCY = 0.001 / scale;
const PARTICLE_COUNT = 1000;
const PARTICLE_STEPS = 30 * scale;
const STEP = 5 * scale;

const noise2D = (simplex, x, y, frequency, amplitude) => {
  return simplex.noise2D(x * frequency, y * frequency) * amplitude;
};

const getBounds = (width, height, margin) => {
  const marginWidth = width * margin;
  const marginHeight = height * margin;

  return {
    minWidth: marginWidth,
    maxWidth: width - marginWidth,
    minHeight: marginHeight,
    maxHeight: height - marginHeight,
  };
};

const isInBound = (xCood, yCoord, width, height, margin) => {
  const {minWidth, maxWidth, minHeight, maxHeight} = getBounds(
    width,
    height,
    margin
  );

  return (
    xCood > minWidth &&
    xCood < maxWidth &&
    yCoord > minHeight &&
    yCoord < maxHeight
  );
};

export const generateParticles = (width, height, margin = 0) => {
  const {minWidth, maxWidth, minHeight, maxHeight} = getBounds(
    width,
    height,
    margin
  );
  let particles = [];

  // Generate some particles with a random position
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: random.real(minWidth, maxWidth),
      y: random.real(minHeight, maxHeight),
      vx: 0,
      vy: 0,
      line: [],
    });
  }

  return particles;
};

export const moveParticle = (particle) => {
  // Calculate direction from noise
  const angle = noise2D(simplex, particle.x, particle.y, FREQUENCY, AMPLITUDE);

  // Update the velocity of the particle based on the direction
  particle.vx += Math.cos(angle) * STEP;
  particle.vy += Math.sin(angle) * STEP;

  // Move the particle
  particle.x += particle.vx;
  particle.y += particle.vy;

  // Use damping to slow down the particle (think friction)
  particle.vx *= DAMPING;
  particle.vy *= DAMPING;

  particle.line.push([particle.x, particle.y]);
};

export const generateField = ({height, margin = 0, width}) => {
  const particles = generateParticles(width, height, margin) || [];

  // Filter after all of the steps
  particles
    ?.forEach((particle) => {
      while (particle.line.length < PARTICLE_STEPS) {
        moveParticle(particle);
      }
    })
    ?.forEach((particle) => {
      particle.line = particle.line.filter((particle) => {
        return isInBound(particle[0], particle[1], width, height, margin);
      });
    });

  return particles;
};
