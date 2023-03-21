const canvas = LC.renderSnapshotToImage(snapshot)
const canvasBox = document.querySelector('.image-container')

canvasBox.appendChild(canvas)