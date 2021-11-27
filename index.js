import {MersenneTwister19937, Random} from 'random-js';
import SimplexNoise from 'simplex-noise';

const getRandom = (randomSeed) => {
  const seed = randomSeed || MersenneTwister19937.autoSeed();

  return new Random(seed);
};

const simplex = new SimplexNoise();

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

export const generateParticles = ({
  count,
  height,
  margin = 0.1,
  seed,
  width,
}) => {
  const random = getRandom(seed);
  const bounds = getBounds(width, height, margin);
  const {minWidth, maxWidth, minHeight, maxHeight} = bounds;
  let particles = [];

  // Generate some particles with a random position
  for (let i = 0; i < count; i++) {
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

export const moveParticle = ({
  amplitude,
  damping,
  frequency,
  lengthOfStep,
  particle,
}) => {
  // Calculate direction from noise
  const angle = noise2D(simplex, particle.x, particle.y, frequency, amplitude);

  // Update the velocity of the particle based on the direction
  particle.vx += Math.cos(angle) * lengthOfStep;
  particle.vy += Math.sin(angle) * lengthOfStep;

  // Move the particle
  particle.x += particle.vx;
  particle.y += particle.vy;

  // Use damping to slow down the particle (think friction)
  particle.vx *= damping;
  particle.vy *= damping;

  particle.line.push([particle.x, particle.y]);
};

export const generateField = ({
  amplitude = 5,
  count = 1000,
  damping = 0.1,
  height,
  margin = 0.1,
  seed,
  width,
  scale = 1,
} = {}) => {
  const maxParticleSteps = 30 * scale;
  const lengthOfStep = 5 * scale;
  const frequency = 0.001 / scale;
  const particles =
    generateParticles({count, height, margin, seed, width}) || [];

  particles?.forEach((particle) => {
    while (particle.line.length < maxParticleSteps) {
      moveParticle({
        amplitude,
        damping,
        frequency,
        lengthOfStep,
        particle,
      });
    }
  });

  particles?.forEach((particle) => {
    particle.line = particle.line.filter((particle) => {
      return isInBound(particle[0], particle[1], width, height, margin);
    });
  });

  return particles;
};
