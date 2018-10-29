//  ____    _                            _   _                 
// / ___|  | |__     ___    _ __   ___  | | (_)  _ __     ___  
// \___ \  | '_ \   / _ \  | '__| / _ \ | | | | | '_ \   / _ \ 
//  ___) | | | | | | (_) | | |   |  __/ | | | | | | | | |  __/ 
// |____/  |_| |_|  \___/  |_|    \___| |_| |_| |_| |_|  \___| 
//   __  __                   _                        
//  |  \/  |   __ _   _   _  | |__     ___   _ __ ___  
//  | |\/| |  / _` | | | | | | '_ \   / _ \ | '_ ` _ \ 
//  | |  | | | (_| | | |_| | | | | | |  __/ | | | | | |
//  |_|  |_|  \__._|  \__. | |_| |_|  \___| |_| |_| |_|
//                    |___/                            
// JJ Bastida 
// Computational Media INFO24857
//All my variables up in here
var scene, camera, renderer, group, plane, fish, fishTwo, fishThree, fishDOne, fishDTwo, particleSystem, light, amblight, rearLight, waterMaterial, pMaterial, floorMaterial, seaweed, seaTwo, seaThree, coral, orig, oil, coralMaterial, coralBaby, barVal, yellowThing, seamaterial; //saying all the parts that will go into the scene
var raycaster;
var mouse = new THREE.Vector2()
    , INTERSECTED;
var broken = false;
var particleExist = false;
var underwawa = false;
var clickd = false;
var lightC = true;
var oilIs = false;
var oil = false;
var booble = true;
var fishOver = true;
var jslocation = document.getElementById("jslocation")
var loader = new THREE.ColladaLoader(); //creating the loader to be used later
var loaderer = new THREE.ColladaLoader();
var loadererer = new THREE.ColladaLoader();
var loaderererer = new THREE.ColladaLoader();
var windowHalfX = window.innerWidth / 2; //window width
var windowHalfY = window.innerHeight / 2; //window height
var snoise = new ImprovedNoise(); //noise
var flowWater = true; //making the water stop
var stepCount = 0; //is the variable that makes everything flow
var heightThickness = 5; //max height and depth of the water overall
var moveSpeed = 500; //speed of the waves
var flowControl = 30; //controls how the water flows and if it flows
var noiseScale = 3; //similar to that of the control it's how big the noise is scalled up by to fit
var noiseSeed = Math.random() * 100; //starting at a random position
var subwa = document.getElementById("underwawa");
var text = document.getElementById("title");
var loopEase = function (tween) {
    tween.easing(TWEEN.Easing.Quadratic.InOut).repeat(Infinity).yoyo(true).start();
}
var bar = document.getElementById("slider");
var underBub = document.getElementById("underbubbles");
var underBubLength = underBub.childElementCount;
//
underBub.children[0].style.margin = "0 10px 0 0";
underBub.children[0].style.borderBottomLeftRadius = "80%";
underBub.children[0].style.borderTopLeftRadius = "80%";
underBub.children[underBubLength - 1].style.margin = "0 0 0 10px";
underBub.children[underBubLength - 1].style.borderBottomRightRadius = "80%";
underBub.children[underBubLength - 1].style.borderTopRightRadius = "80%";
BrowserDetection();
prePreLoading();

function prePreLoading() {
    //This is my prepreloader that makes those nice loading dots appear
    //
    setTimeout(function () {
        $("#loadingtext").text('Loading .')
        preLoadingStuff();
    }, 400);
    setTimeout(function () {
        $("#loadingtext").text('Loading . .')
    }, 800);
    setTimeout(function () {
        $("#loadingtext").text('Loading . . .')
    }, 1200);
    setTimeout(function () {
        $("#loadingtext").text('Loading .')
    }, 1600);
    setTimeout(function () {
        $("#loadingtext").text('Loading . .')
    }, 2000);
    setTimeout(function () {
        $("#loading").fadeOut(100);
        init();
    }, 2200);
}

