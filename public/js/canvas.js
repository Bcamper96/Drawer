const imageSize = { width: 1000, height: 1000 };
window.currentDrawingId = 0;
var imageBounds = {
  x: 0,
  y: 0,
  width: imageSize.width,
  height: imageSize.height,
};

var lc = LC.init(document.getElementById("lc"), {
  imageURLPrefix: "/assets/lc-images",
  toolbarPosition: "bottom",
  defaultStrokeWidth: 2,
  strokeWidths: [1, 2, 3, 5, 30],
});

async function saveAs(title, isPublic) {
  const response = await fetch("/api/images/save-as", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      snapshot: lc.getSnapshot(),
      isPublic: isPublic,
    }),
  });
  const responseId = (await response.json()).id;
  window.currentDrawingId = responseId;
}

async function saveOver(id, title, isPublic) {
  await fetch("/api/images/save-over", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      title: title,
      snapshot: lc.getSnapshot(),
      isPublic: isPublic,
    }),
  });
  window.currentDrawingId = id;
  console.log(`Saved drawing as ${title}`);
}

async function load(id) {
  const response = await $.ajax(`/api/images/download/${id}`);
  const snapshot = response.snapshot;
  lc.loadSnapshot(snapshot);
  window.currentDrawingId = id;
}

$("#save-as").click(async (e) => {
  e.preventDefault();
  const title = prompt("Name your drawing:");
  const public = document.getElementById("public").checked;
  saveAs(title, public);
});

$("#save").click(async (e) => {
  e.preventDefault();

  const title = prompt("Name your drawing:");
  const public = document.getElementById("public").checked;
  if (!window.currentDrawingId) {
    saveAs(title, public);
    return
  }

  saveOver(window.currentDrawingId, title, public);
});
