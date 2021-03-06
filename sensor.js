class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;

    this.readings = [];
    this.rays = [];
  }

  update(roadBorders, traffic) {
    this.#castRays();

    this.readings = [];
    // Basically sets the readings array with the offset of object (actually a car or the road walls) if this object is being touched by any of the sensors
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic));
    }
  }

  #getReading(ray, roadBorders, traffic) {
    let touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      let border = roadBorders[i];
      const touch = getIntersection(ray[0], ray[1], border[0], border[1]);
      if (touch) {
        touches.push(touch);
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      var polygon = traffic[i].polygon;
      for (let j = 0; j < polygon.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          polygon[j],
          polygon[(j + 1) % polygon.length]
        );

        if (value) {
          touches.push(value);
        }
      }
    }

    if (touches.length == 0) {
      return null;
    } else {
      const offsets = touches.map((touch) => touch.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((touch) => touch.offset == minOffset);
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rays.length; i++) {
      let rayEndPoint = this.rays[i][1];

      if (this.readings[i]) {
        rayEndPoint = this.readings[i];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";

      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(rayEndPoint.x, rayEndPoint.y);
      ctx.stroke();

      // Draws where the endpoint would be if it wasn't intersected
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";

      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(rayEndPoint.x, rayEndPoint.y);
      ctx.stroke();
    }
  }
}
