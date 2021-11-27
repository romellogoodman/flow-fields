# flow-field

[![npm version](https://badge.fury.io/js/@romellogoodman/flow-field.svg)](https://badge.fury.io/js/@romellogoodman/flow-field)

A library for generating flow fields. Resources for learning more about flow fields and noise:

- [Flow Fields by Tyler Hobbs](https://tylerxhobbs.com/essays/2020/flow-fields)
- [Noise by Varun Vachhar](https://varun.ca/noise/)

## Table of contents

- [Usage](#usage)
- [API Reference](#api)
- [Contributing](#contributing)

## Usage

### Install

[npm](https://www.npmjs.com/package/@romellogoodman/flow-field)

```
npm i @romellogoodman/flow-field
```

unpkg

```
<script src="https://unpkg.com/@romellogoodman/flow-field"></script>
```

### Use

```js
import {generateField} from '@romellogoodman/flow-field';

const field = generateField({count: 100, height: 1000, width: 1000});
```

## API

### generateParticles

Creates the particles for a flow field.

- `@param {Number} count` Number of particles in the field.
- `@param {Number} height` Height of space.
- `@param {Number} margin` Percent of height/width to create a padding.
- `@param {String} seed` Random (random-js) seed.
- `@param {Number} width` Width of space.
- `@return {Array}` List of particle objects containing the starting x and y coordinates.

### moveParticle

Computes the new position for a particle and adds it to the `particle.line` array.

- `@param {Number} amplitude` Controls the range of values we get from the noise function.
- `@param {Number} damping` Slows down the particle (think friction).
- `@param {Number} frequency` Controls how quickly/slowly the noise function is "evolving over time".
- `@param {Number} lengthOfStep` Amount to move the coordinate.
- `@param {Object} particle` Particle object containing the.
- `@return {Void}` Operates on the particle and returns nothing.

### generateField

Creates a flow field with particles and lines.

- `@param {Number} amplitude` Controls the range of values we get from the noise function. Default to `5`.
- `@param {Number} count` Number of particles in the field. Default to `1000`.
- `@param {Number} damping` Percentage that slows down the particle (think friction). Default to `0.1`.
- `@param {Number} height` Height of space.
- `@param {Number} margin` Percent of height/width to create a padding. Default to `0.1`.
- `@param {Object} particles` List of particles to use instead of generating them.
- `@param {String} scale` Used to compute frequency, number of steps and step length. Default to `1`.
- `@param {String} seed` Random (random-js) seed.
- `@param {Number} width` Width of space.
- `@return {Array}` List of particle objects containing the line coordinates.

## Contributing

All contributors and all contributions both big and small are welcome in this project.
