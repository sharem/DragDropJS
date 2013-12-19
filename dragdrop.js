
var canvas = new fabric.Canvas('c');
fabric.Object.prototype.transparentCorners = false;

var rect1 = new fabric.Rect({
  width: 100, height: 150, left: 100, top: 350,
  fill: 'red',
selectable: false
});

var rect2 = new fabric.Rect({
  width: 100, height: 150, left: 400, top: 350,
  fill: 'red',
selectable: false
});

/*
var rect3 = new fabric.Rect({
  width: 100, height: 100, left: 100, top: 100,
  fill: 'blue'
});

var rect4 = new fabric.Rect({
  width: 100, height: 100, left: 175, top: 250,
  fill: 'green'
});
*/
for (var i = 0, len = 2; i < len; i++) { 
  fabric.Image.fromURL('./assets/jake.png', function(img) {
    img.set({
      left: fabric.util.getRandomInt(0, 300),
      top: fabric.util.getRandomInt(0, 300),
      width: 100,
      height: 150,
    });

    // img.perPixelTargetFind = true;
    // img.targetFindTolerance = 4;
    img.hasControls = img.hasBorders = false;

    canvas.add(img);
  });
}

// var positions = [rect1, rect2]; 
// Positions MAP => key = [Object, ocuppied?(true/false)]
var positions = {};
positions[1] = [rect1, false];
positions[2] = [rect2, false];

canvas.add(rect1, rect2);
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
          options.target.setLeft(position.getLeft());
          options.target.setTop(position.getTop());
          positions[pos][1] = true;
          // set opacity to 1
          positions[pos][0].setOpacity(1);
      } else {
        alert("There's another object in this position! :/");
      }
    }
 }
}