function preLoadingStuff() {
    //Preloads all my models that im importing and creates my particle system
    //
    loader.options.convertUpAxis = true;
    loader.load('models/fish.dae', function (collada) {
        fish = collada.scene;
        fish.scale.x = fish.scale.y = fish.scale.z = 0.25;
        fish.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.recieveShadow = true;
            }
        });
        fish.updateMatrix();
    });
    loaderer.load('models/seaweed.dae', function (collada) {
        seaweed = collada.scene;
        seaweed.scale.x = seaweed.scale.y = seaweed.scale.z = 0.5;
        seaweed.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.recieveShadow = true;
            }
        });
        seaweed.updateMatrix();
    });
    loadererer.load('models/coral.dae', function (collada) {
        coral = collada.scene;
        coral.scale.x = coral.scale.y = coral.scale.z = 55;
        coral.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.recieveShadow = true;
            }
        });
        coral.updateMatrix();
    });
    loaderererer.load('models/oilRig.dae', function (collada) {
        orig = collada.scene;
        orig.scale.x = orig.scale.y = orig.scale.z = 10;
        orig.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.recieveShadow = true;
            }
        });
        orig.updateMatrix();
    });
    // create the particle variables
    var particleCount = 200;
    var particle = new THREE.Geometry();
    pMaterial = new THREE.PointsMaterial({
        color: 0x07243A
        , size: 2.5
        , opacity: .35
        , blending: THREE.AdditiveBlending
        , transparent: true
    });
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {
        // create a particle with random
        // position values, between -100 and 100 & -100 and 20 in the y
        var pX = Math.random() * 200 - 100
            , pY = Math.random() * 100 - 20
            , pZ = Math.random() * 200 - 100;
        var particl = new THREE.Vector3(pX, pY, pZ);
        // add it to the geometry
        particle.vertices.push(particl);
    };
    // create the particle system
    particleSystem = new THREE.Points(particle, pMaterial);
    //
    $(bar).hide();
    $("#underbubbles").hide();
}

