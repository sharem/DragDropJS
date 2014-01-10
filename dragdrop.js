// Positions map => {[key, Object, ocuppied?(true/false)], ...}
var positions = {};
// Coods ==> [[left, top], ...]
var coords = [[37,243],[280,243]];

var canvas = new fabric.Canvas('c');
canvas.setWidth(857);
canvas.setHeight(462);
canvas.setBackgroundImage('assets/tree.png');
fabric.Object.prototype.transparentCorners = false;

fabric.Image.fromURL('assets/gap.png', createGaps);

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
function createGaps(img)  {
for (var i = 0, len = 2; i < len; i++) {
    var l = coords[i][0];
    var t = coords[i][1];

    var img = new fabric.Image(img.getElement(), {
       left: l, top: t, selectable: false, });

        img.perPixelTargetFind = true;
        img.targetFindTolerance = 4;
        img.hasControls = img.hasBorders = false;

        //add gap area to the canvas
        canvas.add(img);
        //save gap object in the positions map
        positions[i] = [img, false];
      
  }
  var x = canvas.getObjects();
}

// load assets
var assets = ['assets/hestia.png', 'assets/hera.png', 'assets/poseidon.png'];

for (var i = 0, len = 3; i < len; i++) {
  fabric.Image.fromURL(assets[i], function(img) {
    img.set({
      left: fabric.util.getRandomInt(0, 300),
      top: fabric.util.getRandomInt(0, 300),
    });

    img.perPixelTargetFind = true;
    img.targetFindTolerance = 4;
    img.hasControls = img.hasBorders = false;

    canvas.add(img);
  });
}



//canvas.add(rect1, rect2);
canvas.on({
  'object:moving': onChange,
  'object:modified': goToPosition,
});

function onChange(options) {
  options.target.setCoords();
  canvas.forEachObject(function(obj) {
    if (obj === options.target) return;
    obj.setOpacity(options.target.intersectsWithObject(obj) ? 0.5 : 1);
  });
}

function goToPosition(options) {
  for (var pos in positions){
    // get the position object
    var position = positions[pos][0];
    var ocuppied = positions[pos][1];
    // if the object was previously occupying a position, free 
    // that position
    if (ocuppied) positions[pos][1] = false;
    // check if the object intersects a position
    if (options.target.intersectsWithObject(position)) {
      // check if the position is already filled with another object
      if (!(ocuppied)) {
          // if it's not filled with another object,
          // automaticaly fill the position with the objects
          positions[pos][1] = true;
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