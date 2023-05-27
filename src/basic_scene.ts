import *  as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export function startBasicScene() {
    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // INIT CAMERA
    camera.position.z = 45;
    camera.position.x = 3;
    camera.position.y = 20;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, -40);
    controls.update();

    function randomRange(min: any, max: any) {
        return Math.random() * (max - min) + min;
    }

    // SCENE
    scene.background = new THREE.Color(0x000000);

    // FLOOR
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshPhongMaterial({ color: 0xe3d7bd }));
    plane.rotation.x = - Math.PI / 2
    // plane.receiveShadow = true
    scene.add(plane);

    let lights_number = 5
    let lights_container: any = []
    let random_rotations_coeff: any = []
    const pointLightFigure = new THREE.SphereGeometry(0.1, 16, 8)

    for (let i = 0; i < lights_number; i++) {
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.add( new THREE.Mesh( pointLightFigure, new THREE.MeshBasicMaterial( { color: 0xdfe4e0 } ) ) );
        scene.add(light);
        lights_container.push(light)
        random_rotations_coeff.push(randomRange(0, 50))
    }

    // TEXT
    const loader = new THREE.FontLoader();

    let user_enter_string = ""

    let textMeshArray: any[] = []

    document.body.addEventListener("keydown", (event) => {
        // нет учета на функциональные клавиши
        if (event.key == "Backspace") {
            user_enter_string = user_enter_string.slice(0, -1)
            scene.remove(textMeshArray[textMeshArray.length - 1])
            textMeshArray.pop()
        } else {
            user_enter_string += event.key

            loader.load('./Teko_Medium_Regular.json', function (font) {
                const geometry = new THREE.TextGeometry(user_enter_string, {
                    font: font,
                    size: 5,
                    height: 2,
                    curveSegments: 10,
                    bevelEnabled: false,
                    bevelOffset: 0,
                    bevelSegments: 1,
                    bevelSize: 0.3,
                    bevelThickness: 1
                });
                const materials = [
                    new THREE.MeshPhongMaterial({ color: 0x808080}), // front
                    new THREE.MeshPhongMaterial({ color: 0xC0C0C0}) // side
                ];
                const textMesh = new THREE.Mesh(geometry, materials);
                textMesh.position.y += 2
                textMesh.castShadow = true
                scene.add(textMesh)
                textMeshArray.push(textMesh)
            })
        }
    });

    // ANIMATE
    function animate() {
        const time = Date.now() * 0.0005

        for (let i = 0; i < lights_container.length; i++) {
            lights_container[i].position.x = Math.sin( time * 0.7 ) * random_rotations_coeff[i];
            lights_container[i].position.y = Math.cos( time * 0.5 ) * random_rotations_coeff[i] + 10;
            lights_container[i].position.z = Math.cos( time * 0.3 ) * random_rotations_coeff[i];
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    document.body.appendChild(renderer.domElement);
    animate();

}