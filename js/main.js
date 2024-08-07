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
var matTransparentStone = new THREE.MeshLambertMaterial({ color: 0xadadad });
matTransparentStone.opacity = 0.8;
matTransparentStone.transparent = true;
var viewCenter = new THREE.Vector3(0,0,0);
// Meshes
// The ones marked with //* are not real meshes, but contain a child (or more) which gets rendered.
// This is done, so these can easily be rotated around an accurate pivot point.
var mBasePlate;
var mBody; //*
var mHead; //*
var mSkull;
var mLegLeft; //*
var mLegRight; //*
var mArmLeft; //*
var mArmRight; //*
var armorstand, armorstandWrapper; //Group all the other elements


//DATA -> Stuff that we'll use to generate the command. Fetched from the controls.

var mcVersion;

var invisible = false;
var invulnerable = false;
var persistencerequired = false;
var noBasePlate = false;
var noGravity = false;
var showArms = false;
var small = false;
var marker = false;
var centercorrected = false;
var give = false;

var useEquipment;
var equipHandRight;
var equipHandLeft;
var equipShoes;
var equipLeggings;
var equipChestplate;
var equipHelmet = "";
var equipCustomHeadMode;
var equipColorShoes;
var equipColorLeggings;
var equipColorChestplate;
var equipColorHelmet;
var helmetList;
var chestplateList;
var leggingsList;
var bootsList;

var customName;
var showCustomName;
var nameColor;
var nameBold;
var nameItalic;
var nameobfuscated;
var nameStrikethrough;

var useDisabledSlots;

var scoreboardTags;


//The rotation values are all in degrees.
var head = new THREE.Vector3(0,0,0);
var body = new THREE.Vector3(0,0,0);
var leftLeg = new THREE.Vector3(0,0,0);
var rightLeg = new THREE.Vector3(0,0,0);
var leftArm = new THREE.Vector3(0,0,0);
var rightArm = new THREE.Vector3(0,0,0);
var rotation = 0;

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

jQuery.fn.selectAndCopyText = function(){
    // https://stackoverflow.com/a/9976413/1456971
    this.find('input').each(function() {
        if($(this).prev().length == 0 || !$(this).prev().hasClass('p_copy')) {
            $('<p class="p_copy" style="position: absolute; z-index: -1;"></p>').insertBefore($(this));
        }
        $(this).prev().html($(this).val());
    });

    var doc = document;
    var element = this[0];
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }

	document.execCommand("copy");
};

$(document).ready(function(){
	//Init
	setup();
	updateUI();
	render();
	loadScreen();

	// Confirm exit
	window.onbeforeunload = function(){
		return "Unsaved changes will NOT be saved. Exit anyways?";
	};

	// Copy code on click
	$(".code").click(function(){
		$("#code").selectAndCopyText();
	});
	
	//Stuff to handle and update input
	$("input").on("input", function(){
		handleInput();
	});
	$(':checkbox, #equipCustomHeadMode, #equipmode, #mcversion').change(function() {
    	handleInput();
	});


	//Handle rotating with mouse
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

	//Hide elements
	$("#getcommandblock").hide();
	$("#saveandload").hide();
	$("#troubleshooting").hide();
	$("#inputarms").hide();
	$("#customequipment").hide();
	$("#disabledslots").hide();
	$("#namecustomization").hide();
	
	//Show elements
	$("#namecustomization").show();
	$("#centercorrected").show();

    //Initialize colorpickers
    $('.colorfield').colpick({
        colorScheme:'light',
        layout:'hex',
        color:'ff8800',
        onSubmit:function(hsb,hex,rgb,el) {
            $(el).css('background-color', '#'+hex);
            $(el).colpickHide();
            handleInput();
        }
	});
	
	helmetList = $("#list-helmet").find("option");
	chestplateList = $("#list-chestplate").find("option");
	leggingsList = $("#list-leggings").find("option");
	bootsList = $("#list-shoes").find("option");

});

function loadScreen() {
	$(`#creationname`).attr(`placeholder`, `My Armor Stand #${localStorage.length + 1}`);
	if (!localStorage.length) {
		$(`#loadlistopts`).hide();
		$(`#loadmessage`).text(`You do not have any creations to load!`);
	} else {
		$(`#loadlistopts`).show();
		$(`#loadmessage`).text(`Load your saved creations`);
		$(`#loadlist`).empty();
		for (let i = 0; i < localStorage.length; i++) {
			$(`#loadlist`).append(`<option value="${localStorage.key(i)}">${localStorage.key(i)}</option>`);
		};
	};
};

