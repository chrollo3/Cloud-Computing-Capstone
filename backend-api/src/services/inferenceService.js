const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
    try {
        // Preprocessing gambar
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .div(tf.scalar(255)) // Normalisasi nilai piksel ke [0, 1]
            .expandDims();

        // Prediksi dengan model
        const prediction = model.predict(tensor);
        const score = await prediction.data(); // Output sigmoid, berupa probabilitas (0-1)

        // Menentukan hasil
        const confidenceScore = score[0] * 100; // Probabilitas untuk kelas pertama (Organic)
        const label = score[0] > 0.5 ? 'Anorganik' : 'Organik'; // Membalik threshold jika tertukar

        // Saran berdasarkan hasil
        let suggestion;
        if (label === 'Organik') {
            suggestion = "Buanglah sampah organik sesuai dengan tempatnya.";
            explanation = "Sampah organik adalah sampah yang berasal dari sisa makhluk hidup (alam) seperti hewan, manusia, tumbuhan, dan benda hasil olahannya yang dapat mengalami pembusukan atau pelapukan";
            handling = "Penanganan Sampah Organik \n1. Pisahkan Sampah Organik dari sampah lain untuk memudahkan pengelolaan. \n2. Buat Kompos: Ubah sisa makanan, daun, atau limbah dapur menjadi pupuk alami. \n3. Olahan Biogas: Gunakan biodigester untuk menghasilkan gas metana sebagai energi. \n4. Pakan Ternak: Manfaatkan sisa sayuran atau buah untuk makanan hewan. \n5. Mulsa Kebun: Gunakan daun kering atau rumput sebagai penutup tanah di kebun. \n6. Bank Sampah Organik: Serahkan sampah organik ke komunitas untuk diolah bersama. \nManfaat: Mengurangi limbah TPA, menghasilkan pupuk, dan mendukung lingkungan."
            navigation = "https://youtu.be/WI4pRrTDhUs?si=qbAvNron6LNoejTc"
        } else {
            suggestion = "Buanglah sampah anorganik sesuai dengan tempatnya.";
            explanation = "Sampah anorganik adalah sampah yang berasal dari bahan non hayati, seperti plastik, logam, kaca, dan kertas.";
            handling = "Penanganan Sampah Anorganik \n1. Pisahkan Sampah: Berdasarkan jenis (plastik, kaca, logam, kertas). \n2. Daur Ulang: Olah plastik, kaca, atau logam menjadi produk baru. \n3. Gunakan Kembali: Reuse botol, kaleng, atau kertas yang masih layak. \n4. Bank Sampah: Kirim ke bank sampah untuk pengolahan lebih lanjut. \n5. Edukasi: Ikut program komunitas daur ulang atau kampanye pengelolaan sampah."
            navigation = "https://youtu.be/eRHK4eDJhX0?si=Ai9nlevaHADMrV6L"
        }


        return { label, suggestion, explanation, handling, navigation };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;
