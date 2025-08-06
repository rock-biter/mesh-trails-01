import './style.css'
import * as THREE from 'three'
// __controls_import__
// __gui_import__

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Pane } from 'tweakpane'

/**
 * Debug
 */
// __gui__
const config = {
	example: 50,
}
const pane = new Pane()

pane
	.addBinding(config, 'example', {
		min: 0,
		max: 5,
		step: 0.01,
	})
	.on('change', (ev) => {
		console.log(ev.value)
	})

/**
 * Scene
 */
const scene = new THREE.Scene()
// scene.background = new THREE.Color(0x000000)

// __box__
/**
 * BOX
 */
// const material = new THREE.MeshNormalMaterial()
const material = new THREE.MeshStandardMaterial({
	color: 'coral',
	transparent: true,
	opacity: 1,
})
// const material = new THREE.MeshNormalMaterial()
const geometry = new THREE.TetrahedronGeometry(1)
const mesh = new THREE.Mesh(geometry, material)
mesh.position.y += 0.5
mesh.position.x = Math.sin(0) * 5
mesh.position.z = Math.cos(0) * 5
scene.add(mesh)

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

/**
 * Camera
 */
const fov = 60
const camera = new THREE.PerspectiveCamera(
	fov,
	sizes.width / sizes.height,
	0.1,
	50
)
camera.position.set(7, 7, 7)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * Show the axes of coordinates system
 */
// __helper_axes__
const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
})
// renderer.outputColorSpace = THREE.LinearSRGBColorSpace // Aggiungi questa riga
document.body.appendChild(renderer.domElement)
// renderer.setClearColor(new THREE.Color(0, 0, 0))
renderer.clearColor()
handleResize()

/**
 * OrbitControls
 */
// __controls__
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
const directionalLight = new THREE.DirectionalLight(0xffffff, 4.5)
directionalLight.position.set(3, 10, 7)
scene.add(ambientLight, directionalLight)

renderer.render(scene, camera)

/**
 * Three js Clock
 */
// __clock__
const clock = new THREE.Clock()
let t = 0

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	const dt = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	t += dt

	mesh.rotation.x = t * 2
	mesh.rotation.y = t

	mesh.position.x = Math.sin(t) * 5
	mesh.position.z = Math.cos(t) * 5

	// __controls_update__
	controls.update(dt)
	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height

	// camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
	renderer.clear()
}
