class Controls {
    forward: boolean;
    reverse: boolean;
    left: boolean;
    right: boolean;

    constructor() {
        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;

        this._addKeyboardListener();
    }

    private _addKeyboardListener() {
        document.onkeydown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.forward = true;
                    break;
                case 'ArrowDown':
                    this.reverse = true;
                    break;
                case 'ArrowLeft':
                    this.left = true;
                    break;
                case 'ArrowRight':
                    this.right = true;
                    break;
            }
            console.table(this);
        }
        document.onkeyup = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.forward = false;
                    break;
                case 'ArrowDown':
                    this.reverse = false;
                    break;
                case 'ArrowLeft':
                    this.left = false;
                    break;
                case 'ArrowRight':
                    this.right = false;
                    break;
            }
            console.table(this);
        }
    }
}

export { Controls };
