// BIG Thanks to tutsplus.com
// http://code.tutsplus.com/tutorials/webgl-with-threejs-basics--net-35688
// for helping me getting started

//Stuff for rendering
var DEG2RAD = Math.PI / 180;
var width, height, renderer, scene, camera;
var clock = new THREE.Clock;
var rotY = 0, rotX = 0;
var matWood = new THREE.MeshLambertMaterial({ color: 0x826841 });
//var matWood = new THREE.MeshLambertMaterial({ color: 0x826841, transparent: true, opacity: 0.5 }); //For testing the mesh alignment
var matStone = new THREE.MeshLambertMaterial({ color: 0xadadad });
var viewCenter = new THREE.Vector3(0,0,0);
// Meshes
// The ones marked with //* are not real meshes, but contain a child (or more) which gets rendered.
// This is done, so these can easily be rotated around an accurate pivot point.
var mBasePlate;
var mBody; //*
var mHead; //*
var mLegLeft; //*
var mLegRight; //*
var mArmLeft; //*
var mArmRight; //*
var armorstand, armorstandWrapper; //Group all the other elements


//DATA -> Stuff that we'll use to generate the command. Fetched from the controls.
var invisible = false;
var invulnerable = false;
var noBasePlate = false;
var noGravity = false;
var showArms = false;
var small = false;
var head = new THREE.Vector3(0,0,0);
var body = new THREE.Vector3(0,0,0);
var leftLeg = new THREE.Vector3(0,0,0);
var rightLeg = new THREE.Vector3(0,0,0);
var leftArm = new THREE.Vector3(0,0,0);
var rightarm = new THREE.Vector3(0,0,0);

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
	updateUI();
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



	//BasePlate
	mBasePlate = new THREE.Mesh(
		new THREE.CubeGeometry(12/16, 1/16, 12/16),
		matStone);
	mBasePlate.position.y = -1/32;
	//Add a little dot to the BasePlate, so the user knows which way is forward
	mmBaseDot = new THREE.Mesh(
		new THREE.CubeGeometry(4/16, 1/16, 4/16),
		matStone);
	mmBaseDot.position.set(0,0,8/16);
	mBasePlate.add(mmBaseDot);
	armorstand.add(mBasePlate);

	// To Generate the other body parts, we will use a mesh to display, 
	// and add it as a child to the object that serves as a pivot.

	//Left Leg
	var mmLegLeft = new THREE.Mesh(
		new THREE.CubeGeometry(2/16, 11/16, 2/16),
		matWood);
	mmLegLeft.position.set(0,-5.5/16,0);
	mLegLeft = new THREE.Object3D();
	mLegLeft.position.set(2/16,11/16,0); //Pivot Point
	mLegLeft.add(mmLegLeft);
	armorstand.add(mLegLeft);

	//Right Leg
	var mmLegRight = new THREE.Mesh(
		new THREE.CubeGeometry(2/16, 11/16, 2/16),
		matWood);
	mmLegRight.position.set(0,-5.5/16,0);
	mLegRight = new THREE.Object3D();
	mLegRight.position.set(-2/16,11/16,0); //Pivot Point
	mLegRight.add(mmLegRight);
	armorstand.add(mLegRight);

	//Left Arm
	var mmArmLeft = new THREE.Mesh(
		new THREE.CubeGeometry(2/16, 12/16, 2/16),
		matWood);
	mmArmLeft.position.set(0,-4/16,0);
	mArmLeft = new THREE.Object3D();
	mArmLeft.position.set(6/16,21/16,0); //Pivot Point
	mArmLeft.add(mmArmLeft);
	armorstand.add(mArmLeft);

	//Right Arm
	var mmArmRight = new THREE.Mesh(
		new THREE.CubeGeometry(2/16, 12/16, 2/16),
		matWood);
	mmArmRight.position.set(0,-4/16,0);
	mArmRight = new THREE.Object3D();
	mArmRight.position.set(-6/16,21/16,0); //Pivot Point
	mArmRight.add(mmArmRight);
	armorstand.add(mArmRight);

	//Body (consists of four parts)
	var mmHip = new THREE.Mesh(
		new THREE.CubeGeometry(8/16, 2/16, 2/16),
		matWood);
	mmHip.position.set(0,-11/16,0);
	var mmBodyLeft = new THREE.Mesh(
		new THREE.CubeGeometry(2/16, 7/16, 2/16),
		matWood);
	mmBodyLeft.position.set(2/16,-6.5/16,0);
	var mmBodyRight = new THREE.Mesh(
		new THREE.CubeGeometry(2/16, 7/16, 2/16),
		matWood);
	mmBodyRight.position.set(-2/16,-6.5/16,0);
	var mmShoulders = new THREE.Mesh(
		new THREE.CubeGeometry(12/16, 3/16, 3/16),
		matWood);
	mmShoulders.position.set(0,-1.5/16,0);
	mBody = new THREE.Object3D();
	mBody.position.set(0,23/16,0); //Pivot Point
	mBody.add(mmHip);
	mBody.add(mmBodyLeft);
	mBody.add(mmBodyRight);
	mBody.add(mmShoulders);
	armorstand.add(mBody);

	//Head (neck and skull)
	var mmNeck = new THREE.Mesh(
		new THREE.CubeGeometry(2/16, 7/16, 2/16),
		matWood);
	mmNeck.position.set(0,3.5/16,0);
	/*
	We do not want the head, as it obstructs a whole lot of the view. We can implement this,
	once we've got an editor option to toggle it on and off.
	var mmSkull = new THREE.Mesh(
		new THREE.CubeGeometry(10/16, 10/16, 10/16),
		matWood);
	mmSkull.position.set(0,5/16,0);*/
	mHead = new THREE.Object3D();
	mHead.position.set(0,22/16,0); //Pivot Point
	mHead.add(mmNeck);
	armorstand.add(mHead);

	//Add an armorstandwrapper to the scene, so the armorstand can be rotated naturally.
	armorstandWrapper = new THREE.Object3D();
	armorstand.position.set(0,-0.5,0);
	armorstandWrapper.add(armorstand);
	scene.add(armorstandWrapper);

	camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
	camera.position.y = 2;
	camera.position.z = 4;
	camera.lookAt(viewCenter);
	scene.add(camera);

	var pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(0, 300, 200);
	 
	scene.add(pointLight);
}

function handleInput(){
	
	invisible = getCheckBox("invisible");
	invulnerable = getCheckBox("invulnerable");
	noBasePlate = getCheckBox("nobaseplate");
	noGravity = getCheckBox("nogravity");
	showArms = getCheckBox("showarms");
	small = getCheckBox("small");


	updateUI();
}
function getCheckBox(name){
	return $("input[name="+name+"]").prop("checked");
}

/** Changes stuff according to our input values */
function updateUI(){
	//Hide/Show the arm section
	if(showArms)
		$("#inputarms").show();
	else
		$("#inputarms").hide();
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

	armorstandWrapper.rotation.y = rotY + getMouseDeltaX();
	armorstandWrapper.rotation.x = rotX + getMouseDeltaY();

	requestAnimationFrame(render);
}