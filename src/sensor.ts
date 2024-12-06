import {Car} from "./car.ts";
import {getIntersection, lerp} from "./utils.ts";
import {Intersection, Point} from "./types.ts";

class Sensor {
    rayCount: number;
    rayLength: number;
    raySpread: number;
    rays: Point[][];
    readings: (Intersection | null)[];

    constructor(
        public car: Car,
    ) {
        this.rayCount = 3;
        this.rayLength = 100;
        this.raySpread = Math.PI / 4;

        this.rays = [];
        this.readings = [];

    }

    update(roadBorders: Point[][]) {
        this.castRay();
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            const reading = this.getReading(this.rays[i], roadBorders);
            this.readings.push(reading);
        }
    }

    private getReading(ray: Point[], roadBorders: Point[][]): Intersection | null {
        const touches = [];
        for (const border of roadBorders) {
            const intersection = getIntersection(ray[0], ray[1], border[0], border[1]);
            if (intersection) {
                touches.push(intersection);
            }
        }

        if (touches.length === 0) {
            return null;
        }

        return touches.reduce((min, touch) => touch.offset < min.offset ? touch : min);
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
        for (let i = 0; i < this.rays.length; i++) {
            let end = this.rays[i][1];
            if (this.readings[i]) {
                end = this.readings[i]!;
            }
            ctx.beginPath();
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 1;
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }
}

export {Sensor};
