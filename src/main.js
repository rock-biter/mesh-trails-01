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
	example: 5,
}
const pane = new Pane()

pane
	.addBinding(config, 'example', {
		min: 0,
		max: 10,
		step: 0.1,
	})
	.on('change', (ev) => console.log(ev.value))

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
	opacity: 0.5,
	// blending: THREE.AdditiveBlending,
})
const geometry = new THREE.BoxGeometry(1, 1, 1)
const mesh = new THREE.Mesh(geometry, material)
mesh.position.y += 0.5
scene.add(mesh)

// fullscreen mesh
// fullscreen triangle
const triangleGeometry = new THREE.BufferGeometry()
const triangleVertices = new Float32Array([
	-1,
	-1,
	-0, // vertex 1: bottom left
	3,
	-1,
	-0, // vertex 2: bottom right
	-1,
	3,
	-0, // vertex 3: top left
])

triangleGeometry.setAttribute(
	'position',
	new THREE.BufferAttribute(triangleVertices, 3)
)

const triangleMaterial = new THREE.ShaderMaterial({
	vertexShader: /* glsl */ `
		void main() {
			gl_Position = vec4(position, 1.0);
		}
		`,
	fragmentShader: /* glsl */ `
	uniform float opacity;
		void main() {
			gl_FragColor = vec4(vec3(opacity),opacity * 20.);
	// 		#include <tonemapping_fragment>
	// #include <colorspace_fragment>
		}
		`,
	transparent: true,
	// doubleSide: THREE.DoubleSide,
	depthWrite: false,
	depthTest: false,
	uniforms: {
		opacity: new THREE.Uniform(1),
	},
	// blending: THREE.CustomBlending,
	// blendEquation: THREE.AddEquation, // Cambia qui
	// // blendEquation: THREE.ReverseSubtractEquation, // Cambia qui
	// // blendSrc: THREE.SrcColorFactor, // Cambia qui
	// blendSrc: THREE.SrcColorFactor, // Cambia qui
	// // blendDst: THREE.OneMinusDstAlphaFactor, // Cambia qui,
	// // blendAlpha: 0.0,
	// // blendSrcAlpha: THREE.One,
	// blendDstAlpha: THREE.OneFactor,
})

const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial)
triangleMesh.renderOrder = -2
scene.add(triangleMesh)

// __floor__
/**
 * Plane
 */
// const groundMaterial = new THREE.MeshStandardMaterial({ color: 'lightgray' })
// const groundGeometry = new THREE.PlaneGeometry(10, 10)
// groundGeometry.rotateX(-Math.PI * 0.5)
// const ground = new THREE.Mesh(groundGeometry, groundMaterial)
// scene.add(ground)

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
	10
)
camera.position.set(4, 4, 4)
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
	alpha: true,
	preserveDrawingBuffer: true,
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

scene.background = new THREE.Color('white')

renderer.render(scene, camera)
triangleMaterial.uniforms.opacity.value = 0.002
;(triangleMaterial.blending = THREE.CustomBlending),
	(triangleMaterial.blendEquation = THREE.AddEquation) // Cambia qui
// blendEquation: THREE.ReverseSubtractEquation, // Cambia qui
// blendSrc: THREE.SrcColorFactor, // Cambia qui
triangleMaterial.blendSrc = THREE.SrcColorFactor // Cambia qui
// blendDst: THREE.OneMinusDstAlphaFactor, // Cambia qui,
// blendAlpha: 0.0,
// blendSrcAlpha: THREE.One,
triangleMaterial.blendDstAlpha = THREE.OneFactor

/**
 * Three js Clock
 */
// __clock__
const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	// const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	const time = clock.getElapsedTime()

	mesh.rotation.x = time
	mesh.rotation.y = time

	// __controls_update__
	controls.update()

	renderer.autoClearColor = false
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
