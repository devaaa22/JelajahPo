App.post('/wisata', (req, res) => {
    const { nama_wisata, deskripsi, harga_tiket, id_kategori } = req.body;

    if (!nama_wisata || !harga_tiket) {
        return res.status(400).json({ message: 'Nama Wisata dan harga_tiket wajib diisi' });
    }

    const sql = 'INSERT INTO wisata (nama_wisata, deskripsi, harga_tiket, id_kategori, tgl_input) VALUES (?, ?, ?, ?, NOW())';
    db.query(sql, [nama_wisata, deskripsi, harga_tiket, id_kategori], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessange });
    res.json({
        message: 'Wisata berhasil ditambahkan!',
        id_wisata: result.insertId
    });
    });
});