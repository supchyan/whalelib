class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * new Vector2(0, 0).
     */
    static get Zero() {
        return new Vector2(0, 0);
    }

    /**
     * Returns current vector length.
     */
    getLength() {
        return Math.sqrt((Math.pow(this.x, 2) + Math.pow(this.y, 2)));
    }

    /**
     * Adds `offsetVector` to current vector.
     * @param {*} offsetVector reference `Vector2`.
     * @returns New `Vector2`.
     */
    add(offsetVector) {
        return new Vector2(
            this.x + offsetVector.x,
            this.y + offsetVector.y
        );
    }
}