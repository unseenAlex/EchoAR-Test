/*
check-spawner.js
Author: Alexandros Lotsos
Summary: a check-spawner component that does nothing on startup.
Has a targetCount value that is incremented by elements in the scene that have the updater component when they're scanned.
Once the targetCount value reaches a predetermined limit, the user is allowed to spawn a certain number of a model onto the scene.
*/

AFRAME.registerComponent('check-spawner', {
    schema: {
        modelID: {
            type: 'string',
            default: ''
        },
        modelType: {
            type: 'string',
            default: 'gltf'
        },
        modelMTL: {
            type: 'string',
            default: ''
        },
        modelScale: {
            type: 'vec3',
            default: {
                x: 1,
                y: 1,
                z: 1
            }
        },
        modelRotation: {
            type: 'vec3',
            default: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        targetLimit: {
            type: 'int',
            default: 1
        },
        modelLimit: {
            type: 'int',
            default: 1
        }
    },
    init: function () {

        //bind this to spawnModel so it functions properly
        const data = this;
        this.spawnModel = this.spawnModel.bind(data);

        if (this.data.targetLimit === 0) {
            console.log("event listener added");
            const ground = document.querySelector('#ground');
            ground.addEventListener('click', this.spawnModel);
        }

    },
    spawnModel: function (event) {
        const model = document.createElement('a-entity');
        const touchPoint = event.detail.intersection.point; //get a reference to the touch point

        //set the initial position rotation and scale of the original model
        model.setAttribute('position', touchPoint);
        model.setAttribute('rotation', this.data.modelRotation);
        model.setAttribute('scale', this.data.modelScale);

        //attach the specified gltf model to the entity
        if(this.data.modelType === 'gltf'){
            model.setAttribute('gltf-model', this.data.modelID);
        } else if(this.data.modelType === 'obj'){
            model.setAttribute('obj-model', `obj: ${this.data.modelID}; mtl: ${this.data.modelMTL}`)
        } else{

        }

        model.setAttribute('visible', 'true');

        //give it the cantap class and the placeModel id for reference
        model.className += "cantap";
        model.id = "placeModel";

        //attach the model to the scene
        document.querySelector('#mainScene').appendChild(model);

        //give the model the drag rotate and scale components
        model.setAttribute('hold-drag', '');
        model.setAttribute('pinch-scale', '');
        model.setAttribute('two-finger-spin', '');

        //increment the model count and check to see if the spawner should be disabled
        this.modelCount++;
        this.removeSpawner();
    },
    removeSpawner: function () {
        const ground = document.querySelector('#ground');

        if (this.modelCount >= this.data.modelLimit) {
            ground.removeEventListener('click', this.spawnModel);
        }
    },
    increment: function () {
        //increment the targetCount
        this.targetCount++;
        console.log(this.targetCount);

        //check to see if the spawner should be enabled
        if (this.targetCount === this.data.targetLimit) {
            const ground = document.querySelector('#ground');
            ground.addEventListener('click', this.spawnModel);
        }
    },
    decrement: function () {
        console.log("value has been decremented");
    },
    modelCount: 0,
    targetCount: 0
});