function init() {
    //My beautiful little init function that does all the nice things, also i'm not going to explain every
    //little thing here because a lot is really self explanitory...
    if (!Detector.webgl) Detector.addGetWebGLMessage();
    scene = new THREE.Scene();
    //
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 6, 40);
    camera.rotation.x = 10 * Math.PI / 180;
    //
    raycaster = new THREE.Raycaster();
    document.addEventListener("mousemove", onDocumentMouseMove, false)
        //raycaster and event listener - in the init, nope, I've moved it
        //render the scene - start renderer and set it's size
    renderer = new THREE.WebGLRenderer({
        antialias: true
        , alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);
    //
    document.getElementById('jslocation').appendChild(renderer.domElement);
    //
    group = new THREE.Group();
    waterMaterial = new THREE.MeshLambertMaterial({
        color: 0x00AAEE
        , transparent: true
        , opacity: .65
        , side: THREE.DoubleSide
    , });
    for (y = 0; y < 50; y++) {
        for (x = 0; x < 50; x++) {
            var geometry = new THREE.BoxGeometry(3, 3, 10);
            var model = new THREE.Mesh(geometry, waterMaterial);
            model.position.x = x * 3;
            model.position.y = y * 3;
            model.name = "model" + x + y;
            group.add(model);
        }
    }
    scene.add(group);
    group.rotation.x = Math.PI / 2;
    group.position.set(-80, -3, -100)
    heightCalc()
        //
    var Fgeometry = new THREE.PlaneGeometry(800, 800);
    floorMaterial = new THREE.MeshBasicMaterial({
        color: 0x349ab2
        , side: THREE.DoubleSide
    });
    plane = new THREE.Mesh(Fgeometry, floorMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -15;
    scene.add(plane);
    plane.visible = false;
    //
    light = new THREE.SpotLight(0xe8fdff, 1.3, 0, Math.PI, 1);
    light.position.set(20, 50, 50);
    light.target.position.set(0, 0, 0);
    scene.add(light);
    light.castShadow = true;
    light.angle = Math.PI / 4;
    light.penumbra = 1;
    light.distance = 200;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 200;
    //
    rearLight = new THREE.SpotLight(0xCCCCCC, 1.2, 0, Math.PI, 1)
    rearLight.position.set(-20, 150, -100);
    rearLight.target.position.set(-75, 50, 180);
    scene.add(rearLight);
    rearLight.visible = false;
    //
    amblight = new THREE.AmbientLight(0xFFFFFF, .75);
    scene.add(amblight);
    //
    window.addEventListener('resize', onWindowResize, false);
    makeUnderwaterNature();
    render();
}

function onDocumentMouseMove(event) {
    //My mouse move listener that gets the mouse position
    //
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function render() {
    //My cutie patootie render that makes all the nice things render and flow
    //
    TWEEN.update();
    requestAnimationFrame(render);
    //water fix in the render
    if (flowWater) {
        heightCalc();
    }
    //Makes the dead fish "float"
    if (fishOver) {
        var blocOne = scene.children[0].getObjectByName("model219");
        fishDTwo.position.y = -blocOne.position.z + 2;
        var blocTwo = scene.children[0].getObjectByName("model2217");
        fishDOne.position.y = -blocTwo.position.z + 2.2;
    }
    //render in the scene and camera
    renderer.render(scene, camera);
}

function onWindowResize() {
    //This is my window resize fix
    //
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function heightCalc() {
    //This is constantly setting the height of the water to some noise
    //
    stepCount += 0.0001;
    var i;
    var ipos;
    var offset = stepCount * moveSpeed; //speed
    for (var y = 0; y < 50; y++) {
        for (var x = 0; x < 50; x++) {
            ipos = y + offset;
            var index = (x + y * 50);
            //selecing all kids individually to be at certain heights
            group.children[index].position.z = snoise.noise(ipos / flowControl * noiseScale, x / flowControl * noiseScale, noiseSeed) * heightThickness;
        }
    }
}

function particles() {
    //This makes my little water particles
    //
    particleExist = true;
    scene.add(particleSystem);
    particleSystem.position.set(0, -3, 0);
    //begin height and size change
    var particleGrow = new TWEEN.Tween(particleSystem.position).to({
        y: -15
    }, 8000);
    var particleUp = new TWEEN.Tween(particleSystem.material).to({
        size: 2
    }, 8000);
    loopEase(particleGrow);
    loopEase(particleUp);
}

function particleZoom() {
    //This little subtlety adds slight speed the particles have when rising out of the water
    new TWEEN.Tween(particleSystem.position).to({
        x: 0
        , y: 20
        , z: 0
    }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start();
}

function makeUnderwaterNature() {
    //This long block makes and places and animates all the underwater objects
    //
    fishTwo = fish.clone();
    fishThree = fish.clone();
    fishDOne = fish.clone();
    fishDTwo = fish.clone();
    seaTwo = seaweed.clone();
    seaThree = seaweed.clone();
    seaFour = seaweed.clone();
    seaFive = seaweed.clone();
    seamaterial = seaweed.children[0].children[0].children[0].material;
    //
    scene.add(fish);
    scene.add(fishTwo);
    scene.add(fishThree);
    scene.add(fishDOne);
    scene.add(fishDTwo);
    scene.add(seaweed);
    scene.add(seaTwo);
    scene.add(coral);
    scene.add(seaThree);
    scene.add(seaFour);
    scene.add(seaFive);
    //
    fish.position.set(-5, 10, 10);
    fishTwo.position.set(-37, 3, 4);
    fishThree.position.set(-30, 7, 0);
    fishDOne.position.set(-15, 5, -50);
    fishDTwo.position.set(-24, 5, -74);
    fishDOne.rotation.x = 90 * Math.PI / 180;
    fishDTwo.rotation.x = -90 * Math.PI / 180;
    fishDTwo.scale.x = fishDTwo.scale.y = fishDTwo.scale.z = .15;
    fishDOne.scale.x = fishDOne.scale.y = fishDOne.scale.z = .05;
    fish.rotation.x = 0.085 * Math.PI;
    fish.rotation.z = 7 * Math.PI / 6.5;
    fishTwo.rotation.x = 0.085 * Math.PI;
    fishThree.rotation.y = -0.05 * Math.PI
    seaweed.position.set(-18, -13, -2);
    seaweed.rotation.x = 3 * Math.PI / 180;
    seaweed.rotation.y = 5 * Math.PI / 180;
    coral.position.set(-18, -13, -55);
    coral.rotation.y = 15 * Math.PI / 180;
    seaTwo.scale.x = seaTwo.scale.y = seaTwo.scale.z = 0.42;
    seaTwo.position.set(-27, -15, -4);
    seaTwo.rotation.x = 3 * Math.PI / 180;
    seaTwo.rotation.y = 220 * Math.PI / 180;
    seaThree.position.set(-70, -13, -70);
    seaFour.position.set(-95, -13, -55);
    seaFive.position.set(-80, -13, -33);
    seaThree.scale.x = seaThree.scale.y = seaThree.scale.z = 0.6;
    seaFour.scale.x = seaFour.scale.y = seaFour.scale.z = .75;
    //
    fish.visible = false;
    fishTwo.visible = false;
    fishThree.visible = false;
    seaweed.visible = false;
    seaTwo.visible = false;
    coral.visible = false;
    fishDOne.visible = false;
    coral.visible = false;
    fishDTwo.visible = false;
    seaThree.visible = false;
    seaFour.visible = false;
    seaFive.visible = false;
    //
    var tail = fish.children[1];
    var tailTwo = fishTwo.children[1];
    var tailThree = fishThree.children[1];
    //makes the fish and tail move
    tail.position.set(0, 0, -1)
    var fishPositionTween = new TWEEN.Tween(fish.position).to({
        x: fish.position.x + 3
        , y: fish.position.y - 1
        , z: fish.position.z - 2
    }, 2500);
    var fishTwoPositionTween = new TWEEN.Tween(fishTwo.position).to({
        x: fishTwo.position.x + 3
        , y: fishTwo.position.y - 1
        , z: fishTwo.position.z - 2
    }, 3000);
    var fishThreePositionTween = new TWEEN.Tween(fishThree.position).to({
        x: fishThree.position.x + 3
        , y: fishThree.position.y - 1
        , z: fishThree.position.z - 2
    }, 2700);
    var fishRotateTween = new TWEEN.Tween(fish.rotation).to({
        y: 0.085 * Math.PI
    }, 2500);
    var fishTwoRotateTween = new TWEEN.Tween(fishTwo.rotation).to({
        y: -0.1 * Math.PI
    }, 3000);
    var fishThreeRotateTween = new TWEEN.Tween(fishThree.rotation).to({
        y: 0.05 * Math.PI
    }, 2700);
    var tailPositionTween = new TWEEN.Tween(tail.position).to({
        z: 2.5
    }, 1500);
    var tailTwoPositionTween = new TWEEN.Tween(tailTwo.position).to({
        z: 2.5
    }, 1300);
    var tailThreePositionTween = new TWEEN.Tween(tailThree.position).to({
        z: 2.5
    }, 1200);
    loopEase(fishPositionTween);
    loopEase(fishRotateTween);
    loopEase(tailPositionTween);
    loopEase(fishTwoPositionTween);
    loopEase(fishTwoRotateTween);
    loopEase(tailTwoPositionTween);
    loopEase(fishThreePositionTween);
    loopEase(fishThreeRotateTween);
    loopEase(tailThreePositionTween);
}

function deadCoral() {
    var coralC = coral.children[0].children[0]
    new TWEEN.Tween(coralC.material.color).to({
        r: 229 / 255
        , g: 209 / 255
        , b: 228 / 255
    }, 1000).easing(TWEEN.Easing.Quadratic.InOut).start()
    lightC = false
}

function lightCoral() {
    var coralC = coral.children[0].children[0]
    new TWEEN.Tween(coralC.material.color).to({
        r: 193 / 255
        , g: 95 / 255
        , b: 172 / 255
    }, 1000).easing(TWEEN.Easing.Quadratic.InOut).start()
    lightC = true
}

function oilBoy() {
    setTimeout(function () {
        scene.add(orig);
        yellowThing = orig.getObjectByName("Cube.46").children[0];
        orig.rotation.y = 150 * Math.PI / 180;
        orig.position.set(-25, 0, -55);;
    }, 800);
    oilIs = true;
    orig.name = "rig"
    var oilBabOne = new THREE.BoxGeometry(1.5, 3, 1.5);
    var oilBabOneM = new THREE.Mesh(oilBabOne, waterMaterial);
    oilBabOneM.rotation.y = 150 * Math.PI / 180;
    oilBabOneM.position.x = -28.75;
    oilBabOneM.position.y = 6.75;
    oilBabOneM.position.z = -56.25;
    //
    var oilBabTwoM = oilBabOneM.clone();
    var oilBabThreeM = oilBabOneM.clone();
    var oilBabFourM = oilBabOneM.clone();
    var oilBabFiveM = oilBabOneM.clone();
    var oilBabSixM = oilBabOneM.clone();
    var oilBabAM = oilBabOneM.clone();
    var oilBabBM = oilBabOneM.clone();
    var oilBabCM = oilBabOneM.clone();
    var oilBabDM = oilBabOneM.clone();
    var oilBabEM = oilBabOneM.clone();
    //
    scene.add(oilBabOneM);
    scene.add(oilBabTwoM);
    scene.add(oilBabThreeM);
    scene.add(oilBabFourM);
    scene.add(oilBabFiveM);
    scene.add(oilBabSixM);
    scene.add(oilBabAM);
    scene.add(oilBabBM);
    scene.add(oilBabCM);
    scene.add(oilBabDM);
    scene.add(oilBabEM);
    //
    var OBOne = new TWEEN.Tween(oilBabOneM.position).to({
        y: 0.5
    }, 310);
    var OBTwo = new TWEEN.Tween(oilBabTwoM.position).to({
        y: 0.5
    }, 210);
    var OBThree = new TWEEN.Tween(oilBabThreeM.position).to({
        y: 0.5
    }, 410);
    var OBFour = new TWEEN.Tween(oilBabFourM.position).to({
        y: 0.5
    }, 150);
    var OBFive = new TWEEN.Tween(oilBabFiveM.position).to({
        y: 0.5
    }, 300);
    var OBSix = new TWEEN.Tween(oilBabSixM.position).to({
        y: 0.5
    }, 250);
    var OBA = new TWEEN.Tween(oilBabAM.position).to({
        y: 0.5
    }, 290);
    var OBB = new TWEEN.Tween(oilBabBM.position).to({
        y: 0.5
    }, 380);
    var OBC = new TWEEN.Tween(oilBabCM.position).to({
        y: 0.5
    }, 170);
    var OBD = new TWEEN.Tween(oilBabDM.position).to({
        y: 0.5
    }, 420);
    var OBE = new TWEEN.Tween(oilBabEM.position).to({
        y: 0.5
    }, 230);
    loopEase(OBOne);
    loopEase(OBTwo);
    loopEase(OBThree);
    loopEase(OBFour);
    loopEase(OBFive);
    loopEase(OBSix);
    loopEase(OBA);
    loopEase(OBB);
    loopEase(OBC);
    loopEase(OBD);
    loopEase(OBE);
}
//this click function thats not in a function because it needs to be global but its the click function on the button
bar.addEventListener("click", function () {
    barVal = bar.value;
    if (barVal == 1) {
        fixRot();
        goAboveWater();
        posOne();
        underwawa = false;
        setTimeout(function () {
            $("#underwawa").text("Submerge");
            $("#underbubbles").fadeOut(300);
            $(subwa).fadeIn(300);
            $(bar).fadeOut(300);
        }, 800);
        if (oil) {
            setTimeout(function () {
                scene.children[8].visible = false;
                scene.children[9].visible = false;
                scene.children[17].visible = false;
                scene.children[18].visible = false;
                scene.children[19].visible = false;
                scene.children[20].visible = false;
                scene.children[21].visible = false;
                scene.children[22].visible = false;
                scene.children[23].visible = false;
                scene.children[24].visible = false;
                scene.children[25].visible = false;
                scene.children[26].visible = false;
                scene.children[27].visible = false;
                scene.children[28].visible = false;
            }, 800);
        }
        if (lightC == true) {
            lightCoral();
        }
        setTimeout(function () {
            text.innerHTML = "Shoreline Mayhem"
            $(text).removeClass().addClass("title");
            $(".secondMessage").css("display", "none")
        }, 800);
    }
    else if (barVal == 2) {
        fixRot();
        goUnderWater();
        posTwo();
        $(subwa).fadeOut(800);
        setTimeout(function () {
            $(bar).fadeIn(300);
            $("#underbubbles").fadeIn(300);
            bar.value = 2;
        }, 800);
        underwawa = true;
        if (lightC == false) {
            lightCoral();
        }
        setTimeout(function () {
             $(text).html("Our oceans are home to some of the most beautiful and essential life on earth, the oceans flow with over nearly three-quarters of our planet, and hold 97% of the planet&#39; water.<br><br>They produce more than half of the oxygen in the atmosphere, and absorb most of the carbon it produces. This along with sunlight feeds underwater plants, which feed fish and underwater creatures.");
            $(text).removeClass().addClass("bodyC");
             new TWEEN.Tween(seamaterial.color).to({
            r: 0.10588235294117647
            , g: 0.5176470588235295
            , b: 0.35294117647058826
        }, 1000).easing(TWEEN.Easing.Quadratic.InOut).start()
        }, 800)
    }
    else if (barVal == 3) {
        fixRot();
        goUnderWater();
        posThree();
        underwawa = true;
        if (lightC == false) {
            lightCoral();
        }
        setTimeout(function () {
            text.innerHTML = "Coral is an essential part to those oceans, providing a home to many different kinds of underwater life, the coral itself in fact, is a living creature too! They protect all sorts of living beings from predators and ask nothing in return. They live by using small polyps that photosynthesize and collect nutrients from the sun&#39;s light. "
            $(text).removeClass().addClass("bodyC");
            $(".secondMessage").css("display", "none")
        }, 800)
    }
    else if (barVal == 4) {
        goUnderWater();
        posFour();
        underwawa = true;
        if (lightC == true) {
            deadCoral();
        }
        setTimeout(function () {
            text.innerHTML = "Coral however is a dying species. Oil in the ocean not only harms coral and wildlife but micro-bacteria as well. <br><br>When the corals begin to break down the bacteria and micro-organisms to eat, the coral will die. In addition to this, a 2017 study found that coral surprisingly enjoy eating plastic, like a literal junk food, but after eating and not being able to process it they eventually die along with the plastic."
            $(text).removeClass().addClass("bodyC");
            $(".secondMessage").css("display", "none")
        }, 800)
    }
    else if (barVal == 5) {
        goAboveWater();
        posFive();
        setTimeout(function () {
            rearLight.visible = true;
        }, 800);
        underwawa = false;
        if (oilIs == false) {
            setTimeout(function () {
                oilBoy();
                scene.children[8].visible = true;
                scene.children[9].visible = true;
                $(".secondMessage").css("display", "none")
            }, 800);
            oil = true;
        }
        else {
            setTimeout(function () {
                scene.children[8].visible = true;
                scene.children[9].visible = true;
                scene.children[17].visible = true;
                scene.children[18].visible = true;
                scene.children[19].visible = true;
                scene.children[20].visible = true;
                scene.children[21].visible = true;
                scene.children[22].visible = true;
                scene.children[23].visible = true;
                scene.children[24].visible = true;
                scene.children[25].visible = true;
                scene.children[26].visible = true;
                scene.children[27].visible = true;
                scene.children[28].visible = true;
                $(".secondMessage").css("display", "none")
            }, 800);
            oil = true
        }
        if (lightC == true) {
            lightCoral();
        }
        setTimeout(function () {
            $(text).html("Nearly 85 percent of the 29 million gallons of petroleum that enter North American ocean waters each year as a result of human activities comes from land-based runoff, polluted rivers, airplanes, and small boats and jet skis, while less than 8 percent comes from tanker or pipeline spills, says a new report from the National Academies&#39; National Research Council. <br><br>Since most oils float, the creatures most affected by oil are animals like sea otters and seabirds that are found on the sea surface or on shorelines if the oil comes ashore. <br><em> Press the yellow button to stop the oil!</em>");
            $(text).removeClass().addClass("bodyC");
            $(".secondMessage").css("display", "none")
        }, 800)
    }
    else if (barVal == 6) {
        $(".secondMessage").css("display", "none")
        goUnderWater();
        posSix();
        underwawa = true;
        if (lightC == false) {
            lightCoral();
        }
        setTimeout(function () {
            text.innerHTML = "Most often, shellfish and finfish either are directly unaffected by oil or are affected only briefly because most oils float like stated earlier. That being said the effects of oil are still harming in that they block sunlight and nutrients from reaching plants and slowly leave an area to die. "
            $(text).removeClass().addClass("bodyC");
            $(".secondMessage").css("display", "none");
            seaThree.visible = true;
            seaFour.visible = true;
            seaFive.visible = true;
        }, 800)
        new TWEEN.Tween(seamaterial.color).to({
            r: 180 / 255
            , g: 209 / 255
            , b: 180 / 255
        }, 1000).easing(TWEEN.Easing.Quadratic.InOut).start()
    }
    else if (barVal == 7) {
        setTimeout(function () {
            $(text).html("<span class='titleTwo'>We can make a difference!</span><br>By reducing our dependency on fossil fuels, oil, plastics, and by switching to cleaner and more environmentally conscious sources of fuel we can save our ocean!<br><br>By just recycling, switching to re-useable containers, carpooling, and/or taking alternative forms of travel; we can reduce our planet’s dependency on fossil fuels and oil and further preventing spills in our ocean.");
            $(text).removeClass().addClass("bodyC");
            $(".secondMessage").css("display", "none")
        }, 800);
        fixRot();
        goAboveWater();
        posSeven();
        underwawa = false;
        if (lightC == false) {
            lightCoral();
        }
    }
});

function goUnderWater() {
    new TWEEN.Tween(camera.position).to({
        y: -3
    }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start();
    setTimeout(function () {
        flowWater = false;
        group.visible = false;
        plane.visible = true
        fish.visible = true;
        fishTwo.visible = true;
        fishThree.visible = true;
        seaweed.visible = true;
        seaTwo.visible = true;
        coral.visible = true;
        seaThree.visible = false;
        seaFour.visible = false;
        seaFive.visible = false;
        if (oil) {
            scene.children[8].visible = false;
            scene.children[9].visible = false;
            scene.children[17].visible = false;
            scene.children[18].visible = false;
            scene.children[19].visible = false;
            scene.children[20].visible = false;
            scene.children[21].visible = false;
            scene.children[22].visible = false;
            scene.children[23].visible = false;
            scene.children[24].visible = false;
            scene.children[25].visible = false;
            scene.children[26].visible = false;
            scene.children[27].visible = false;
            scene.children[28].visible = false;
            oil == false
        }
        if (particleExist == false) {
            particles();
        }
        else {
            particleSystem.visible = true
        }
    }, 800);
    setTimeout(function () {
        rearLight.visible = false;
    }, 800);
}

function goAboveWater() {
    new TWEEN.Tween(camera.position).to({
        y: 6
    }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start();
    setTimeout(function () {
        //change the bg colour and add water and remove particles
        flowWater = true;
        group.visible = true;
        plane.visible = false
        fish.visible = false;
        fishTwo.visible = false;
        fishThree.visible = false;
        seaweed.visible = false;
        seaTwo.visible = false;
        coral.visible = false;
        seaThree.visible = false;
        seaFour.visible = false;
        seaFive.visible = false;
        particleSystem.visible = false;
    }, 800);
    particleZoom();
}

function posOne() {
    //Places the camera and changes any environmental things for position 1
    //
    new TWEEN.Tween(camera.position).to({
        x: 0
        , z: 40
    }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start();
    if (underwawa == true) {
        setTimeout(function () {
            $('body').removeClass().addClass("overwater");
        }, 800);
    }
    else {
        $('body').removeClass().addClass("overwater");
    }
}

function posTwo() {
    //Places the camera and changes any environmental things for position 2
    //
    new TWEEN.Tween(camera.position).to({
        x: 0
        , z: 40
    }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start();
    new TWEEN.Tween(floorMaterial.color).to({
        r: 52 / 255
        , g: 154 / 255
        , b: 178 / 255
    }, 300).easing(TWEEN.Easing.Quadratic.InOut).start();
    if (underwawa == false) {
        setTimeout(function () {
            $('body').removeClass().addClass("underwater");
        }, 800);
    }
    else {
        $('body').removeClass().addClass("underwater");
    }
}

function posThree() {
    //Places the camera and changes any environmental things for position 3
    //
    new TWEEN.Tween(camera.position).to({
        x: 0
        , z: -30
    }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start()
    new TWEEN.Tween(floorMaterial.color).to({
        r: 52 / 255
        , g: 154 / 255
        , b: 178 / 255
    }, 300).easing(TWEEN.Easing.Quadratic.InOut).start()
    if (underwawa == false) {
        setTimeout(function () {
            $('body').removeClass().addClass("underwater");
        }, 800);
    }
    else {
        $('body').removeClass().addClass("underwater");
    }
}

function posFour() {
    //Places the camera and changes any environmental things for position 4
    //
    new TWEEN.Tween(camera.position).to({
        x: 10
        , z: -70
    }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start()
    new TWEEN.Tween(camera.rotation).to({
        x: 0
        , y: 90 * Math.PI / 180
    }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start()
    broken = true;
    new TWEEN.Tween(floorMaterial.color).to({
        r: 12 / 255
        , g: 40 / 255
        , b: 65 / 255
    }, 300).easing(TWEEN.Easing.Quadratic.InOut).start()
    if (underwawa == false) {
        setTimeout(function () {
            $('body').removeClass().addClass("dirtywater");
        }, 800);
    }
    else {
        $('body').removeClass().addClass("dirtywater");
    }
}

function posFive() {
    //Places the camera and changes any environmental things for position 5
    //
    new TWEEN.Tween(camera.position).to({
        x: 0
        , z: -70
    }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start()
    new TWEEN.Tween(camera.rotation).to({
        x: 0
        , y: 90 * Math.PI / 180
    }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start()
    new TWEEN.Tween(waterMaterial.color).to({
        r: 12 / 255
        , g: 17 / 255
        , b: 20 / 255
    }, 300).easing(TWEEN.Easing.Quadratic.InOut).start()
    new TWEEN.Tween(waterMaterial.opacity).to(0.95, 300).easing(TWEEN.Easing.Quadratic.InOut).start()
    broken = true;
    if (underwawa == true) {
        setTimeout(function () {
            $('body').removeClass().addClass("oilwater");
        }, 800);
    }
    else {
        $('body').removeClass().addClass("oilwater");
    }
}

function posSix() {
    //Places the camera and changes any environmental things for position 6
    //
    new TWEEN.Tween(camera.position).to({
        x: -35
        , z: -70
    }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start()
    new TWEEN.Tween(camera.rotation).to({
        x: 0
        , y: 90 * Math.PI / 180
    }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start()
    new TWEEN.Tween(floorMaterial.color).to({
        r: 2 / 255
        , g: 20 / 255
        , b: 40 / 255
    }, 300).easing(TWEEN.Easing.Quadratic.InOut).start()
    if (underwawa == false) {
        setTimeout(function () {
            $('body').removeClass().addClass("dirtywater");
        }, 800);
    }
    else {
        $('body').removeClass().addClass("dirtywater");
    }
    broken = true;
}

function posSeven() {
    //Places the camera and changes any environmental things for position 7
    //
    new TWEEN.Tween(camera.position).to({
        x: -30
        , z: -70
    }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start();
    if (underwawa == true) {
        setTimeout(function () {
            $('body').removeClass().addClass("overwater");
        }, 800);
    }
    else {
        $('body').removeClass().addClass("overwater");
    }
}

function fixRot() {
    //This fixes the rotation of all of the cameras incase they are angled weird
    //
    if (broken) {
        new TWEEN.Tween(camera.rotation).to({
            x: 10 * Math.PI / 180
            , y: 0
        }, 1600).easing(TWEEN.Easing.Quadratic.InOut).start()
        new TWEEN.Tween(waterMaterial.color).to({
            r: 0
            , g: 170 / 255
            , b: 238 / 255
        }, 600).easing(TWEEN.Easing.Quadratic.InOut).start()
        broken = false
        new TWEEN.Tween(waterMaterial.opacity).to(0.65, 300).easing(TWEEN.Easing.Quadratic.InOut).start()
    }
    rearLight.visible = false;
}

function BrowserDetection() {
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    //detects and destroys non WebGl browsers
    //
    if (isOpera || isFirefox || isEdge || isIE) {
       location.replace("404.html")
    }
}
//All my EventListeners
//
subwa.addEventListener("click", function () {
    if (underwawa == false) {
        fixRot();
        goUnderWater();
        posTwo();
        $(subwa).fadeOut(800);
        setTimeout(function () {
            $(bar).fadeIn(300);
            $("#underbubbles").fadeIn(300);
            bar.value = 2;
        }, 800);
        underwawa = true;
        setTimeout(function () {
            text.innerHTML = "Our oceans are home to some of the most beautiful and essential life on earth, the oceans flow with over nearly three-quarters of our planet, and hold 97% of the planet's water.<br><br>They produce more than half of the oxygen in the atmosphere, and absorb most of the carbon it produces. This along with sunlight feeds underwater plants, which feed fish and underwater creatures."
            $(text).removeClass().addClass("bodyC");
            $(".firstMessage").css("display", "none");
            $(".secondMessage").css("display", "block");
        }, 800);
        barVal = 2;
        if (lightC == false) {
            lightCoral();
        }
    }
});
document.onmousedown = function () {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        INTERSECTED = intersects[0].object;
        if (INTERSECTED == yellowThing) {
            if (booble) {
                scene.children[17].visible = false;
                scene.children[18].visible = false;
                scene.children[19].visible = false;
                scene.children[20].visible = false;
                scene.children[21].visible = false;
                scene.children[22].visible = false;
                scene.children[23].visible = false;
                scene.children[24].visible = false;
                scene.children[25].visible = false;
                scene.children[26].visible = false;
                scene.children[27].visible = false;
                booble = false;
                new TWEEN.Tween(waterMaterial.color).to({
                    r: 0
                    , g: 50 / 255
                    , b: 120 / 255
                }, 600).easing(TWEEN.Easing.Quadratic.InOut).start()
                fishOver = false;
                new TWEEN.Tween(scene.children[8].position).to({
                    y: -5
                }, 600).easing(TWEEN.Easing.Quadratic.InOut).start()
                new TWEEN.Tween(scene.children[9].position).to({
                    y: -5
                }, 600).easing(TWEEN.Easing.Quadratic.InOut).start()
                new TWEEN.Tween(waterMaterial.opacity).to(0.65, 300).easing(TWEEN.Easing.Quadratic.InOut).start()
            }
            else if (booble == false) {
                scene.children[17].visible = true;
                scene.children[18].visible = true;
                scene.children[19].visible = true;
                scene.children[20].visible = true;
                scene.children[21].visible = true;
                scene.children[22].visible = true;
                scene.children[23].visible = true;
                scene.children[24].visible = true;
                scene.children[25].visible = true;
                scene.children[26].visible = true;
                scene.children[27].visible = true;
                booble = true;
                fishOver = true;
                new TWEEN.Tween(waterMaterial.color).to({
                    r: 12 / 255
                    , g: 17 / 255
                    , b: 20 / 255
                }, 300).easing(TWEEN.Easing.Quadratic.InOut).start()
                new TWEEN.Tween(waterMaterial.opacity).to(0.95, 300).easing(TWEEN.Easing.Quadratic.InOut).start()
            }
        }
    }
}