//component that uses the gesture-detector to scale an object
//add it to an a-entity to make it pinch-scaleable
//source: https://github.com/8thwall/web/blob/master/examples/aframe/manipulate/pinch-scale.js

AFRAME.registerComponent('pinch-scale', {
    schema: {
      min: {default: 0.01},
      max: {default: 8}
    },
    init: function() {
      this.initialScale = this.el.object3D.scale.clone()
      this.scaleFactor = 1
      this.handleEvent = this.handleEvent.bind(this)
      this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
    },
    remove: function() {
      this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
    },
    handleEvent: function(event) {
      this.scaleFactor *= 1 + event.detail.spreadChange / event.detail.startSpread
      this.scaleFactor = Math.min(Math.max(this.scaleFactor, this.data.min), this.data.max)
  
      this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x
      this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y
      this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z
    },
    //moved initialscale to a separate kvp for now, find a way for the components to communicate later
    initialScale: {
      x: 1,
      y: 1,
      z: 1,
    }
  })