import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditWisata() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nama_wisata: "",
        deskripsi: "",
        harga_tiket: "",
        id_kategori: "",
    });
    
    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                // ambil data wisata
                const resWisata = await fetch(`http://localhost:3001/wisata/${id}`);
                const dataWisata = await resWisata.json();
                console.log("Data wisata:", dataWisata[0]);
                setFormData({
                    nama_wisata: dataWisata[0].nama_wisata,
                    deskripsi: dataWisata[0].deskripsi,
                    harga_tiket: dataWisata[0].harga_tiket,
                    id_kategori: dataWisata[0].id_kategori,
                });

                //ambil data kategori
                const resKategori = await fetch("http://localhost:3001/kategori");
                const dataKategori = await resKategori.json();
                setKategori(dataKategori);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ 
            ...formData,
            [e.target.name]: e.target.value 
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const yakin = window.confirm("Yakin mau menyimpan perubahan ini?");

        if (!yakin) {
            return;
        }

        try{
            const res = await fetch(`http://localhost:3001/wisata/${id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Wisata berhasil diperbarui!");
                navigate("/wisata");
            } else {
                alert("Gagal memperbarui wisata");
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan.");
        }
    };

    if(loading) {
        return <div className="container mt-4">Loading...</div>
    }

    return (
        <div className="container mt-4">
            <h2>Edit Wisata</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Nama Wisata</label>
                    <input
                        type="text"
                        name="nama_wisata"
                        value={formData.nama_wisata}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        className="form-control"
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Harga Tiket</label>
                    <input
                        type="number"
                        name="harga_tiket"
                        value={formData.harga_tiket}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Kategori</label>
                    <select
                        name="id_kategori"
                        value={formData.id_kategori}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">--- Pilih Kategori ---</option>
                        {kategori.map((item) => (
                            <option
                                key={item.id_kategori}
                                value={item.id_kategori}
                            >
                                {item.kategori}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-success me-2">
                    Simpan Perubahan
                </button>
            </form>
        </div>
    );
}