function setup(){
	width = $("#gl").width();
	height = $("#gl").height();

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
	renderer.setSize(width, height);
	$("#gl").append(renderer.domElement);


	scene = new THREE.Scene();
	armorstand = new THREE.Object3D();
	//Add an armorstandWrapper to the scene, so the armorstand can be rotated naturally.
	armorstandWrapper = new THREE.Object3D();
	armorstand.position.set(0,-0.5,0);
	armorstandWrapper.add(armorstand);


	//BasePlate
	mBasePlate = new THREE.Mesh(
		new THREE.BoxGeometry(12/16, 1/16, 12/16),
		matStone);
	mBasePlate.position.y = - (1/32 - armorstand.position.y);
	armorstandWrapper.add(mBasePlate);
	//Add a little dot, so the user knows which way is forward
	var mmBaseDot = new THREE.Mesh(
		new THREE.BoxGeometry(2/16, 1/16, 4/16),
		matStone);
	mmBaseDot.position.set(0,mBasePlate.position.y,10/16);
	armorstandWrapper.add(mmBaseDot);

	// To Generate the other body parts, we will use a mesh to display,
	// and add it as a child to the object that serves as a pivot.

	//Left Leg
	var mmLegLeft = new THREE.Mesh(
		new THREE.BoxGeometry(2/16, 11/16, 2/16),
		matWood);
	mmLegLeft.position.set(0,-5.5/16,0);
	mLegLeft = new THREE.Object3D();
	mLegLeft.position.set(2/16,11/16,0); //Pivot Point
	mLegLeft.add(mmLegLeft);
	armorstand.add(mLegLeft);

	//Right Leg
	var mmLegRight = new THREE.Mesh(
		new THREE.BoxGeometry(2/16, 11/16, 2/16),
		matWood);
	mmLegRight.position.set(0,-5.5/16,0);
	mLegRight = new THREE.Object3D();
	mLegRight.position.set(-2/16,11/16,0); //Pivot Point
	mLegRight.add(mmLegRight);
	armorstand.add(mLegRight);

	//Left Arm
	var mmArmLeft = new THREE.Mesh(
		new THREE.BoxGeometry(2/16, 12/16, 2/16),
		matWood);
	mmArmLeft.position.set(0,-4/16,0);
	mArmLeft = new THREE.Object3D();
	mArmLeft.position.set(6/16,21/16,0); //Pivot Point
	mArmLeft.add(mmArmLeft);
	armorstand.add(mArmLeft);

	//Right Arm
	var mmArmRight = new THREE.Mesh(
		new THREE.BoxGeometry(2/16, 12/16, 2/16),
		matWood);
	mmArmRight.position.set(0,-4/16,0);
	mArmRight = new THREE.Object3D();
	mArmRight.position.set(-6/16,21/16,0); //Pivot Point
	mArmRight.add(mmArmRight);
	armorstand.add(mArmRight);

	//Body (consists of four parts)
	var mmHip = new THREE.Mesh(
		new THREE.BoxGeometry(8/16, 2/16, 2/16),
		matWood);
	mmHip.position.set(0,-11/16,0);
	var mmBodyLeft = new THREE.Mesh(
		new THREE.BoxGeometry(2/16, 7/16, 2/16),
		matWood);
	mmBodyLeft.position.set(2/16,-6.5/16,0);
	var mmBodyRight = new THREE.Mesh(
		new THREE.BoxGeometry(2/16, 7/16, 2/16),
		matWood);
	mmBodyRight.position.set(-2/16,-6.5/16,0);
	var mmShoulders = new THREE.Mesh(
		new THREE.BoxGeometry(12/16, 3/16, 3/16),
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
		new THREE.BoxGeometry(2/16, 7/16, 2/16),
		matWood);
	mmNeck.position.set(0,3.5/16,0);
	mSkull = new THREE.Mesh(
		new THREE.BoxGeometry(10/16, 10/16, 10/16),
		matTransparentStone);
	mSkull.position.set(0,5/16,0);
	mHead = new THREE.Object3D();
	mHead.position.set(0,22/16,0); //Pivot Point
	mHead.add(mmNeck);
	mHead.add(mSkull);
	armorstand.add(mHead);


	scene.add(armorstandWrapper);

	camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
	camera.position.y = 2;
	camera.position.z = 4;
	camera.lookAt(viewCenter);
	scene.add(camera);

	var pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(0, 300, 200);

	scene.add(pointLight);

	// Resize view
	window.addEventListener("resize", () => {
		width = $("#gl").width();
		height = $("#gl").height();
		
		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize(width, height);
	});
}

const MC_VERSION = Object.freeze({
	v1_8: 0,
	v1_9: 1,
	v1_11: 2,
	v1_13: 3,
	v1_14: 4,
	v1_16: 5,
	v1_20_5: 6,
	v1_21: 7
});

function getMcVersion() {
	let tag = document.getElementById("mcversion");
	return tag.options.length - tag.selectedIndex - 1;
}

