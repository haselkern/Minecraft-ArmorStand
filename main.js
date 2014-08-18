// BIG Thanks to tutsplus.com
// http://code.tutsplus.com/tutorials/webgl-with-threejs-basics--net-35688
// for helping me getting started

//Stuff for rendering
var width, height, renderer, scene, camera, cube;
var clock = new THREE.Clock;
var rotY = 0, rotX = 0;

var armorstand; //Groups all the other elements

//Stuff for mouse movements
var mouseDownX;
var mouseDownY;
var mouseMoveX;
var mouseMoveY;
var mouseRotationMultiplier = 0.008;
//A point class will help us manage the mouse movements.
Point = {
	x:null,
	y:null
};

$(document).ready(function(){
	setup();

	render();

	$("input").on("input", function(){
		handleInput();
	});
	$(':checkbox').change(function() {
    	handleInput();
	}); 

	$("#gl")
	.mousedown(function(event){
		mouseDownX = event.pageX;
		mouseDownY = event.pageY;
	})
	.mousemove(function(event){
		mouseMoveX = event.pageX;
		mouseMoveY = event.pageY;
	})
	.mouseup(function(event){
		rotY += getMouseDeltaX();
		rotX += getMouseDeltaY();
		mouseDownX = null;
		mouseDownY = null;
	});
});

function setup(){
	width = $("#gl").width();
	height = $("#gl").height();

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
	renderer.setSize(width, height);
	$("#gl").append(renderer.domElement);
	

	scene = new THREE.Scene();
	armorstand = new THREE.Object3D();

	var cubeGeo = new THREE.CubeGeometry(1, 1, 1);
	var cubeMat = new THREE.MeshLambertMaterial({ color: 0x1ec876 });
	cube = new THREE.Mesh(cubeGeo, cubeMat);

	//Parenting example
	cube2 = new THREE.Mesh(new THREE.CubeGeometry(0.5,0.5,0.5), cubeMat);
	cube2.position.y = 0.7;
	cube.add(cube2);

	armorstand.add(cube);

	scene.add(armorstand);

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
function getMouseDeltaX(){
	var mouseDeltaX = 0;
	if(mouseDownX != null && mouseMoveX != null){
		mouseDeltaX = mouseMoveX - mouseDownX;
	}
	return mouseDeltaX * mouseRotationMultiplier;
}
function getMouseDeltaY(){
	var mouseDeltaY = 0;
	if(mouseDownY != null && mouseMoveY != null){
		mouseDeltaY = mouseMoveY - mouseDownY;
	}
	return mouseDeltaY * mouseRotationMultiplier;
}

function render(){
	renderer.render(scene, camera);

	var deltaTime = clock.getDelta();

	armorstand.rotation.y = rotY + getMouseDeltaX();
	armorstand.rotation.x = rotX + getMouseDeltaY();

	requestAnimationFrame(render);
}