class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Rotates `Vector3` by specified angle around Y.
     * @param {*} angle angle in radians.
     * @returns Rotated `Vector3` object.
     */
    #rotateXZ(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return new Vector3(
            (this.x * cos - this.z * sin) + sin,
            this.y,
            (this.x * sin + this.z * cos) + (1 - cos),
        );
    }

    /**
     * Rotates vector with specified angle around Z.
     * @param {*} angle angle in radians.
     * @returns Rotated `Vector3` object.
     */
    #rotateXY(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return new Vector3(
            (this.x * cos - this.y * sin),
            (this.x * sin + this.y * cos),
            this.z
        );
    }

    /**
     * Rotates vector with specified angle around X.
     * @param {*} angle angle in radians.
     * @returns rotated `Vertex` object.
     */
    #rotateYZ(angle) { // : Vertex
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return new Vector3(
            this.x,
            (this.z * sin + this.y * cos) - sin,
            (this.z * cos - this.y * sin) + (1 - cos)
        );
    }

    /**
     * new Vector3(0, 0, 0).
     */
    static get Zero() {
        return new Vector3(0, 0, 0);
    }

    /**
     * Returns current vector length.
     */
    getLength() {
        return Math.sqrt((Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2)));
    }

    /**
     * Converts `Vector3` to `Vector2` projecting it to 2D space.
     * @returns New `Vector2` object.
     */
    toVector2() {
        return new Vector2(
            this.x / this.z,
            this.y / this.z
        );
    }

    /**
     * Rotates vector by a rotation vector specified.
     * @param {*} rotation rotation vector as `Vector3`.
     * @returns New rotated `Vector3`.
     */
    toRotation(rotation) {
        return this.#rotateYZ(rotation.x).#rotateXZ(rotation.y).#rotateXY(rotation.z);
    }

    /**
     * Adds `offsetVector` to current vector.
     * @param {*} offsetVector reference `Vector3`.
     * @returns New `Vector3`.
     */
    add(offsetVector) {
        return new Vector3(
            this.x + offsetVector.x,
            this.y + offsetVector.y,
            this.z + offsetVector.z
        );
    }
}