// Write stuff from input into variables
function handleInput(){

	mcVersion = getMcVersion();

	invisible = getCheckBoxInput("invisible");
	invulnerable = getCheckBoxInput("invulnerable");
    persistencerequired = getCheckBoxInput("persistencerequired");
	noBasePlate = getCheckBoxInput("nobaseplate");
	noGravity = getCheckBoxInput("nogravity");
	showArms = getCheckBoxInput("showarms");
	small = getCheckBoxInput("small");
	marker = getCheckBoxInput("marker");
	centercorrected = getCheckBoxInput("center-corrected");

	useEquipment = getCheckBoxInput("useequipment");
	equipHandRight = getInput("equipHandRight");
	equipHandLeft = getInput("equipHandLeft");
	equipShoes = getInput("equipShoes");
	equipLeggings = getInput("equipLeggings");
	equipChestplate = getInput("equipChestplate");
	equipHelmet = getInput("equipHelmet");
	equipCustomHeadMode = $("#equipCustomHeadMode").val();

    equipColorShoes = $("#boots_color").css("background-color");
    equipColorLeggings = $("#leggings_color").css("background-color");
    equipColorChestplate = $("#chestplate_color").css("background-color");
    equipColorHelmet = $("#helmet_color").css("background-color");

	customName = getInput("customname");
	showCustomName = getCheckBoxInput("showcustomname");
	nameColor = getInput("namecolor");
	nameBold = getCheckBoxInput("namebold");
	nameItalic = getCheckBoxInput("nameitalic");
	nameObfuscated = getCheckBoxInput("nameobfuscated");
	nameStrikethrough = getCheckBoxInput("namestrikethrough");

	scoreboardTags = getInput("scoreboardtags");

	useDisabledSlots = getCheckBoxInput("usedisabledslots");
	give = getCheckBoxInput("slashgive");

	body.set(getRangeInput("bodyX"), getRangeInput("bodyY"), getRangeInput("bodyZ"));
	head.set(getRangeInput("headX"), getRangeInput("headY"), getRangeInput("headZ"));
	leftLeg.set(getRangeInput("leftLegX"), getRangeInput("leftLegY"), getRangeInput("leftLegZ"));
	rightLeg.set(getRangeInput("rightLegX"), getRangeInput("rightLegY"), getRangeInput("rightLegZ"));
	leftArm.set(getRangeInput("leftArmX"), getRangeInput("leftArmY"), getRangeInput("leftArmZ"));
	rightArm.set(getRangeInput("rightArmX"), getRangeInput("rightArmY"), getRangeInput("rightArmZ"));

	rotation = getRangeInput("rotation");

	updateUI();
};

function getCheckBoxInput(name) {
	return $("input[name="+name+"]").prop("checked");
};

function getRangeInput(name) {
	return $("input[name="+name+"]").val();
};

function getInput(name) {
	return $("input[name="+name+"]").val();
};

/** Changes stuff according to our input values */
function updateUI(){

	//Hide/Show different inputs

	if(showArms)
		$("#inputarms").slideDown();
	else
		$("#inputarms").slideUp();

	if(useEquipment){
		$("#customequipment").slideDown();

		// Hide left hand item input for minecraft 1.8
		if(mcVersion < MC_VERSION.v1_9) {
			$("#equipHandLeft").hide();
		} else {
			$("#equipHandLeft").show();
		}

		let chestplate = chestplateList;
		let helmet = helmetList;
		let boots = bootsList;
		let leggings = leggingsList;

		// Hide elytra for versions <1.9
		if (mcVersion < MC_VERSION.v1_9) {
			chestplate = chestplate.filter("[value!=elytra]");
		}

		// Hide turtle_helmet for versions <1.13
		if (mcVersion < MC_VERSION.v1_13) {
			helmet = helmet.filter("[value!=turtle_helmet]");
		}
		
		// Hide netherite armor for versions < 1.16
		if (mcVersion < MC_VERSION.v1_16) {
			helmet = helmet.filter("[value!=netherite_helmet]");
			chestplate = chestplate.filter("[value!=netherite_chestplate]");
			leggings = leggings.filter("[value!=netherite_leggings]");
			boots = boots.filter("[value!=netherite_boots]");
		} 
			
		$("#list-helmet").empty().append(helmet);
		$("#list-chestplate").empty().append(chestplate);
		$("#list-leggings").empty().append(leggings);
		$("#list-shoes").empty().append(boots);
		
	}
	else
		$("#customequipment").slideUp();

    //Different colorinputs for armorparts
    if(isLeatherArmor(equipShoes))
        $("#boots_color").slideDown();
    else
        $("#boots_color").slideUp();
    if(isLeatherArmor(equipLeggings))
        $("#leggings_color").slideDown();
    else
        $("#leggings_color").slideUp();
    if(isLeatherArmor(equipChestplate))
        $("#chestplate_color").slideDown();
    else
        $("#chestplate_color").slideUp();
    if(isLeatherArmor(equipHelmet))
        $("#helmet_color").slideDown();
    else
        $("#helmet_color").slideUp();

	// Link to minecraft-heads.com
	if(equipCustomHeadMode == "givecode"){
		$("#minecraft-heads").slideDown();
	}
	else{
		$("#minecraft-heads").slideUp();
	}

	// Show disabled slots
	if(useDisabledSlots) {
		// Hide offhand disabled slot buttons for versions below 1.13
		if (mcVersion > MC_VERSION.v1_13) {
			$(".sprite.offhand").show();
			$("#dO").show();
			$("#rO").show();
			$("#pO").show();
		} else {
			$(".sprite.offhand").hide();
			$("#dO").hide();
			$("#rO").hide();
			$("#pO").hide();
		}

		$("#disabledslots").slideDown();
	} else {
		$("#disabledslots").slideUp();
	}

	//Hide 1.13 features for 1.12 and lower.
	if (mcVersion < MC_VERSION.v1_13) {
		$("#namecustomization").hide();
		$("#centercorrected").hide();
	} else {
		$("#namecustomization").show();
		$("#centercorrected").show();
	}
	
	// Generate code
	const generatedCode = generateCode();
	$("#code").text(generatedCode);

	// Show hint, when command is too long
	const characterLimit = (mcVersion <= MC_VERSION.v1_9) ? 100 : 256;
	if (generatedCode.length > characterLimit)
		$("#codeinfo").slideDown();
	else
		$("#codeinfo").slideUp();


	// Rotate 3D Stuff
	// y and z rotation needs to be inverted
	setRotation(mBody, body);
	setRotation(mHead, head);
	setRotation(mLegLeft, leftLeg);
	setRotation(mLegRight, rightLeg);
	setRotation(mArmLeft, leftArm);
	setRotation(mArmRight, rightArm);
	armorstand.rotation.y = -rotation * DEG2RAD;

    // Scale model, depending on small variable
    if(small)
        armorstand.scale.set(0.6, 0.6, 0.6);
    else
        armorstand.scale.set(1, 1, 1);

	//Set Visibility
	mArmRight.visible = mArmLeft.visible = showArms;
	mBasePlate.visible = !noBasePlate;
	mSkull.visible = equipHelmet != "";
}

