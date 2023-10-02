// Purpose: Watch class implementation

import * as THREE from "three";

export default class Watch extends THREE.Group {
    constructor(cityName, center = new THREE.Vector2(0.0, 0.0), radius = 0.75, nameBackgroundColor = 0xffffff, nameForegroundColor = 0x000000, dialColor = 0x000000, markersColor = 0xffffff, handsHMColor = 0xffffff, handSColor = 0xff0000) {
        super();

        this.cities = [
            { name: "Oporto", timeZone: 0 },
            { name: "Paris", timeZone: 1 },
            { name: "Helsinki", timeZone: 2 },
            { name: "Beijing", timeZone: 7 },
            { name: "Tokyo", timeZone: 8 },
            { name: "Sydney", timeZone: 9 },
            { name: "Los Angeles", timeZone: -8 },
            { name: "New York", timeZone: -5 },
            { name: "Rio de Janeiro", timeZone: -4 },
            { name: "Reykjavik", timeZone: -1 }
        ];

        this.cityIndex = 0;
        const numberOfCities = this.cities.length;
        while (this.cityIndex < numberOfCities && cityName != this.cities[this.cityIndex].name) {
            this.cityIndex++;
        }
        if (this.cityIndex == numberOfCities) {
            this.cityIndex = 0;
        }

        let geometry = new THREE.CircleGeometry(radius, 60);
        let material = new THREE.MeshBasicMaterial({ color: dialColor });
        this.dial = new THREE.Mesh(geometry, material);
        this.add(this.dial);

        /** Add Minutes and Hour markers */

        const radius0 = 0.85 * radius;
        const radius1 = 0.90 * radius;
        const radius2 = 0.95 * radius;

        let points = [];

        const numberHours = 12;
        const numberMinutes = 60;
        const circleAngle = Math.PI * 2;


        /* Hour Lines */
        for (let i = 0; i < numberHours; i++) {
            const angle = (i / numberHours) * circleAngle;

            const x0 = Math.sin(angle) * radius0;
            const y0 = Math.cos(angle) * radius0;

            const x2 = Math.sin(angle) * radius2;
            const y2 = Math.cos(angle) * radius2;

            points.push(new THREE.Vector2(x0, y0));
            points.push(new THREE.Vector2(x2, y2));
        }

        /* 5 minute interval Lines */
        for (let i = 0; i < numberMinutes; i++) {
            if (i % 5 == 0) continue;

            const angle = (i / numberMinutes) * circleAngle;

            const x1 = Math.sin(angle) * radius1;
            const y1 = Math.cos(angle) * radius1;

            const x2 = Math.sin(angle) * radius2;
            const y2 = Math.cos(angle) * radius2;

            points.push(new THREE.Vector2(x1, y1));
            points.push(new THREE.Vector2(x2, y2));
        }

        geometry = new THREE.BufferGeometry().setFromPoints(points);
        material = new THREE.LineBasicMaterial({ color: markersColor });
        this.markers = new THREE.LineSegments(geometry, material);
        this.add(this.markers);


        // Create the hour hand (a line segment) pointing at 0.0 radians (the positive X-semiaxis)

        this.handH = new THREE.Group();

        // Create the mesh
        const hourHandVertices = new Float32Array([
            -0.1 * radius, 0.0, 0.0, // v0
            0.5 * radius, 0.0, 0.0, // v1
            0.0, 0.025 * radius, 0.0, // v2
            0.0, -0.025 * radius, 0.0 // v3
        ]);

        const hourHandIndices = [
            2, 0, 3, // v1-v2-v3
            2, 3, 1  // v0-v2-v3
        ];

        geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(hourHandVertices, 3));

        geometry.setIndex(hourHandIndices);
        material = new THREE.MeshBasicMaterial({ color: handsHMColor });
        const handH = new THREE.Mesh(geometry, material);

        this.handH.add(handH);
        this.add(this.handH);

        /** Create the minute hand (a line segment) pointing at 0.0 radians (the positive X-semiaxis)  */

        this.handM = new THREE.Group();

        // Create the mesh
        const minutesHandVertices = new Float32Array([
            -0.14 * radius, 0.0, 0.0, // v0
            0.7 * radius, 0.0, 0.0, // v1
            0.0, 0.035 * radius, 0.0, // v2
            0.0, -0.035 * radius, 0.0 // v3
        ]);

        const minutesHandIndices = [
            2, 0, 3, // v1-v2-v3
            2, 3, 1  // v0-v2-v3
        ];

        geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(minutesHandVertices, 3));

        geometry.setIndex(minutesHandIndices);
        material = new THREE.MeshBasicMaterial({ color: handsHMColor });
        const handM = new THREE.Mesh(geometry, material);

        this.handM.add(handM);
        this.add(this.handM);

        // Create the second hand (a line segment and a circle) pointing at 0.0 radians (the positive X-semiaxis)
        this.handS = new THREE.Group();

        // Create the line segment
        points = [
            new THREE.Vector2(0.8 * radius, 0.0),
            new THREE.Vector2(-0.24 * radius, 0.0),
        ];
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        material = new THREE.LineBasicMaterial({ color: handSColor });

        const handSMainPointer = new THREE.LineSegments(geometry, material);
        this.handS.add(handSMainPointer);

        // Create the red circle
        geometry = new THREE.CircleGeometry(0.03 * radius, 16);
        material = new THREE.MeshBasicMaterial({ color: handSColor });

        const handSRedCircle = new THREE.Mesh(geometry, material);
        this.handS.add(handSRedCircle);

        // Create the white circle
        const whiteCircleCenter = new THREE.Vector3(-0.12 * radius, 0.0, 0.0);

        geometry = new THREE.RingGeometry(0.05 * radius, 0.06 * radius, 16);
        material = new THREE.MeshBasicMaterial({ color: handSColor });

        const handSWhiteCircle = new THREE.Mesh(geometry, material);
        handSWhiteCircle.position.copy(whiteCircleCenter);
        this.handS.add(handSWhiteCircle);

        let clippingPlane = new THREE.Plane(new THREE.Vector3(0.0, 0.0, 1.0), 0.0);
        let clipMaterial = new THREE.MeshBasicMaterial({ color: handSColor, side: THREE.DoubleSide, clippingPlanes: [clippingPlane] });
        handSWhiteCircle.material = clipMaterial;

        this.add(this.handS);

        // Set the watch position
        this.position.set(center.x, center.y);

        // Create one HTML <div> element

        const container = document.getElementById("container");

        // Then create a "label" <div> element and append it as a child of "container"
        this.select = document.createElement("select");

        this.select.style.position = "absolute";
        this.select.style.left = (50.0 * center.x - 30.0 * radius).toString() + "vmin";
        this.select.style.top = (-50.0 * center.y + 54.0 * radius).toString() + "vmin";
        this.select.style.width = (60.0 * radius).toString() + "vmin";
        this.select.style.fontSize = (8.0 * radius).toString() + "vmin";
        this.select.style.backgroundColor = "#" + new THREE.Color(nameBackgroundColor).getHexString();
        this.select.style.color = "#" + new THREE.Color(nameForegroundColor).getHexString();
        this.cities.map((city) => {
            const option = document.createElement("option");
            option.value = city.name;
            option.text = city.name;
            this.select.appendChild(option);
        });

        this.select.addEventListener("change", (event) => {
            this.cityIndex = this.cities.findIndex((city) => city.name === event.target.value);
            this.select.name = this.cities[this.cityIndex].name;
        });

        this.select.selectedIndex = this.cityIndex;
        container.appendChild(this.select);
    }


    update() {
        const time = Date().split(" ")[4].split(":").map(Number); // Hours: time[0]; minutes: time[1]; seconds: time[2]
        time[0] = (time[0] + this.cities[this.cityIndex].timeZone) % 12;

        // Compute the second hand angle
        let secondAngle = Math.PI / 2.0 - 2.0 * Math.PI * time[2] / 60.0;
        this.handS.rotation.z = secondAngle;

        /* To-do #5 - Compute the minute hand angle. It depends mostly on the current minutes value (time[1]), but you will get a more accurate result if you make it depend on the seconds value (time[2]) as well.
        angle = ...;
        this.handM.rotation.z = angle; */

        let minuteAngle = Math.PI / 2.0 - 2.0 * Math.PI * time[1] / 60.0 - 2.0 * Math.PI * time[2] / 3600.0;
        this.handM.rotation.z = minuteAngle;

        /* To-do #6 - Compute the hour hand angle. It depends mainly on the current hours value (time[0]). Nevertheless, you will get a much better result if you make it also depend on the minutes and seconds values (time[1] and time[2] respectively).
        angle = ...;
        this.handH.rotation.z = angle; */

        let hourAngle = Math.PI / 2.0 - 2.0 * Math.PI * time[0] / 12 - 2 * Math.PI * time[1] / (60.0 * 12.0) - 2 * Math.PI * time[2] / (3600.0 * 12);

        this.handH.rotation.z = hourAngle;
    }
}