const picturesDiv = document.getElementById('pictures')
const pictureDivArr = picturesDiv.children

for (div of pictureDivArr) {
    const imgId = div.dataset.imgId
    const a = div.firstElementChild
    console.log(userImages)
    console.log(imgId)
    const snapshot = userImages
        .filter(imgObj => imgObj.id == imgId)[0]
        .snapshot
    console.log(snapshot)
    const canvas = LC.renderSnapshotToImage(snapshot, {
      margin: { top: 1, right: 1, bottom: 1, left: 1 },
    });
    a.prepend(canvas)
};