function generateCode() {
	const tags = {
		Invisible: invisible || null,
		Invulnerable: invulnerable || null,
		PersistenceRequired: persistencerequired || null,
		NoBasePlate: noBasePlate || null,
		NoGravity: noGravity || null,
		ShowArms: showArms || null,
		Small: small || null,
		Marker: marker || null,

		Rotation: (rotation != 0) ? [ new NBTFloat(rotation) ] : null,

		CustomNameVisible: showCustomName || null,
		CustomName: (customName) ? generateCustomName() : null,

		DisabledSlots: (useDisabledSlots) ? calculateDisabledSlotsFlag() : null,
		Pose: generatePose(),
	};

	// Equipment
	if (useEquipment) {
		if (mcVersion == MC_VERSION.v1_8) {
			// Old 1.8 Equipment format
			// Equipment: [ RightHand, Boots, Leggings, Chestplate, Helmet ]
			const armorItems = generateArmorItems();
			const handItems = generateHandItems();
			tags.Equipment = armorItems.splice(0, 0, handItems[0]);

		} else {
			// New 1.9+ Equipment format
			if (equipShoes != "" || equipLeggings != "" || equipChestplate != "" || equipHelmet != "") {
				tags.ArmorItems = generateArmorItems();
			}

			if (equipHandRight != "" || equipHandLeft != "") {
				tags.HandItems = generateHandItems();
			}
		}
	}

	// Scoreboard tags
	if (scoreboardTags) {
		const tagsList = scoreboardTags.split(',');
		if (!tagsList[tagsList.length - 1].trim()) {
			tagsList.pop();
		}
		
		tags.Tags = tagsList.map(value => value.trim());
	}

	// Generate the final command
	if (give && mcVersion > MC_VERSION.v1_16) {
		tags.id = "minecraft:armor_stand";
	}

	const parsedTags = NBT.stringify(tags);

	if (give) {
		let command = "/give @p ";
		if (mcVersion <= MC_VERSION.v1_11) {
			return command + "minecraft:armor_stand 1 0 {EntityTag:" + parsedTags + "}";

		} else if (mcVersion <= MC_VERSION.v1_16) {
			return command + "minecraft:armor_stand{EntityTag:" + parsedTags + "} 1"

		} else {
			let code = "minecraft:armor_stand[minecraft:entity_data=" + parsedTags;
			if (customName && mcVersion >= MC_VERSION.v1_21) {
				code += `,minecraft:custom_name=${generateCustomName()}`
			}
			return command + code + "] 1";
		}
	} else {
		if (mcVersion <= MC_VERSION.v1_9) {
			// Old entity name
			return "/summon ArmorStand ~ ~ ~ " + parsedTags;

		} else if (mcVersion < MC_VERSION.v1_13) {
			return "/summon minecraft:armor_stand ~ ~ ~ " + parsedTags;

		} else {
			// In 1.13, positions are no longer center-corrected. 
			// Adding .5 makes it centered. However for players it is already center-corrected
			let position = centercorrected ? "~ ~-0.5 ~" : "~ ~ ~";
			return "/summon minecraft:armor_stand " + position + " " + parsedTags;
		}
	}
}

function generateCustomName() {
	if (mcVersion <= MC_VERSION.v1_11) {
		// Versions less than 1.12 did not support styles
		return customName;
	}

	let props = {};

	if (customName) {
		props.text = customName;
	}

	if (nameColor) {
		props.color = nameColor;
	}

	if (nameBold) {
		props.bold = nameBold;
	}

	if (nameItalic) {
		props.italic = nameItalic;
	}

	if (nameStrikethrough) {
		props.strikethrough = nameStrikethrough;
	}

	if (nameObfuscated) {
		props.obfuscated = nameObfuscated;
	}

	let stringified = JSON.stringify(props);
	if (mcVersion < MC_VERSION.v1_14) {
		// Stringify again to escape double quotes, as versions below 1.14
		// did not have the ability to use single quotes as strings
		return new NBTRaw(JSON.stringify(stringified));
	}

	return new NBTRaw("'" + stringified + "'");
}

