import * as THREE from "three";
import { merge } from "./merge.js";

/*
 * parameters = {
 *  color: Integer,
 *  radius: Float,
 *  speed: Float,
 *  directionMax: Float,
 * }
 */

export default class Ball extends THREE.Mesh {
    constructor(parameters, player1, player2, table) {
        super();
        merge(this, parameters);
        this.player1 = player1;
        this.player2 = player2;
        this.table = table;

        // Create the ball (a circle)
        this.geometry = new THREE.CircleGeometry(this.radius, 16);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });

        this.centerUpper = this.table.halfSize.y - this.radius;
        this.centerDown = -this.table.halfSize.y + this.radius;
        this.centerLeft = -this.table.halfSize.x + this.radius;
        this.centerRight = this.table.halfSize.x - this.radius;

        this.initialize();
    }

    initialize() {
        this.center = new THREE.Vector2(0.0, THREE.MathUtils.randFloatSpread(this.table.size.y - 4.0 * this.radius));
        this.direction = THREE.MathUtils.randFloatSpread(2.0 * this.directionMax); // Direction in radians
        this.position.set(this.center.x, this.center.y);
    }

    update(deltaT) {

        const r = this.speed * deltaT;
        const newX = r * Math.cos(this.direction) + this.center.x;
        const newY = r * Math.sin(this.direction) + this.center.y;

        const centerIncrement = new THREE.Vector2(newX - this.center.x, newY - this.center.y);

        this.center.add(centerIncrement);

        // Rackets rebounds
        if (
            this.center.x + this.radius > this.player2.center.x - this.player2.size.x / 2 &&
            this.center.y + this.radius > this.player2.center.y - this.player2.size.y / 2 &&
            this.center.y - this.radius < this.player2.center.y + this.player2.size.y / 2
        ) {
            this.center.x = this.player2.center.x - this.player2.size.x / 2 - this.radius
            this.direction = -(this.direction + Math.PI)
        }

        if (
            this.center.x - this.radius < this.player1.center.x + this.player1.size.x / 2 &&
            this.center.y + this.radius > this.player1.center.y - this.player1.size.y / 2 &&
            this.center.y - this.radius < this.player1.center.y + this.player1.size.y / 2
        ) {
            this.center.x = this.player1.center.x + this.player1.size.x / 2 + this.radius;
            this.direction = -(this.direction + Math.PI);
        }

        // Upper and Down bounds
        if (this.center.y > this.centerUpper) {
            this.center.y = this.centerUpper;
            this.direction = -this.direction;
        }

        if (this.center.y < this.centerDown) {
            this.center.y = this.centerDown;
            this.direction = -this.direction;
        }

        // Right and Left bounds



        this.position.set(this.center.x, this.center.y);

    }
}