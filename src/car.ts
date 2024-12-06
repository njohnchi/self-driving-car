import { Controls } from "./controls";
import { Sensor } from "./sensor.ts";
import {Point} from "./types.ts";
import {polysIntersect} from "./utils.ts";

class Car {
    speed: number;
    acceleration: number;
    controls: Controls;
    maxSpeed: number;
    friction: number;
    angle: number;
    sensor: Sensor;
    polygon: Point[];
    damaged: boolean;

    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;
        this.controls = new Controls();
        this.sensor = new Sensor(this);
        this.polygon = this.createPolygon();
        this.damaged = false;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.damaged) {
            ctx.fillStyle = 'gray';
        } else {
            ctx.fillStyle = 'black';
        }
        ctx.beginPath()
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill()

        this.sensor.draw(ctx);
    }

    update(roadBorders: Point[][]) {
        if (!this.damaged) {
            this.move();
            this.polygon = this.createPolygon();
            this.damaged = this.assessDamage(roadBorders);
        }
        this.sensor.update(roadBorders);
    }

    private assessDamage(roadBorders: Point[][]): boolean {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        return false;
    }

    private createPolygon(): Point[] {
        const points = []
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan(this.width / this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(this.angle + Math.PI - alpha) * rad,
            y: this.y - Math.cos(this.angle + Math.PI - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(this.angle + Math.PI + alpha) * rad,
            y: this.y - Math.cos(this.angle + Math.PI + alpha) * rad,
        });
        return points;
    }

    private move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed !== 0) {
            const flip = this.speed  > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }
}

export { Car };