function generateArmorItems() {
	function generateArmorItem(armorID) {
		if (armorID === "") {
			return {};
		}
	
		let data = {
			id: armorID,
			Count: 1,
		}
	
		// If the armor is leather, then apply its color
		if (isLeatherArmor(armorID)) {
			const element = $(`#${armorID.substring(8) + "_color"}`);
			const color = getDecimalRGB(element.css("background-color"));
	
			if (mcVersion >= MC_VERSION.v1_20_5) {
				data.components = {
					dyed_color: { rgb: color }
				};
			} else {
				data.tag = {
					display: {
						color: color
					}
				};
			}
		}
	
		return data;
	}

	// Equipments (aka ArmorItems) are order-sensitive 
	// and must follow the order: feet, legs, chest, head
	let items = [
		generateArmorItem(equipShoes),
		generateArmorItem(equipLeggings),
		generateArmorItem(equipChestplate),
	];

	// Handle different items in the head slot
	if (equipHelmet == "") {
		items.push({});
		return items;
	}

	switch (equipCustomHeadMode) {
		case "item":
			items.push(generateArmorItem(equipHelmet));
			break;

		// Head is a player head with the given name
		case "player": {
			let data = {
				id: (mcVersion <= MC_VERSION.v1_11) ? "skull" : "player_head",
				Count: 1,
			};

			if (mcVersion <= MC_VERSION.v1_11) {
				data.Damage = 3;
			}
			
			if (mcVersion <= MC_VERSION.v1_16) {
				data.tag = { SkullOwner: equipHelmet };
			} else {
				data.components = {
					profile: { name: equipHelmet }
				};
			}

			items.push(data);
			break;
		}

		case "url": {
			// Best reference: http://redd.it/24quwx
			const base64Value = btoa(JSON.stringify({
				textures: {
					SKIN: { url: equipHelmet }
				}
			}));

			const innerNBT = {
				Id: (mcVersion >= MC_VERSION.v1_16) ? generateIntArray() : generateUUID(),
				Properties: {
					textures: [{ Value: base64Value }]
				}
			};

			const data = {
				id: "minecraft:player_head",
				Count: 1
			};

			if (mcVersion >= MC_VERSION.v1_20_5) {
				data.components = {
					profile: innerNBT
				};

			} else {
				data.tag = {
					SkullOwner: innerNBT
				};

				if (mcVersion < MC_VERSION.v1_13) {
					data.id = "skull";
					data.Damage = 3;
				}
			}

			items.push(data);
			break;
		}

		case "givecode": {
			// For now, assume the give code is from minecraft-heads
			// TODO Parser to read any valid give codes
			const data = {
				id: "minecraft:player_head",
				Count: 1
			};

			if (mcVersion < MC_VERSION.v1_13) {
				data.id = "skull";
				data.Damage = 3;
				data.tag = new NBTRaw(equipHelmet.trim().slice(29));

			} else if (mcVersion < MC_VERSION.v1_20_5) {
				data.tag = new NBTRaw(equipHelmet.trim().slice(30, -2));
			
			} else {
				// Extracting the entity data for versions greater than 1.20.5 requires more work.
				// Format of the give code that is generated from minecraft-heads:
				// /give @p minecraft:player_head[minecraft:custom_name='...', minecraft:lore=[...], profile={...}] 1

				const nameIndex = equipHelmet.indexOf("minecraft:custom_name=");
				const loreIndex = equipHelmet.indexOf("minecraft:lore=");
				const profileIndex = equipHelmet.indexOf("profile=");

				const customName = equipHelmet.slice(nameIndex + 22, loreIndex - 1);
				const lore = equipHelmet.slice(loreIndex + 15, profileIndex - 1);
				const profile = equipHelmet.slice(profileIndex + 8, -3);

				data.components = {
					custom_name: new NBTRaw(customName),
					lore: new NBTRaw(lore),
					profile: new NBTRaw(profile),
				};
			}

			items.push(data);
			break;
		}
	}

	return items;
}

function generateHandItems() {
	function generateHandItem(item) {
		if (item == "") {
			return {};
		}

		return {
			id: item,
			Count: 1
		};
	}

	// HandItems must follow the order: Main hand (right hand), Off hand (left hand)
	return [
		generateHandItem(equipHandRight),
		generateHandItem(equipHandLeft),
	];
}

function generatePose() {
	const pose = {};

	if (!isZero(body)) {
		pose.Body = toNBTFloatArray(body);
	}

	if (!isZero(head)) {
		pose.Head = toNBTFloatArray(head);
	}

	if (!isZero(leftLeg)) {
		pose.LeftLeg = toNBTFloatArray(leftLeg);
	}

	if (!isZero(rightLeg)) {
		pose.RightLeft = toNBTFloatArray(rightLeg);
	}
	
	if (showArms) {
		if (!isZero(leftArm)) {
			pose.LeftArm = toNBTFloatArray(leftArm);
		}
		
		if (!isZero(rightArm)) {
			pose.RightArm = toNBTFloatArray(rightArm);
		}
	}

	return (Object.keys(pose).length > 0) ? pose : null;
}

