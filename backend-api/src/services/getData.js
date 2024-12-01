const { Firestore } = require("@google-cloud/firestore");

async function getData() {
    const db = new Firestore({ databaseId: 'testing-cc' });

    const predictRef = db.collection("predictions");
    const snapshot = await predictRef.get();
    const data = [];
    snapshot.forEach((doc) => {
        // console.log(doc.id, "=>", doc.data());
        const currData = {
            id: doc.id,
            history: doc.data()
        }
        data.push(currData);
    });
    return data;
}

module.exports = getData;
