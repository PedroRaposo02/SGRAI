import * as THREE from "three";
import Ground from "./ground_template.js";
import Wall from "./wall_template.js";

/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */

export default class Maze {
    constructor(parameters) {
        this.onLoad = function (description) {
            // Store the maze's map and size
            this.map = description.map;
            this.size = description.size;

            // Store the player's initial position and direction
            this.initialPosition = this.cellToCartesian(description.initialPosition);
            this.initialDirection = description.initialDirection;

            // Store the maze's exit location
            this.exitLocation = this.cellToCartesian(description.exitLocation);

            // Create a group of objects
            this.object = new THREE.Group();

            // Create the ground
            this.ground = new Ground({ textureUrl: description.groundTextureUrl, size: description.size });
            this.object.add(this.ground.object);

            // Create a wall
            this.wall = new Wall({ textureUrl: description.wallTextureUrl });

            // Build the maze
            let wallObject;
            for (let i = 0; i <= description.size.width; i++) { // In order to represent the eastmost walls, the map width is one column greater than the actual maze width
                for (let j = 0; j <= description.size.height; j++) { // In order to represent the southmost walls, the map height is one row greater than the actual maze height
                    /*
                     * description.map[][] | North wall | West wall
                     * --------------------+------------+-----------
                     *          0          |     No     |     No
                     *          1          |     No     |    Yes
                     *          2          |    Yes     |     No
                     *          3          |    Yes     |    Yes
                     */

                    if (description.map[j][i] == 2 || description.map[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - description.size.width / 2 + 0.5, 0, j - description.size.height / 2);
                        this.object.add(wallObject);
                    }

                    if (description.map[j][i] == 1 || description.map[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - description.size.width / 2, 0, j - description.size.height / 2 + 0.5);
                        wallObject.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2)
                        this.object.add(wallObject);
                    }
                    /* To-do #5 - Create the north walls
                        - cell coordinates: i (column) and j (row)
                        - map: description.map[][]
                        - maze width: description.size.width
                        - maze height: description.size.height
                    if (description.map[j][i] == ... || description.map[j][i] == ...) {
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - ... + 0.5, ..., j - ...);
                        this.object.add(wallObject);
                    }
                    /* To-do #6 - Create the west walls
                        - cell coordinates: i (column), j (row)
                        - map: description.map[][]
                        - maze width: description.size.width
                        - maze height: description.size.height
                    if (...) {
                        ...;
                        wallObject.rotate...(...);
                        ...;
                        ...;
                    } */
                }
            }

            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.loaded = true;
        };

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        };

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        };

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;

        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();

        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType("json");

        // Load a maze description resource file
        loader.load(
            //Resource URL
            this.url,

            // onLoad callback
            description => this.onLoad(description),

            // onProgress callback
            xhr => this.onProgress(this.url, xhr),

            // onError callback
            error => this.onError(this.url, error)
        );
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        return new THREE.Vector3((position[1] - this.size.height / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.width / 2.0 + 0.5) * this.scale.z);
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        return [Math.floor(position.z / this.scale.z + this.size.width / 2.0), Math.floor(position.x / this.scale.x + this.size.height / 2.0)];
    }

    /* To-do #23 - Measure the player’s distance to the walls
        - player position: position
    distanceToWestWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }
        return Infinity;
    }

    distanceToEastWall(position) {
        const indices = ...;
        indices[1]++;
        if (... || ...) {
            return ...;
        }
        return ...;
    }

    distanceToNorthWall(position) {
        const indices = ...;
        if (... || ...) {
            return ...;
        }
        return ...;
    }

    distanceToSouthWall(position) {
        const indices = ...;
        ...++;
        if (... || ...3) {
            return ...z;
        }
        return ...;
    } */

    foundExit(position) {
        return false;
        /* To-do #42 - Check if the player found the exit
            - assume that the exit is found if the distance between the player position and the exit location is less than (0.5 * maze scale) in both the X- and Z-dimensions
            - player position: position
            - exit location: this.exitLocation
            - maze scale: this.scale
            - remove the previous instruction and replace it with the following one (after completing it)
        return ... < ... && ... */
    }
}