function calculateDisabledSlotsFlag() {
    var dO = $("#dO").is(":checked") ? 1 << (5) : 0;
    var dH = $("#dH").is(":checked") ? 1 << (4) : 0;
    var dC = $("#dC").is(":checked") ? 1 << (3) : 0;
    var dL = $("#dL").is(":checked") ? 1 << (2) : 0;
    var dB = $("#dB").is(":checked") ? 1 << (1) : 0;
    var dW = $("#dW").is(":checked") ? 1 << (0) : 0;
    var dR = dO + dH + dC + dL + dB + dW;

    var rO = $("#rO").is(":checked") ? 1 << (5 + 8) : 0;
    var rH = $("#rH").is(":checked") ? 1 << (4 + 8) : 0;
    var rC = $("#rC").is(":checked") ? 1 << (3 + 8) : 0;
    var rL = $("#rL").is(":checked") ? 1 << (2 + 8) : 0;
    var rB = $("#rB").is(":checked") ? 1 << (1 + 8) : 0;
    var rW = $("#rW").is(":checked") ? 1 << (0 + 8) : 0;
    var rR = rO + rH + rC + rL + rB + rW;

    var pO = $("#pO").is(":checked") ? 1 << (5 + 16) : 0;
    var pH = $("#pH").is(":checked") ? 1 << (4 + 16) : 0;
    var pC = $("#pC").is(":checked") ? 1 << (3 + 16) : 0;
    var pL = $("#pL").is(":checked") ? 1 << (2 + 16) : 0;
    var pB = $("#pB").is(":checked") ? 1 << (1 + 16) : 0;
    var pW = $("#pW").is(":checked") ? 1 << (0 + 16) : 0;
    var pR = pO + pH + pC + pL + pB + pW;

    var result = dR + rR + pR;
    return result;
}

function isZero(vector) {
	return vector.x == 0 && vector.y == 0 && vector.z == 0;
}

function toNBTFloatArray(vector) {
	return [ new NBTFloat(vector.x), new NBTFloat(vector.y), new NBTFloat(vector.z) ];
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

	armorstandWrapper.rotation.y = rotY + getMouseDeltaX();
	armorstandWrapper.rotation.x = rotX + getMouseDeltaY();

	requestAnimationFrame(render);
}

// ---- Additional functions

function generateUUID() {
	// From here: http://stackoverflow.com/a/8809472/1456971
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });

    return uuid;
}

function generateIntArray() {
	const buffer = new Uint32Array(4);
	const UUID = new DataView(buffer.buffer);
	const paddings = [8, 4, 4, 4, 12];
	
	let hexUUID = generateUUID().split("-").map((val, i) => val.padStart(paddings[i], "0")).join("");
	let ints = [];

	for (let i = 0; i < 4; i++) { 
		num = Number("0x" + hexUUID.substring(i*8, (i+1)*8));
		UUID.setInt32(i*4, num);
		ints.push(UUID.getInt32(i*4));
	}

	return new NBTArrayInt(ints);
}

function getDecimalRGB(rgb){
    //The string has the format 'rgb(r, g, b)'

    //Remove whitespaces. Now formatted: 'rgb(r,g,b)'
    rgb = rgb.replace(/ /g,"");

    var r = rgb.substring(4,rgb.indexOf(","));
    var g = rgb.substring(rgb.indexOf(",")+1,rgb.lastIndexOf(","));
    var b = rgb.substring(rgb.lastIndexOf(",")+1, rgb.length-1);


    return (r << 16) | (g << 8) | b;
}

function isLeatherArmor(item) {
    return item ? item.startsWith("leather_") : false;
}

// Rotate three.js mesh to fit the minecraft rotation
function setRotation(mesh, rotation){
	rotateAroundWorldAxis(mesh, new THREE.Vector3(1,0,0), rotation.x * DEG2RAD, true);
	rotateAroundWorldAxis(mesh, new THREE.Vector3(0,1,0), -rotation.y * DEG2RAD, false);
	rotateAroundWorldAxis(mesh, new THREE.Vector3(0,0,1), -rotation.z * DEG2RAD, false);
}

// From here: http://stackoverflow.com/a/11124197/1456971
var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space
function rotateAroundWorldAxis(object, axis, radians, reset) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
		if(!reset)
    	rotWorldMatrix.multiply(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
}

