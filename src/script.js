import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

/**
 * Galaxy
 */

const parameters ={}
parameters.count= 10000;
parameters.size=0.01;
parameters.radius=5;
parameters.branches=3;
parameters.spin=1;
parameters.randomness=0.02;
parameters.randomnessPower=3;
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'
let particlesGementry= null;
let particlesMaterial=null;
let particles=null;
const generateGalaxy = () =>{

    console.log("Galaxy Generator");
    if(particles!=null)
    {
        particlesGementry.dispose();
        particlesMaterial.dispose();
        scene.remove(particles);
    }
    particlesGementry = new THREE.BufferGeometry();
    particlesMaterial= new THREE.PointsMaterial({
        size:parameters.size,
        sizeAttenuation:true,
        depthWrite:false,
        blending:THREE.AdditiveBlending,
        vertexColors:true
    });
    particles = new THREE.Points(particlesGementry,particlesMaterial);
    const positions = new Float32Array(parameters.count*3);
    const colors = new Float32Array(parameters.count*3);
    const insideColor = new THREE.Color(parameters.insideColor) 
    const outsideColor= new THREE.Color(parameters.outsideColor)
    for(let i=0;i<parameters.count;i++)
    {
        const radius = Math.random()*parameters.radius;
        const branchAngle = (i%parameters.branches)/parameters.branches*Math.PI*2;
        const spinAngle = radius * parameters.spin;
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const pos = i*3;

        positions[pos]=Math.sin(branchAngle+spinAngle)*radius + randomX;
        positions[pos+1]=randomY;
        positions[pos+2]=Math.cos(branchAngle+spinAngle)*radius +randomZ;

        //Color

        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor,radius/parameters.radius)

        colors[pos]=mixedColor.r;
        colors[pos+1]=mixedColor.g;
        colors[pos+2]=mixedColor.b;
    }
    particlesGementry.setAttribute('position',new THREE.BufferAttribute(positions,3));
     particlesGementry.setAttribute('color',new THREE.BufferAttribute(colors,3));

    scene.add(particles)

}

generateGalaxy();

gui.add(parameters,'count').min(100).max(1000000).step(1000).onFinishChange(generateGalaxy)
gui.add(parameters,'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'radius').min(3).max(10).step(0.5).onFinishChange(generateGalaxy)
gui.add(parameters,'branches').min(2).max(10).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'spin').min(-5).max(5).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'randomness').min(0).max(2).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'randomnessPower').min(1).max(10).step(0.01).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()