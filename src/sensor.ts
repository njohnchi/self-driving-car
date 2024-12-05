import {Car} from "./car.ts";
import {lerp} from "./utils.ts";

class Sensor {
    rayCount: number;
    rayLength: number;
    raySpread: number;
    rays: Array<Array<{ x: number, y: number }>>;

    constructor(
        public car: Car,
    ) {
        this.rayCount = 3;
        this.rayLength = 100;
        this.raySpread = Math.PI / 4;

        this.rays = [];
    }

    update() {
        this.castRay();
    }

    private castRay() {
        this.rays = [];

        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength,
            };

            this.rays.push([start, end]);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const ray of this.rays) {
            ctx.beginPath();
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 1;
            ctx.moveTo(ray[0].x, ray[0].y);
            ctx.lineTo(ray[1].x, ray[1].y);
            ctx.stroke();
        }
    }
}

export {Sensor};