function saveData() {
	// Handles saving of armor stand data
	const SAVE_DATA = {
		name: $(`#creationname`).val() === `` ? `My Armor Stand #${localStorage.length + 1}` : $(`#creationname`).val(),
		version: $(`#mcversion`).val(),
		
		options: {
			invisible: getCheckBoxInput("invisible"),
			invulnerable: getCheckBoxInput("invulnerable"),
			presistence_required: getCheckBoxInput("persistencerequired"),
			no_base_plate: getCheckBoxInput("nobaseplate"),
			no_gravity: getCheckBoxInput("nogravity"),
			show_arms: getCheckBoxInput("showarms"),
			small: getCheckBoxInput("small"),
			marker: getCheckBoxInput("marker"),
			center_corrected: getCheckBoxInput("center-corrected")
		},
	
		rotation: {
			main: getRangeInput("rotation"),
			head: [getRangeInput("headX"), getRangeInput("headY"), getRangeInput("headZ")],
			body: [getRangeInput("bodyX"), getRangeInput("bodyY"), getRangeInput("bodyZ")],
			legs: {
				left: [getRangeInput("leftLegX"), getRangeInput("leftLegY"), getRangeInput("leftLegZ")],
				right: [getRangeInput("rightLegX"), getRangeInput("rightLegY"), getRangeInput("rightLegZ")],
			},
			arms: {
				left: [getRangeInput("leftArmX"), getRangeInput("leftArmY"), getRangeInput("leftArmZ")],
				right: [getRangeInput("rightArmX"), getRangeInput("rightArmY"), getRangeInput("rightArmZ")]
			}
		},
	
		equipment: {
			enabled: getCheckBoxInput("useequipment"),
			hands: {				
				right: getInput("equipHandRight"),
				left: getInput("equipHandLeft")
			},
			boots: getInput("equipShoes"),
			leggings: getInput("equipLeggings"),
			chestplate: getInput("equipChestplate"),
			helmet: getInput("equipHelmet"),
			helmet_specifies: $("#equipCustomHeadMode").val(),

			leather_colours: {
				helmet: $(`#helmet_color`).css(`background-color`),
				chestplate: $(`#chestplate_color`).css(`background-color`),
				leggings: $(`#leggings_color`).css(`background-color`),
				boots: $(`#boots_color`).css(`background-color`)
			}
		},
	
		custom_name: {
			name: $(`#customname`).val(),
			show_custom_name: getCheckBoxInput("showcustomname"),
			name_color: getInput("namecolor"),
			options: {
				bold: getCheckBoxInput("namebold"),
				italic: getCheckBoxInput("nameitalic"),
				obfuscated: getCheckBoxInput("nameobfuscated"),
				strikethrough: getCheckBoxInput("namestrikethrough")
			}
		},

		scoreboard_tags: getInput("scoreboardtags"),
	
		lock_slot_interaction: {
			enabled: $("input[name=usedisabledslots]").is(":checked"),
			remove: {
				helmet: $("#dH").is(":checked"),
				chestplate: $("#dC").is(":checked"),
				leggings: $("#dL").is(":checked"),
				boots: $("#dB").is(":checked"),
				weapons: $("#dW").is(":checked"),
				offhand: $("#dO").is(":checked")
			},
			replace: {
				helmet: $("#rH").is(":checked"),
				chestplate: $("#rC").is(":checked"),
				leggings: $("#rL").is(":checked"),
				boots: $("#rB").is(":checked"),
				weapons: $("#rW").is(":checked"),
				offhand: $("#rO").is(":checked")
			},
			place: {
				helmet: $("#pH").is(":checked"),
				chestplate: $("#pC").is(":checked"),
				leggings: $("#pL").is(":checked"),
				boots: $("#pB").is(":checked"),
				weapons: $("#pW").is(":checked"),
				offhand: $("#pO").is(":checked")
			}
		}
	};

	localStorage.setItem(SAVE_DATA.name, JSON.stringify(SAVE_DATA));
	loadScreen();
	$(`#creationname`).val(``);
	alert(`Awesome! Your creation has been saved as ${SAVE_DATA.name}.`);
};

