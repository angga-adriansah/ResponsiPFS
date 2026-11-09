import React, { useState } from 'react';

export default function App() {
  // --- 1. STATE MANAGEMENT CRUD ---
  const [items, setItems] = useState([
    { id: 1, nama: 'Indomie Goreng', harga: 3500, stok: 120, diskon: 0 },
    { id: 2, nama: 'Gula Pasir 1kg', harga: 14000, stok: 45, diskon: 5 },
  ]);

  const [formData, setFormData] = useState({ nama: '', harga: '', stok: '', diskon: '' });
  const [editId, setEditId] = useState(null);

  // --- LOGIKA PERHITUNGAN E-COMMERCE ---
  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  const hitungDiskon = (harga, diskon) => harga - harga * ((diskon || 0) / 100);

  const totalStok = items.reduce((acc, curr) => acc + Number(curr.stok), 0);
  const totalPendapatan = items.reduce((acc, curr) => acc + hitungDiskon(curr.harga, curr.diskon) * curr.stok, 0);
  const maxStok = items.length > 0 ? Math.max(...items.map((item) => Number(item.stok))) : 1; // Untuk patokan tinggi grafik

  // --- 2. HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.harga) return;

    const dataBaru = {
      nama: formData.nama,
      harga: Number(formData.harga),
      stok: Number(formData.stok) || 0,
      diskon: Number(formData.diskon) || 0,
    };

    if (editId) {
      const updatedItems = items.map((item) => (item.id === editId ? { ...item, ...dataBaru } : item));
      setItems(updatedItems);
      setEditId(null);
    } else {
      const newItem = { id: Date.now(), ...dataBaru };
      setItems([...items, newItem]);
    }
    setFormData({ nama: '', harga: '', stok: '', diskon: '' });
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({ nama: item.nama, harga: item.harga, stok: item.stok, diskon: item.diskon });
    // Scroll otomatis ke bagian form saat tombol edit diklik
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
    if (editId === id) {
      setEditId(null);
      setFormData({ nama: '', harga: '', stok: '', diskon: '' });
    }
  };

  return (
    // Hapus flex-md-row agar konten bisa mengalir ke bawah dari navbar atas
    <div className="container-fluid p-0 min-vh-100 d-flex flex-column" style={{ backgroundColor: '#FDF3EA' }}>
      <style>
        {`         
          .hover-bawah:hover { transform: translateY(5px); transition:0.5s all ease; }
          .hover-atas:hover { transform: translateY(-5px); transition:0.5s all ease; }
          .hover-shadow:hover { transform: scale(0.95); box-shadow: 0px 0px 0px black; transition: 0.3s all ease; }
          .border-neo { box-shadow: 7px 7px 0px black; }
          .hover-active:active { transform: scale(0.93); }
          .grafik-bar { transition: height 0.5s ease; cursor: pointer; }
          .grafik-bar:hover { background-color: #A16ED7 !important; }
        `}
      </style>

      {/* --- NAVBAR ATAS 3 KOLOM RESPONSIF --- */}
      <nav className="p-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 border-bottom border-dark border-5 sticky-top" style={{ backgroundColor: 'white', zIndex: 1000 }}>
        {/* Kolom 1: Logo */}
        <div className="d-flex align-items-center">
          <div className="border-4 border border-dark p-1 d-flex align-items-center justify-content-center border-neo" style={{ backgroundColor: '#4ECEC6' }}>
            <h2 className="m-0 font-monospcae fs-2 font-bold px-3">Angga</h2>
          </div>
        </div>

        {/* Kolom 2: Navigasi Home & Data Produk (Satu Kolom) */}
        <div className="d-flex gap-3">
          <a href="#dashboard" className="btn fw-bold text-dark border border-dark border-2 hover-atas text-decoration-none" style={{ backgroundColor: '#FEE86C', boxShadow: '4px 4px 0px black' }}>
            🏠 Home
          </a>
          <a href="#kelola-data" className="btn fw-bold text-dark border border-dark border-2 hover-atas text-decoration-none" style={{ backgroundColor: '#A16ED7', color: 'white', boxShadow: '4px 4px 0px black' }}>
            📦 Data Produk
          </a>
        </div>

        {/* Kolom 3: Pencarian & Notifikasi */}
        <div className="d-flex gap-2 align-items-center bg-info p-3 border border-dark border-2 w-100" style={{ boxShadow: '4px 4px 0px black', maxWidth: '350px' }}>
          <input type="text" className="border border-3 border-dark border-neo hover-shadow px-2 flex-grow-1" placeholder="🔍 Cari data..." style={{ border: 'none', backgroundColor: '#4ECEC6' }} />
          <button className="btn p-1 d-flex align-items-center justify-content-center border border-dark border-2" style={{ backgroundColor: '#4ECEC6' }}>
            🔔
          </button>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow-1 p-3">
        <div className="container">
          {/* awal section info (Selalu Tampil di Atas) */}
          <section id="dashboard" className="mb-4 pt-3">
            <div className="row g-4">
              <div className="col-12 col-md-4">
                <div className="bg-danger hover-shadow d-flex align-items-center justify-content-center flex-column border-neo border-shadow border border-4 border-dark text-white" style={{ height: '9rem' }}>
                  <h5 className="fw-bold">Total Jenis Produk</h5>
                  <p className="fs-1 fw-bold">{items.length}</p>
                </div>
              </div>
              <div className="col-12 col-md-4 ">
                <div className="hover-shadow border border-neo border-4 border-dark p-3 d-flex align-items-center flex-column justify-content-center " style={{ backgroundColor: '#4ECEC6', height: '9rem' }}>
                  <h5>Total Stok Tersedia</h5>
                  <p className="fw-bold fs-1">{totalStok}</p>
                </div>
              </div>
              <div className="col-12 col-md-4 ">
                <div className="hover-shadow border-neo border border-4 border-dark p-3 hover-bawah d-flex align-items-center justify-content-center flex-column" style={{ backgroundColor: '#FEE86C', height: '9rem' }}>
                  <h5>Total Estimasi Aset</h5>
                  <p className="fw-bold fs-3">{formatRupiah(totalPendapatan)}</p>
                </div>
              </div>
            </div>
          </section>
          {/* akhir section Info */}

          {/* STRUKTUR ROW MAIN & GRAFIK (DI-PERTANHANKAN PERSIS) */}
          <div className="row g-4 mb-4" id="form-section">
            {/* awal section Main (Form) */}
            <div className="col-12 col-md-8">
              <section>
                <div className="p-3 border-neo border border-4 border-dark hover-shadow" style={{ backgroundColor: '#A16ED7' }}>
                  <div className="hover-shadow bg-info border border-dark border-4 border-neo d-flex justify-content-center align-items-center m-0 p-2">
                    <h3 className="m-0 text-white fw-bold">{editId ? 'Ubah Data Produk' : 'Masukan Produk Baru'}</h3>
                  </div>
                  <div className=" p-4 bg-white mt-3 border border-dark border-3">
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3 mb-2">
                        {/* Form Inputs */}
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="fw-bold mb-1">Nama Produk</label>
                            <input
                              type="text"
                              name="nama"
                              className="form-control fs-5 fw-bold bg-light border-neo border border-3 border-dark hover-shadow"
                              placeholder="Contoh: Beras"
                              value={formData.nama}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="fw-bold mb-1">Harga (Rp)</label>
                            <input type="number" name="harga" className="form-control bg-light border-neo border border-3 border-dark hover-shadow" placeholder="Contoh: 12000" value={formData.harga} onChange={handleInputChange} required />
                          </div>
                          <div className="row">
                            <div className="col-6 mb-3">
                              <label className="fw-bold mb-1">Stok Tersedia</label>
                              <input type="number" name="stok" className="form-control bg-light border-neo border border-3 border-dark hover-shadow" placeholder="Contoh: 50" value={formData.stok} onChange={handleInputChange} required />
                            </div>
                            <div className="col-6 mb-3">
                              <label className="fw-bold mb-1">Diskon (%)</label>
                              <input type="number" name="diskon" className="form-control bg-light border-neo border border-3 border-dark hover-shadow" placeholder="Contoh: 10" value={formData.diskon} onChange={handleInputChange} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-3 mt-4">
                        <button
                          type="submit"
                          className="btn flex-grow-1 d-flex justify-content-center align-items-center gap-2 border-neo hover-shadow border border-dark border-3 hover-active fw-bold"
                          style={{ backgroundColor: '#4ECEC6' }}
                        >
                          {editId ? '✓ Simpan Perubahan' : '➕ Tambah Data'}
                        </button>
                        <button
                          type="button"
                          className="btn flex-grow-1 fw-bold bg-danger border-neo hover-shadow hover-active border border-3 border-dark text-white"
                          onClick={() => {
                            setEditId(null);
                            setFormData({ nama: '', harga: '', stok: '', diskon: '' });
                          }}
                        >
                          Batal / Reset
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
            {/* Akhir Section main */}

            {/* Section Grafik (Dipertahankan di Col-4 Sesuai Aslinya) */}
            <div className="col-12 col-md-4 mb-5">
              <div className="border-neo hover-shadow border border-dark border-4 d-flex flex-row justify-content-around align-items-end p-2" style={{ backgroundColor: '#4ECEC6', height: '23.4rem' }}>
                {/* LOGIKA GRAFIK DINAMIS */}
                {items.length > 0 ? (
                  items.map((item) => {
                    const tinggiPersen = Math.max((item.stok / maxStok) * 100, 5); // Tinggi min 5% agar bar tetap terlihat
                    return (
                      <div key={item.id} className="d-flex flex-column align-items-center w-100 h-100 justify-content-end" title={`${item.nama} - Stok: ${item.stok}`}>
                        <span className="fw-bold mb-1 bg-white px-1 border border-dark border-2" style={{ fontSize: '0.8rem' }}>
                          {item.stok}
                        </span>
                        <div className="grafik-bar border border-dark border-3 w-75 hover-atas" style={{ height: `${tinggiPersen}%`, backgroundColor: '#FEE86C' }}></div>
                        <span className="small fw-bold mt-2 text-truncate text-center w-100" style={{ fontSize: '0.7rem' }}>
                          {item.nama}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-100 h-100 d-flex justify-content-center align-items-center fw-bold">Belum ada stok.</div>
                )}
              </div>
            </div>
          </div>

          {/* Section List Daftar Produk */}
          <div className="row mb-5" id="kelola-data">
            <div className="col-12 col-md-12">
              <div>
                <div className="p-3 border-neo border border-4 border-dark" style={{ backgroundColor: '#FEE86C' }}>
                  <div className=" p-2 mb-4 bg-info border border-3 border-dark border-neo hover-shadow">
                    <h4 className="m-0 text-center fw-bold text-white">Daftar Produk Toko</h4>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {items.length > 0 ? (
                      items.map((item) => (
                        <div key={item.id} className=" p-3 bg-white border border-dark border-2" style={{ boxShadow: '5px 5px 0px black' }}>
                          <div className="d-flex gap-3 align-items-start">
                            <div className="bg-light p-2 d-flex align-items-center justify-content-center fs-4 border border-dark border-2" style={{ boxShadow: '5px 5px 0px black' }}>
                              💼
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="fw-bold m-0 text-black">
                                {item.nama}
                                {item.diskon > 0 && <span className="badge bg-danger ms-2 border border-dark">Diskon {item.diskon}%</span>}
                              </h5>

                              <div className="mt-2 d-flex align-items-center gap-2">
                                {item.diskon > 0 ? (
                                  <>
                                    <span className="text-decoration-line-through text-muted small">{formatRupiah(item.harga)}</span>
                                    <span className="fw-bold text-success fs-6">{formatRupiah(hitungDiskon(item.harga, item.diskon))}</span>
                                  </>
                                ) : (
                                  <span className="fw-bold text-dark fs-6">{formatRupiah(item.harga)}</span>
                                )}
                              </div>
                              <p className="mb-2 text-primary fw-bold small mt-1">Stok Tersedia: {item.stok} Pcs</p>

                              <div className="d-flex gap-2 mt-3">
                                <button onClick={() => handleEdit(item)} className="btn btn-sm flex-grow-1 bg-warning hover-atas fw-bold border border-dark border-2" style={{ boxShadow: '4px 4px 0px black' }}>
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="hover-atas btn neo-btn btn-danger py-1 px-2 btn-sm flex-grow-1 text-white neo-btn-dark fw-bold border border-dark border-2"
                                  style={{ boxShadow: '4px 4px 0px black' }}
                                >
                                  Del
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white border border-dark border-3 p-5 text-center" style={{ boxShadow: '5px 5px 0px black' }}>
                        <h5 className="fw-bold">Tidak ada produk ditemukan</h5>
                        <p className="small mb-0">Gunakan form di atas untuk menambah produk baru.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className='d-flex align-items-center justify-content-center border- border-dark border-3 border-neo' style={{height:'4rem', backgroundColor:'#A16ED7'}}>
          <p className='m-0 font-monospace fw-bold'>CopyRight By Angga</p>
        </div>
      </main>
    </div>
  );
}
