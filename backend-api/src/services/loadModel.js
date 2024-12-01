const tf = require("@tensorflow/tfjs-node");

function loadModel() {
    return tf.loadLayersModel(process.env.MODEL_URL);
}

module.exports = loadModel;