function loadData(data) {
	//console.log(`loading data!`);
	data = localStorage.getItem(data);
	if (!data) return alert(`An error occurred while loading the creation.`);
	
	try {
		data = JSON.parse(data);

		// version
		$(`#mcversion`).val(data.version);

		// options
		$("input[name=invisible]").prop(`checked`, data.options.invisible);
		$("input[name=invulnerable]").prop(`checked`, data.options.invulnerable);
		$("input[name=persistencerequired]").prop(`checked`, data.options.presistence_required);
		$("input[name=nobaseplate]").prop(`checked`, data.options.no_base_plate);
		$("input[name=nogravity]").prop(`checked`, data.options.no_gravity);
		$("input[name=showarms]").prop(`checked`, data.options.show_arms);
		$("input[name=small]").prop(`checked`, data.options.small);
		$("input[name=marker]").prop(`checked`, data.options.marker);
		$("input[name=center-corrected]").prop(`checked`, data.options.center_corrected);
		
		// rotation
		$("input[name=rotation]").val(data.rotation.main);
		$("input[name=headX]").val(data.rotation.head[0]);
		$("input[name=headY]").val(data.rotation.head[1]);
		$("input[name=headZ]").val(data.rotation.head[2]);
		
		$("input[name=bodyX]").val(data.rotation.body[0]);
		$("input[name=bodyY]").val(data.rotation.body[1]);
		$("input[name=bodyZ]").val(data.rotation.body[2]);
		
		$("input[name=leftLegX]").val(data.rotation.legs.left[0]);
		$("input[name=leftLegY]").val(data.rotation.legs.left[1]);
		$("input[name=leftLegZ]").val(data.rotation.legs.left[2]);
		
		$("input[name=rightLegX]").val(data.rotation.legs.right[0]);
		$("input[name=rightLegY]").val(data.rotation.legs.right[1]);
		$("input[name=rightLegZ]").val(data.rotation.legs.right[2]);
		
		$("input[name=leftArmX]").val(data.rotation.arms.left[0]);
		$("input[name=leftArmY]").val(data.rotation.arms.left[1]);
		$("input[name=leftArmZ]").val(data.rotation.arms.left[2]);
		
		$("input[name=rightArmX]").val(data.rotation.arms.right[0]);
		$("input[name=rightArmY]").val(data.rotation.arms.right[1]);
		$("input[name=rightArmZ]").val(data.rotation.arms.right[2]);
		
		//equipment
		$("input[name=useequipment]").prop(`checked`, data.equipment.enabled);
		$(`input[name=equipShoes]`).val(data.equipment.boots);
		$(`input[name=equipLeggings]`).val(data.equipment.leggings);
		$(`input[name=equipChestplate]`).val(data.equipment.chestplate);
		$(`input[name=equipHelmet]`).val(data.equipment.helmet);
		$(`input[name=equipHandRight]`).val(data.equipment.hands.right);
		$(`input[name=equipHandLeft]`).val(data.equipment.hands.left);
		$(`#equipCustomHeadMode`).val(data.equipment.helmet_specifies);
		
		$(`#helmet_color`).css(`background-color`, data.equipment.leather_colours.helmet);
		$(`#chestplate_color`).css(`background-color`, data.equipment.leather_colours.chestplate);
		$(`#leggings_color`).css(`background-color`, data.equipment.leather_colours.leggings);
		$(`#boots_color`).css(`background-color`, data.equipment.leather_colours.boots);
		
		//custom name
		$(`#customname`).val(data.custom_name.name);
		$(`input[name=showcustomname]`).prop(`checked`, data.custom_name.show_custom_name);
		$(`input[name=namecolor]`).val(data.custom_name.name_color);
		$("input[name=namebold]").prop(`checked`, data.custom_name.options.bold);
		$("input[name=nameitalic]").prop(`checked`, data.custom_name.options.italic);
		$("input[name=nameobfuscated]").prop(`checked`, data.custom_name.options.obfuscated);
		$("input[name=namestrikethrough]").prop(`checked`, data.custom_name.options.strikethrough);

		$("input[name=scoreboardtags]").val(data.scoreboard_tags);
		
		//lock slot interaction
		$("input[name=usedisabledslots]").prop(`checked`, data.lock_slot_interaction.enabled);
		
		$(`#dO`).prop(`checked`, data.lock_slot_interaction.remove.offhand);
		$(`#dH`).prop(`checked`, data.lock_slot_interaction.remove.helmet);
		$(`#dC`).prop(`checked`, data.lock_slot_interaction.remove.chestplate);
		$(`#dL`).prop(`checked`, data.lock_slot_interaction.remove.leggings);
		$(`#dB`).prop(`checked`, data.lock_slot_interaction.remove.boots);
		$(`#dW`).prop(`checked`, data.lock_slot_interaction.remove.weapons);

		$(`#rO`).prop(`checked`, data.lock_slot_interaction.replace.offhand);
		$(`#rH`).prop(`checked`, data.lock_slot_interaction.replace.helmet);
		$(`#rC`).prop(`checked`, data.lock_slot_interaction.replace.chestplate);
		$(`#rL`).prop(`checked`, data.lock_slot_interaction.replace.leggings);
		$(`#rB`).prop(`checked`, data.lock_slot_interaction.replace.boots);
		$(`#rW`).prop(`checked`, data.lock_slot_interaction.replace.weapons);

		$(`#pO`).prop(`checked`, data.lock_slot_interaction.place.offhand);
		$(`#pH`).prop(`checked`, data.lock_slot_interaction.place.helmet);
		$(`#pC`).prop(`checked`, data.lock_slot_interaction.place.chestplate);
		$(`#pL`).prop(`checked`, data.lock_slot_interaction.place.leggings);
		$(`#pB`).prop(`checked`, data.lock_slot_interaction.place.boots);
		$(`#pW`).prop(`checked`, data.lock_slot_interaction.place.weapons);
		
		handleInput();
	} catch (err) {
		console.error(err);
		alert(`An error occurred while loading the creation.`);
	};
	
	//loadScreen();
};

function deleteSave(data) {
	localStorage.removeItem(data);
	loadScreen();
	alert(`${data} has been deleted!`);
};

// Define NBT classes for properly stringifying JS objects to NBT
class NBTObject {};

class NBTRaw extends NBTObject {
	constructor(raw) {
		super();
		this.raw = raw;
	}

	toString() {
		return this.raw;
	}
}

class NBTFloat extends NBTObject {
	constructor(n) {
		super();
		this.n = n;
	}

	toString() {
		return this.n + "f";
	}
}

class NBTArrayInt extends NBTObject {
	constructor(arr) {
		super();
		this.arr = arr;
	}

	toString() {
		return "[I;" + this.arr.join(",") + "]";
	}
};

class NBT {
	static stringify(object) {
		const type = typeof object;
		switch (type) {
			case "string":
				return '"' + object + '"';

			case "number":
			case "boolean":
				return new String(object);

			case "object": {
				if (Array.isArray(object)) {
					return "[" +
						object
							.filter(value => value != null)
							.map(value => NBT.stringify(value))
							.join(",") 
						+ "]";
				}
				
				if (object instanceof NBTObject) {
					return object.toString();
				}

				// Fallback (javascript object)
				return "{" + 
					Object.entries(object)
						.filter(([key, value]) => value != null)
						.map(([key, value]) => key + ":" + NBT.stringify(value))
						.join(",")
					+ "}";
			}
		}
	}
}