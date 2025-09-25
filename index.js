import { MersenneTwister19937, Random } from "random-js";
import { createNoise2D } from "simplex-noise";

const getRandom = (randomSeed) => {
  const engine = randomSeed
    ? MersenneTwister19937.seed(randomSeed)
    : MersenneTwister19937.autoSeed();

  return new Random(engine);
};

const noise2D = createNoise2D();

const getNoiseValue = (x, y, frequency, amplitude) => {
  return noise2D(x * frequency, y * frequency) * amplitude;
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
  const { minWidth, maxWidth, minHeight, maxHeight } = getBounds(
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

/**
 * Creates the particles for a flow field.
 *
 * @param {Object} config Configuration object
 * @param {Number} config.count Number of particles in the field
 * @param {Number} config.height Height of space
 * @param {Number} config.margin Percent of height/width to create a padding
 * @param {String} config.seed Random (random-js) seed
 * @param {Number} config.width Width of space
 * @return {Array} List of particle objects containing the starting x and y coordinates
 */
export const generateParticles = ({
  count,
  height,
  margin = 0.1,
  seed,
  width,
}) => {
  const random = getRandom(seed);
  const bounds = getBounds(width, height, margin);
  const { minWidth, maxWidth, minHeight, maxHeight } = bounds;
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

/**
 * Computes the new position for a particle and adds it to the particle.line array.
 *
 * @param {Object} config Configuration object
 * @param {Number} config.amplitude Controls the range of values we get from the noise function
 * @param {Number} config.damping Slows down the particle (think friction)
 * @param {Number} config.frequency Controls how quickly/slowly the noise function is "evolving over time"
 * @param {Number} config.lengthOfStep Amount to move the coordinate
 * @param {Object} config.particle Particle object containing the current position and velocity
 * @return {void} Operates on the particle and returns nothing
 */
export const moveParticle = ({
  amplitude,
  damping,
  frequency,
  lengthOfStep,
  particle,
}) => {
  // Calculate direction from noise
  const angle = getNoiseValue(particle.x, particle.y, frequency, amplitude);

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

/**
 * Creates a flow field with particles and lines.
 *
 * @param {Object} config Configuration object
 * @param {Number} [config.amplitude=5] Controls the range of values we get from the noise function
 * @param {Number} [config.count=1000] Number of particles in the field
 * @param {Number} [config.damping=0.1] Percentage that slows down the particle (think friction)
 * @param {Number} config.height Height of space
 * @param {Number} [config.margin=0.1] Percent of height/width to create a padding
 * @param {Object} [config.particles] List of particles to use instead of generating them
 * @param {String} [config.scale=1] Used to compute frequency, number of steps and step length
 * @param {String} config.seed Random (random-js) seed
 * @param {Number} config.width Width of space
 * @return {Array} List of particle objects containing the line coordinates
 */
export const generateField = ({
  amplitude = 5,
  count = 1000,
  damping = 0.1,
  height,
  margin = 0.1,
  particles: suppliedParticles,
  scale = 1,
  seed,
  width,
} = {}) => {
  const maxParticleSteps = 30 * scale;
  const lengthOfStep = 5 * scale;
  const frequency = 0.001 / scale;
  const particles =
    suppliedParticles ||
    generateParticles({ count, height, margin, seed, width }) ||
    [];

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
