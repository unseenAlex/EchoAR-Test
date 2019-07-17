//component that uses the gesture-detector to spin an object
//add it to an a-entity to make it two-finger-spinnable
//source: https://github.com/8thwall/web/blob/master/examples/aframe/manipulate/two-finger-spin.js

AFRAME.registerComponent('two-finger-spin', {
    schema: {
      factor: {default: 5}
    },
    init: function() {
      this.handleEvent = this.handleEvent.bind(this)
      this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
    },
    remove: function() {
      this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
    },
    handleEvent: function(event) {
      this.el.object3D.rotation.y += event.detail.positionChange.x * this.data.factor
    }
  })