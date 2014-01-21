// Positions ==> [[key(Object), anwser, ocuppied?(true/false)], ...]
var positions = [];
// Coods ==> [[left, top], ...]
var coords = [[304,230],[478,230],[598,230],[452,462],[770,462]];
var names = ["Hera", "Zeus", "Poseidon", "Atenea", "Afrodita"];
// Assets
var assets = ['assets/hera.png', 'assets/zeus.png', 'assets/poseidon.png', 'assets/atenea.png', 'assets/afrodita.png'];

var canvas = new fabric.Canvas('c');
canvas.setWidth(1100);
canvas.setHeight(600);
canvas.setBackgroundImage('assets/tree.png', loadImages);
fabric.Object.prototype.transparentCorners = false;

function loadImages() {
  fabric.Image.fromURL('assets/gap.png', createGaps);
  createDraggableImages();
}

function createGaps(img)  {
  for (var i = 0, len = 5; i < len; i++) {
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

function createCrosses(obj) {
  fabric.Image.fromURL('assets/cross.png', function(img) {
    img.set({
      left: obj.left,
      top: obj.top,
      type: "check",
    });
    img.hasControls = img.hasBorders = img.selectable = false;
    canvas.add(img);
  });
}

function createTicks(obj)  {
  fabric.Image.fromURL('assets/tick.png', function(img) {
    img.set({
      left: obj.left,
      top: obj.top,
      type: "check",
    });
    img.hasControls = img.hasBorders = img.selectable = false;
    canvas.add(img);
  });
}

function createDraggableImages() {
// create draggable assets
  for (var i = 0, len = 5; i < len; i++) {
    fabric.Image.fromURL(assets[i], function(img) {
      img.set({
        left: fabric.util.getRandomInt(900, 1000),
        top: fabric.util.getRandomInt(0, 500),
        type: "draggable",
      });

      img.perPixelTargetFind = true;
      img.targetFindTolerance = 4;
      img.hasControls = img.hasBorders = false;

      canvas.add(img); 
    }, {id: i});
  }
}

// Events
canvas.on({
  'object:moving': onChange,
  'object:modified': goToPosition,
});

function onChange(options) {
  options.target.setCoords();
  canvas.forEachObject(function(obj) {
    if (obj.type === "check") {
      canvas.remove(obj);
    }
    if (obj === options.target) return;
    // if not a gap don't change it's opacity
    if (obj.type != "gap") return;
    obj.setOpacity(options.target.intersectsWithObject(obj) ? 0.5 : 0.2);
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
          positions[pos][0].setOpacity(0.2);
          options.target.setLeft(position.getLeft());
          options.target.setTop(position.getTop());
      } else {
        alert("Ya existe otra imágen en este sitio.");
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
      alert("¡Hay huecos que están vacios!");
      return;
    }
    if (ocuppied.id != anwser) {
      canvas.forEachObject(function(obj) {
        if (obj.type != "gap") {
          if (obj === ocuppied) {
            createCrosses(obj);
          }
        }
      });
    } else {
      canvas.forEachObject(function(obj) {
        if (obj.type != "gap") {
          if (obj === ocuppied) {
            createTicks(obj);
          }
        }
      });
    }
  }
}

function resetActivity() {
  // empty positions' array "occupied"
  for (var pos in positions) {
    positions[pos][2] = null;
  }
  // remove check images and relocate draggable images
  canvas.forEachObject(function(obj) {
    if (obj.type === "check") {
      canvas.remove(obj);
    }
    if (obj.type === "draggable") {
      obj.setTop(fabric.util.getRandomInt(0, 500));
      obj.setLeft(fabric.util.getRandomInt(900, 1000));
      obj.setCoords();
    }
  });
   canvas.renderAll();
}