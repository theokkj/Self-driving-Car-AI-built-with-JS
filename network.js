class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }

    return outputs;
  }

  static mutate(network, mutatationPercentage) {
    network.levels.forEach((level) => {
      for (let b = 0; b < level.biases.length; b++) {
        level.biases[b] =
          level.biases[b] + (Math.random() * 2 - 1) * mutatationPercentage;
      }

      for (let wI = 0; wI < level.weights.length; wI++) {
        for (let wO = 0; wO < level.weights[wI].length; wO++) {
          level.weights[wI][wO] =
            level.weights[wI][wO] +
            (Math.random() * 2 - 1) * mutatationPercentage;
        }
      }
    });
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let o = 0; o < level.outputs.length; o++) {
        level.weights[i][o] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    for (let o = 0; o < level.outputs.length; o++) {
      let sum = 0;
      for (let i = 0; i < level.inputs.length; i++) {
        let input = level.inputs[i];
        let weigth = level.weights[i][o];
        sum += input * weigth;
      }

      if (sum > level.biases[o]) {
        level.outputs[o] = 1;
      } else {
        level.outputs[o] = 0;
      }
    }

    return level.outputs;
  }
}
