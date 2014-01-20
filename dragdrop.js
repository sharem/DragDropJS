// Positions ==> [[key(Object), anwser, ocuppied?(true/false)], ...]
var positions = [];
// Coods ==> [[left, top], ...]
var coords = [[37,243],[280,243],[576,242],[111,392]];
// Assets
var assets = [ 'assets/hestia.png', 'assets/hera.png', 'assets/poseidon.png', 'assets/ares.png'];

var canvas = new fabric.Canvas('c');
canvas.setWidth(857);
canvas.setHeight(462);
canvas.setBackgroundImage('assets/tree.png', loadImages);
fabric.Object.prototype.transparentCorners = false;

function loadImages() {
  fabric.Image.fromURL('assets/gap.png', createGaps);
  createDraggableImages();
}


function createGaps(img)  {
  for (var i = 0, len = 4; i < len; i++) {
      //get gap coords from the coods array
      var l = coords[i][0];
      var t = coords[i][1];

      var img = new fabric.Image(img.getElement(), {
        left: l, top: t, selectable: false, type: "gap"});

      img.perPixelTargetFind = true;
      img.targetFindTolerance = 4;
      img.hasControls = img.hasBorders = false;
      img.setOpacity(0.2);
      //add gap area to the canvas
      canvas.add(img);
      //save gap object in the positions map
      positions[i] = [img, i, null];
  }
}

function createDraggableImages() {
// create draggable assets
  for (var i = 0, len = 4; i < len; i++) {
    fabric.Image.fromURL(assets[i], function(img) {
      img.set({
        left: fabric.util.getRandomInt(0, 300),
        top: fabric.util.getRandomInt(0, 300),
      });

      img.perPixelTargetFind = true;
      img.targetFindTolerance = 4;
      img.hasControls = img.hasBorders = false;

      canvas.add(img); 
    }, {id: i});
  }
}
/*
var rect1 = new fabric.Rect({
  width: 118, height: 60, left: 38, top: 244,
  fill: 'grey',
selectable: false
});
*/

/*
var rect2 = new fabric.Rect({
  width: 100, height: 150, left: 400, top: 350,
  fill: 'grey',
selectable: false
});

var rect3 = new fabric.Rect({
  width: 100, height: 100, left: 100, top: 100,
  fill: 'blue'
});

var rect4 = new fabric.Rect({
  width: 100, height: 100, left: 175, top: 250,
  fill: 'green'
});
*/

// Events
canvas.on({
  'object:moving': onChange,
  'object:modified': goToPosition,
});

function onChange(options) {
  options.target.setCoords();
  canvas.forEachObject(function(obj) {
    if (obj === options.target) return;
    // if not a gap don't change it's opacity
    if (obj.type != "gap") return;
    obj.setOpacity(options.target.intersectsWithObject(obj) ? 0.5 : 0);
  });
}

function goToPosition(options) {
  for (var pos in positions){
    // get the position object
    var position = positions[pos][0];
    var ocuppied = positions[pos][2];
    // if the object was previously occupying a position, free 
    // that position
    if (options.target === ocuppied) positions[pos][2] = null;
    // check if the object intersects a position
    if (options.target.intersectsWithObject(position)) {
      // check if the position is already filled with another object
      if (!(ocuppied)) {
          // if it's not filled with another object,
          // automaticaly fill the position with the objects
          positions[pos][2] = options.target;
          // set opacity to 1
          positions[pos][0].setOpacity(1);
          options.target.setLeft(position.getLeft());
          options.target.setTop(position.getTop());
      } else {
        alert("There's another object in this position! :/");
      }
    }
  }
}

function checkAnswers() {

      for (var pos in positions) {
        var position = positions[pos][0];
        var anwser = positions[pos][1];
        var ocuppied = positions[pos][2];
        if (ocuppied === null) {
          alert("Empty");
          return;
        }
        if (ocuppied.id != anwser) {
          alert("Wrong!");
          return;
        }
      }

}