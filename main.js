// BIG Thanks to tutsplus.com
// http://code.tutsplus.com/tutorials/webgl-with-threejs-basics--net-35688
// for helping me getting started

var width, height, renderer, scene, camera, cube;
var clock = new THREE.Clock;

$(document).ready(function(){
	setup();

	render();

	$("input").on("input", function(){
		handleInput();
	});
	$(':checkbox').change(function() {
    	handleInput();
	}); 
});

function setup(){
	width = $("#gl").width();
	height = $("#gl").height();

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
	renderer.setSize(width, height);
	$("#gl").append(renderer.domElement);
	

	scene = new THREE.Scene;

	var cubeGeo = new THREE.CubeGeometry(1, 1, 1);
	var cubeMat = new THREE.MeshLambertMaterial({ color: 0x1ec876 });
	cube = new THREE.Mesh(cubeGeo, cubeMat);

	cube.rotation.y = 45 * Math.PI/180;

	scene.add(cube);

	camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
	camera.position.y = 2;
	camera.position.z = 4;
	camera.lookAt(cube.position);
	scene.add(camera);

	var pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(0, 300, 200);
	 
	scene.add(pointLight);
}

function handleInput(){
	cube.material.color.setHex(Math.random() * 0xFFFFFF);
}

function render(){
	renderer.render(scene, camera);

	var d = clock.getDelta();
	cube.rotation.y += d;

	requestAnimationFrame(render);
}