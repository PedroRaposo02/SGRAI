import * as THREE from "three";
import { merge } from "./merge.js";

/*
 * parameters = {
 *  color: Integer,
 *  side: String,
 *  size: Vector2,
 *  speed: Float,
 *  baseline: Float,
 *  keyCodes: { down: String, up: String }
 * }
 */

export default class Player extends THREE.Mesh {
    constructor(parameters, table) {
        super();
        merge(this, parameters);
        this.halfSize = this.size.clone().divideScalar(2.0);
        this.baseline *= table.halfSize.x;
        /* To-do #7 - Compute the rackets' lower and upper boundaries
            - both the lower and upper boundaries depend on the table and racket dimensions
            - more specifically, the boundaries depend on parameters table.halfSize.y (the table's half Y-dimension) and this.halfSize.y (the racket's half Y-dimension)

        this.centerLower = ...;
        this.centerUpper = ...; */
        this.centerLower = -table.halfSize.y + this.halfSize.y;
        this.centerUpper = table.halfSize.y - this.halfSize.y;
        
        this.keyStates = { down: false, up: false };

        this.geometry = new THREE.PlaneGeometry(this.size.x, this.size.y);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });

        this.initialize();
    }

    checkUpperBoundary() {
        if (this.center.y > this.centerUpper) {
            this.center.y = this.centerUpper;
        }
    }
    
    checkLowerBoundary() {
        if (this.center.y < this.centerLower) {
            this.center.y = this.centerLower;
        }    
    }

    initialize() {
        this.center = new THREE.Vector2(this.baseline, 0.0);
        if (this.side == "left") { // Player 1 racket: the center's x-coordinate must be negative
            this.center.x = -this.center.x;
        }
        this.score = 0;

        this.position.set(this.center.x, this.center.y, 0.0);
    }

    updateScore() {
        this.score += 1;
    }

    update(deltaT) {

        if (this.keyStates.down) {
            this.center.y -= this.speed * deltaT;
            this.checkLowerBoundary();
        }
        if (this.keyStates.up) {
            this.center.y += this.speed * deltaT;
            this.checkUpperBoundary();
        }
        this.position.set(this.center.x, this.center.y, 0.0);
    }
}