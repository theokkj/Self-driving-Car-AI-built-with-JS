class Visualizer {
  static drawNetwork(ctx, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    const levelHeight = height / network.levels.length;

    for (let i = network.levels.length - 1; i >= 0; i--) {
      ctx.setLineDash([7, 3]);
      const level = network.levels[i];
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length == 1 ? 1 : i / (network.levels.length - 1)
        );
      Visualizer.drawLevel(
        ctx,
        level,
        left,
        levelTop,
        width,
        levelHeight,
        i == network.levels.length - 1 ? ["🡅", "🡄", "🡆", "🡇"] : []
      );
    }
  }

  static drawLevel(ctx, level, left, top, width, height, outputSymbols) {
    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = level;
    const nodeRadius = 18;

    // Draws the weights
    ctx.lineWidth = 2;
    for (let i = 0; i < inputs.length; i++) {
      const inputX = Visualizer.#getNodeX(inputs.length, i, left, right);
      for (let o = 0; o < outputs.length; o++) {
        ctx.beginPath();
        const outputX = Visualizer.#getNodeX(outputs.length, o, left, right);
        ctx.moveTo(outputX, top);
        ctx.lineTo(inputX, bottom);

        ctx.strokeStyle = getRGBA(weights[i][o]);
        ctx.stroke();
      }
    }

    // Draws the inputs nodes
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs.length, i, left, right);

      // Draws a black node behind the input node to cover the weights
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      // Draws the input node
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();
    }

    // Draws the outputs nodes
    ctx.lineWidth = 2;
    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs.length, i, left, right);

      // Draws a black node behind the output node to cover the weights
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      // Draws the output node
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();

      // Draws the biases
      const bias = biases[i];
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);

      ctx.strokeStyle = getRGBA(bias);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draws the outputSymbols
      if (outputSymbols[i]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.font = nodeRadius * 1.2 + "px Arial";
        ctx.fillText(outputSymbols[i], x, top + nodeRadius * 0.1);
        ctx.lineWidth = 0.5;
        ctx.strokeText(outputSymbols[i], x, top + nodeRadius * 0.1);
      }
    }
  }

  static #getNodeX(nodes, index, left, right) {
    return lerp(left, right, nodes == 1 ? 0.5 : index / (nodes - 1));
  }
}
