import { lerp } from './utils';

class Road {
    left: number;
    right: number;
    top: number;
    bottom: number;
    borders: Array<Array<{ x: number, y: number }>>;

    constructor(
        public x: number,
        public width: number,
        public lanes: number = 3
    ) {
        this.left = x - width / 2;
        this.right = x + width / 2;

        const INFINITE = 1000000;
        this.top = -INFINITE;
        this.bottom = INFINITE;

        const topLeft = { x: this.left, y: this.top };
        const topRight = { x: this.right, y: this.top };
        const bottomLeft = { x: this.left, y: this.bottom };
        const bottomRight = { x: this.right, y: this.bottom };
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight],
        ]
    }

    getLaneCenter(lane: number) {
        const laneWidth = this.width / this.lanes;
        return this.left + laneWidth / 2 + laneWidth * Math.min(this.lanes - 1, lane);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'white';

        for (let i = 1; i <= this.lanes - 1; i++) {
            const x = lerp(this.left, this.right, i / this.lanes);

            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }
}

export { Road };
