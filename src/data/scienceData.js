export const CATEGORIES = [
  {
    id: 'fisika',
    name: 'Fisika',
    icon: 'atom',
    desc: 'Gaya, Energi, Gravitasi, Kalor, dan Rangkaian Listrik',
  },
  {
    id: 'kimia',
    name: 'Kimia',
    icon: 'flask',
    desc: 'Struktur Atom, Skala pH Asam-Basa, dan Reaksi Redoks',
  },
  {
    id: 'biologi',
    name: 'Biologi',
    icon: 'dna',
    desc: 'Struktur Sel, Fotosintesis Hutan Tropis, dan Sistem Sirkulasi',
  },
  {
    id: 'astronomi',
    name: 'Astronomi',
    icon: 'planet',
    desc: 'Tata Surya, Hukum Kepler, Gerhana, dan Evolusi Bintang',
  },
];

export const LESSONS = [
  // FISIKA
  {
    id: 'fis-1',
    kategori: 'fisika',
    judul: 'Hukum Gravitasi & Jatuh Bebas',
    tingkatKesulitan: 'Pemula',
    deskripsi: 'Pelajari bagaimana gaya tarik bumi mempengaruhi gerak benda jatuh di sekitar kita.',
    konten: `
      <p><strong>Gerak Jatuh Bebas (GJB)</strong> adalah gerak lurus berubah beraturan (GLBB) di mana suatu benda jatuh dari ketinggian tertentu tanpa kecepatan awal (<span class="math-inline">v<sub>0</sub> = 0</span>) dan hanya dipengaruhi oleh percepatan gravitasi (<span class="math-inline">g</span>).</p>
      <p><strong>Konteks Khatulistiwa Indonesia:</strong> Nilai percepatan gravitasi rata-rata di permukaan bumi adalah sekitar <span class="math-inline">9.8 m/s<sup>2</sup></span>. Di kawasan Khatulistiwa seperti Sumatra dan Kalimantan, efek sentrifugal rotasi bumi membuat nilai <span class="math-inline">g</span> sedikit lebih kecil dibandingkan di kawasan kutub.</p>
      <div class="formula-box">v = g · t &nbsp;|&nbsp; h = ½ · g · t<sup>2</sup> &nbsp;|&nbsp; t = √(2h / g)</div>
      <ul>
        <li>Kecepatan sesaat setelah jatuh selama <span class="math-inline">t</span> detik: <span class="math-inline">v = g · t</span></li>
        <li>Ketinggian atau jarak tempuh vertikal: <span class="math-inline">h = ½ · g · t<sup>2</sup></span></li>
        <li>Waktu tempuh hingga menyentuh permukaan: <span class="math-inline">t = √(2h / g)</span></li>
      </ul>
    `,
    svgType: 'gravity',
    quizzes: [
      {
        id: 'q-fis-1a',
        pertanyaan: 'Jika sebuah kelapa jatuh dari pohon di Riau tanpa kecepatan awal dan membutuhkan waktu 2 detik untuk menyentuh tanah (g = 9.8 m/s²), berapakah tinggi pohon tersebut?',
        pilihan: ['9.8 meter', '19.6 meter', '39.2 meter', '4.9 meter'],
        jawabanBenar: 1,
        penjelasan: 'Menggunakan rumus h = ½ · g · t² = ½ × 9.8 × (2²) = 4.9 × 4 = 19.6 meter.',
        poin: 25,
      },
      {
        id: 'q-fis-1b',
        pertanyaan: 'Apakah massa benda mempengaruhi kecepatan jatuh benda dalam ruang hampa udara?',
        pilihan: [
          'Ya, benda lebih berat selalu jatuh lebih cepat',
          'Tidak, semua benda jatuh dengan percepatan sama',
          'Ya, tetapi tergantung bentuk benda',
          'Hanya berpengaruh jika ada angin',
        ],
        jawabanBenar: 1,
        penjelasan: 'Dalam ruang hampa tanpa hambatan udara, percepatan gravitasi g bekerja sama pada semua benda tanpa memedulikan massanya.',
        poin: 20,
      },
    ],
  },
  {
    id: 'fis-2',
    kategori: 'fisika',
    judul: 'Hukum Ohm & Rangkaian Listrik Seri',
    tingkatKesulitan: 'Menengah',
    deskripsi: 'Memahami hubungan antara Tegangan (V), Arus (I), dan Hambatan (R) dalam aliran listrik.',
    konten: `
      <p><strong>Hukum Ohm</strong> menyatakan bahwa arus listrik (<span class="math-inline">I</span>) yang mengalir melalui suatu penghantar berbanding lurus dengan beda potensial atau tegangan (<span class="math-inline">V</span>) dan berbanding terbalik dengan hambatan (<span class="math-inline">R</span>).</p>
      <div class="formula-box">V = I × R &nbsp;|&nbsp; I = V / R &nbsp;|&nbsp; P = V × I</div>
      <p>Dalam <strong>Rangkaian Seri</strong>, arus listrik (<span class="math-inline">I</span>) yang mengalir pada setiap komponen bernilai sama, sedangkan tegangan total merupakan penjumlahan dari tegangan tiap komponen (<span class="math-inline">V<sub>total</sub> = V<sub>1</sub> + V<sub>2</sub></span>). Jika satu titik terputus, seluruh aliran arus berhenti.</p>
    `,
    svgType: 'circuit',
    quizzes: [
      {
        id: 'q-fis-2a',
        pertanyaan: 'Sebuah baterai 12 Volt dihubungkan dengan lampu berhambatan 4 Ohm. Berapakah kuat arus listrik yang mengalir?',
        pilihan: ['3 Ampere', '48 Ampere', '0.33 Ampere', '8 Ampere'],
        jawabanBenar: 0,
        penjelasan: 'Sesuai Hukum Ohm: I = V / R = 12 / 4 = 3 Ampere.',
        poin: 25,
      },
      {
        id: 'q-fis-2b',
        pertanyaan: 'Apa yang terjadi pada total hambatan (R) jika dua resistor dihubungkan secara seri?',
        pilihan: [
          'Hambatan total menjadi lebih kecil',
          'Hambatan total merupakan penjumlahan keduanya (R₁ + R₂)',
          'Hambatan total menjadi nol',
          'Hambatan total menjadi separuhnya',
        ],
        jawabanBenar: 1,
        penjelasan: 'Pada rangkaian seri, hambatan total (R_total) adalah penjumlahan seluruh resistor dalam jalur tunggal tersebut (R₁ + R₂ + ...).',
        poin: 20,
      },
    ],
  },
  {
    id: 'fis-3',
    kategori: 'fisika',
    judul: 'Hukum Termodinamika & Kalor',
    tingkatKesulitan: 'Lanjutan',
    deskripsi: 'Konsep perpindahan energi panas dan perubahan suhu zat dalam kehidupan sehari-hari.',
    konten: `
      <p><strong>Kalor (<span class="math-inline">Q</span>)</strong> adalah bentuk energi yang berpindah dari benda bersuhu lebih tinggi ke benda bersuhu lebih rendah. Jumlah kalor untuk menaikkan suhu zat bergantung pada massa (<span class="math-inline">m</span>), kalor jenis (<span class="math-inline">c</span>), dan perubahan suhu (<span class="math-inline">ΔT</span>).</p>
      <div class="formula-box">Q = m · c · ΔT &nbsp;|&nbsp; Q<sub>lepas</sub> = Q<sub>terima</sub></div>
      <p><strong>Asas Black</strong> menyatakan bahwa dalam sistem tertutup, kalor yang dilepas oleh benda bersuhu tinggi sama dengan kalor yang diterima oleh benda bersuhu rendah hingga tercapai kesetimbangan termal.</p>
    `,
    svgType: 'thermo',
    quizzes: [
      {
        id: 'q-fis-3a',
        pertanyaan: 'Air sebanyak 1 kg (c = 4200 J/kg°C) dipanaskan dari 25°C hingga 75°C. Berapa kalor yang dibutuhkan?',
        pilihan: ['210.000 Joule', '105.000 Joule', '420.000 Joule', '315.000 Joule'],
        jawabanBenar: 0,
        penjelasan: 'Q = m · c · ΔT = 1 × 4200 × (75 − 25) = 4200 × 50 = 210.000 Joule.',
        poin: 25,
      },
    ],
  },

  // KIMIA
  {
    id: 'kim-1',
    kategori: 'kimia',
    judul: 'Struktur Atom & Tabel Periodik',
    tingkatKesulitan: 'Pemula',
    deskripsi: 'Mengenal partikel subatomik (Proton, Neutron, Elektron) dan tata letak unsur kimia.',
    konten: `
      <p>Atom tersusun atas inti atom yang memuat <strong>Proton</strong> (bermuatan positif) dan <strong>Neutron</strong> (netral), serta dikelilingi oleh <strong>Elektron</strong> (bermuatan negatif) pada kulit-kulit energi tertentu.</p>
      <div class="formula-box">Nomor Atom (Z) = Jumlah Proton &nbsp;|&nbsp; Nomor Massa (A) = Proton + Neutron</div>
      <p>Pada atom netral, jumlah elektron sama dengan jumlah proton. Selisih antara Nomor Massa (<span class="math-inline">A</span>) dan Nomor Atom (<span class="math-inline">Z</span>) menghasilkan jumlah neutron di dalam inti atom.</p>
    `,
    svgType: 'atom',
    quizzes: [
      {
        id: 'q-kim-1a',
        pertanyaan: 'Atom Natrium (Na) memiliki nomor atom 11 dan nomor massa 23. Berapakah jumlah neutron dalam atom Natrium?',
        pilihan: ['11', '12', '23', '34'],
        jawabanBenar: 1,
        penjelasan: 'Jumlah Neutron = Nomor Massa (A) − Nomor Atom (Z) = 23 − 11 = 12.',
        poin: 25,
      },
      {
        id: 'q-kim-1b',
        pertanyaan: 'Partikel subatomik mana yang mengelilingi inti atom pada tingkat energi tertentu?',
        pilihan: ['Proton', 'Neutron', 'Elektron', 'Positron'],
        jawabanBenar: 2,
        penjelasan: 'Elektron mengelilingi inti atom pada kulit-kulit elektron dengan tingkat energi diskrit.',
        poin: 20,
      },
    ],
  },
  {
    id: 'kim-2',
    kategori: 'kimia',
    judul: 'Skala pH, Asam, dan Basa',
    tingkatKesulitan: 'Menengah',
    deskripsi: 'Karakteristik larutan asam dan basa dalam produk sehari-hari seperti jeruk dan sabun.',
    konten: `
      <p>Skala <strong>pH (Potential of Hydrogen)</strong> mengukur tingkat keasaman atau kebasaan suatu larutan dari rentang 0 hingga 14:</p>
      <ul>
        <li><strong>pH &lt; 7:</strong> Larutan Asam (melepaskan ion <span class="math-inline">H<sup>+</sup></span>). Contoh: air perasan jeruk nipis (pH ~2).</li>
        <li><strong>pH = 7:</strong> Larutan Netral. Contoh: air murni pada suhu 25°C.</li>
        <li><strong>pH &gt; 7:</strong> Larutan Basa (melepaskan ion <span class="math-inline">OH<sup>−</sup></span>). Contoh: larutan sabun dan detergen (pH ~10–12).</li>
      </ul>
    `,
    svgType: 'phscale',
    quizzes: [
      {
        id: 'q-kim-2a',
        pertanyaan: 'Kertas lakmus biru dicelupkan ke dalam larutan asam jawa. Warna kertas lakmus akan berubah menjadi...',
        pilihan: ['Biru Tua', 'Merah', 'Hijau', 'Kuning'],
        jawabanBenar: 1,
        penjelasan: 'Larutan bersifat asam mengubah warna kertas lakmus biru menjadi merah.',
        poin: 25,
      },
      {
        id: 'q-kim-2b',
        pertanyaan: 'Berapakah nilai pH untuk air murni pada suhu kamar (25°C)?',
        pilihan: ['pH 0', 'pH 7', 'pH 14', 'pH 1'],
        jawabanBenar: 1,
        penjelasan: 'Air murni bersifat netral dengan nilai pH tepat 7.',
        poin: 20,
      },
    ],
  },
  {
    id: 'kim-3',
    kategori: 'kimia',
    judul: 'Reaksi Redoks & Pengkaratan Logam',
    tingkatKesulitan: 'Lanjutan',
    deskripsi: 'Reaksi Oksidasi dan Reduksi dalam kehidupan seperti korosi jembatan baja.',
    konten: `
      <p><strong>Reaksi Redoks</strong> merupakan gabungan dua proses simultan: <strong>Oksidasi</strong> (pelepasan elektron atau kenaikan bilangan oksidasi) dan <strong>Reduksi</strong> (penangkapan elektron atau penurunan bilangan oksidasi).</p>
      <div class="formula-box">4Fe + 3O<sub>2</sub> + 2nH<sub>2</sub>O → 2Fe<sub>2</sub>O<sub>3</sub>·nH<sub>2</sub>O (Karat Besi)</div>
      <p><strong>Pengkaratan Besi (<span class="math-inline">Fe</span>):</strong> Terjadi ketika besi teroksidasi oleh oksigen (<span class="math-inline">O<sub>2</sub></span>) dengan bantuan kelembapan air (<span class="math-inline">H<sub>2</sub>O</span>) membentuk oksida besi terhidrasi.</p>
    `,
    svgType: 'redox',
    quizzes: [
      {
        id: 'q-kim-3a',
        pertanyaan: 'Pada reaksi pengkaratan besi, peristiwa apa yang dialami oleh atom Besi (Fe)?',
        pilihan: [
          'Reduksi (Menangkap elektron)',
          'Oksidasi (Melepas elektron & mengikat oksigen)',
          'Netralisasi',
          'Sublimasi',
        ],
        jawabanBenar: 1,
        penjelasan: 'Besi mengalami oksidasi dari bilangan oksidasi 0 menjadi +3 saat bereaksi dengan oksigen dan air.',
        poin: 25,
      },
    ],
  },

  // BIOLOGI
  {
    id: 'bio-1',
    kategori: 'biologi',
    judul: 'Struktur Sel Tumbuhan & Hewan',
    tingkatKesulitan: 'Pemula',
    deskripsi: 'Unit terkecil kehidupan: Membran sel, Dinding sel, Kloroplas, dan Mitokondria.',
    konten: `
      <p>Sel adalah unit struktural dan fungsional terkecil dari makhluk hidup. Perbedaan utama antara sel tumbuhan dan sel hewan terletak pada organel khasnya:</p>
      <ul>
        <li><strong>Sel Tumbuhan:</strong> Memiliki <em>Dinding Sel</em> kaku dari selulosa, vakuola besar, dan <em>Kloroplas</em> untuk fotosintesis.</li>
        <li><strong>Sel Hewan:</strong> Tidak memiliki dinding sel kaku maupun kloroplas, namun memiliki <em>Sentriol</em> yang berperan dalam pembelahan sel.</li>
      </ul>
      <p><strong>Mitokondria</strong> berperan sebagai pusat respirasi seluler penghasil energi (ATP) pada sel tumbuhan maupun sel hewan.</p>
    `,
    svgType: 'cell',
    quizzes: [
      {
        id: 'q-bio-1a',
        pertanyaan: 'Organel sel tumbuhan yang mengandung pigmen klorofil dan berfungsi menangkap cahaya matahari adalah...',
        pilihan: ['Mitokondria', 'Kloroplas', 'Ribosom', 'Badan Golgi'],
        jawabanBenar: 1,
        penjelasan: 'Kloroplas mengandung pigmen klorofil untuk melangsungkan proses fotosintesis.',
        poin: 25,
      },
      {
        id: 'q-bio-1b',
        pertanyaan: 'Mengapa batang tumbuhan berpembuluh terasa lebih kaku dibandingkan jaringan hewan?',
        pilihan: [
          'Karena memiliki membran sel tebal',
          'Karena sel tumbuhan memiliki Dinding Sel dari selulosa',
          'Karena mengandung banyak air',
          'Karena tumbuhan tidak memiliki pembuluh darah',
        ],
        jawabanBenar: 1,
        penjelasan: 'Dinding sel kaku yang tersusun atas serat selulosa memberikan bentuk kokoh dan perlindungan mekanis pada tumbuhan.',
        poin: 20,
      },
    ],
  },
  {
    id: 'bio-2',
    kategori: 'biologi',
    judul: 'Fotosintesis & Ekosistem Hutan Tropis',
    tingkatKesulitan: 'Menengah',
    deskripsi: 'Bagaimana hutan hujan tropis Indonesia menghasilkan oksigen bagi bumi.',
    konten: `
      <p><strong>Fotosintesis</strong> adalah proses anabolisme pembentukan glukosa (<span class="math-inline">C<sub>6</sub>H<sub>12</sub>O<sub>6</sub></span>) dari karbon dioksida (<span class="math-inline">CO<sub>2</sub></span>) dan air (<span class="math-inline">H<sub>2</sub>O</span>) dengan bantuan energi cahaya matahari.</p>
      <div class="formula-box">6CO<sub>2</sub> + 6H<sub>2</sub>O + Cahaya → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub></div>
      <p>Hutan hujan tropis di Kalimantan, Sumatra, dan Papua merupakan penyerap karbon alami utama dunia sekaligus penghasil oksigen vital melalui reaksi terang di membran tilakoid dan siklus Calvin di stroma kloroplas.</p>
    `,
    svgType: 'photosynthesis',
    quizzes: [
      {
        id: 'q-bio-2a',
        pertanyaan: 'Gas apakah yang dihasilkan oleh tumbuhan sebagai produk sampingan dari proses fotosintesis?',
        pilihan: ['Karbon Dioksida (CO₂)', 'Oksigen (O₂)', 'Nitrogen (N₂)', 'Metana (CH₄)'],
        jawabanBenar: 1,
        penjelasan: 'Proses fotosintesis menghasilkan glukosa sebagai cadangan energi dan melepaskan gas Oksigen (O₂) ke atmosfer.',
        poin: 25,
      },
      {
        id: 'q-bio-2b',
        pertanyaan: 'Di manakah reaksi terang fotosintesis terjadi dalam kloroplas?',
        pilihan: ['Stroma', 'Membran Tilakoid', 'Matriks Mitokondria', 'Inti Sel'],
        jawabanBenar: 1,
        penjelasan: 'Reaksi terang yang menangkap energi foton cahaya matahari terjadi pada membran tilakoid (tumpukan grana).',
        poin: 20,
      },
    ],
  },
  {
    id: 'bio-3',
    kategori: 'biologi',
    judul: 'Sistem Peredaran Darah Manusia',
    tingkatKesulitan: 'Lanjutan',
    deskripsi: 'Jantung, pembuluh darah vena/arteri, dan transportasi sel darah merah.',
    konten: `
      <p>Sistem peredaran darah manusia merupakan <strong>sistem tertutup dan ganda</strong>. Jantung terdiri atas 4 ruang: Atrium Kanan, Atrium Kiri, Ventrikel Kanan, dan Ventrikel Kiri.</p>
      <ul>
        <li><strong>Arteri (Pembuluh Nadi):</strong> Mengalirkan darah keluar dari jantung menuju organ tubuh (membawa darah kaya <span class="math-inline">O<sub>2</sub></span>, kecuali arteri pulmonalis).</li>
        <li><strong>Vena (Pembuluh Balik):</strong> Mengalirkan darah kaya <span class="math-inline">CO<sub>2</sub></span> kembali menuju jantung.</li>
      </ul>
    `,
    svgType: 'heart',
    quizzes: [
      {
        id: 'q-bio-3a',
        pertanyaan: 'Ruang jantung manakah yang memompa darah kaya oksigen ke seluruh tubuh melalui pembuluh aorta?',
        pilihan: ['Atrium Kanan', 'Ventrikel Kanan', 'Ventrikel Kiri', 'Atrium Kiri'],
        jawabanBenar: 2,
        penjelasan: 'Ventrikel (Bilik) Kiri memiliki dinding otot paling tebal untuk memompa darah kaya O₂ ke seluruh tubuh melalui aorta.',
        poin: 25,
      },
    ],
  },

  // ASTRONOMI
  {
    id: 'ast-1',
    kategori: 'astronomi',
    judul: 'Sistem Tata Surya & Gerak Orbit',
    tingkatKesulitan: 'Pemula',
    deskripsi: 'Urutan 8 planet dan hukum Kepler yang mengatur lintasan elips planet.',
    konten: `
      <p>Tata Surya kita berpusat pada Matahari dengan 8 planet utama: Merkurius, Venus, Bumi, Mars, Yupiter, Saturnus, Uranus, dan Neptunus.</p>
      <div class="formula-box">Hukum I Kepler: Orbit planet berbentuk elips · Hukum III Kepler: T<sup>2</sup> ∝ a<sup>3</sup></div>
      <p>Planet yang berada lebih dekat dengan Matahari mengalami gaya gravitasi yang lebih kuat sehingga bergerak dengan kecepatan orbit lebih tinggi dan memiliki periode revolusi lebih singkat.</p>
    `,
    svgType: 'solar',
    quizzes: [
      {
        id: 'q-ast-1a',
        pertanyaan: 'Manakah planet terbesar di Tata Surya yang tergolong dalam planet raksasa gas (Gas Giant)?',
        pilihan: ['Mars', 'Saturnus', 'Yupiter', 'Neptunus'],
        jawabanBenar: 2,
        penjelasan: 'Yupiter adalah planet terbesar di Tata Surya dengan diameter sekitar 11 kali diameter Bumi.',
        poin: 25,
      },
      {
        id: 'q-ast-1b',
        pertanyaan: 'Planet manakah yang memiliki waktu revolusi (mengelilingi matahari) paling singkat?',
        pilihan: ['Bumi', 'Merkurius', 'Venus', 'Mars'],
        jawabanBenar: 1,
        penjelasan: 'Merkurius berada paling dekat dengan Matahari, sehingga memiliki lintasan dan periode revolusi paling singkat (~88 hari Bumi).',
        poin: 20,
      },
    ],
  },
  {
    id: 'ast-2',
    kategori: 'astronomi',
    judul: 'Fase Bulan & Gerhana (Eclipse)',
    tingkatKesulitan: 'Menengah',
    deskripsi: 'Bagaimana posisi Matahari, Bumi, dan Bulan menciptakan gerhana dan pasang surut laut.',
    konten: `
      <p>Bulan mengorbit Bumi selama ~29.5 hari (bulan sinodis). Perubahan sudut iluminasi Matahari terhadap Bulan menghasilkan siklus <strong>Fase Bulan</strong> dari Bulan Baru hingga Bulan Purnama.</p>
      <ul>
        <li><strong>Gerhana Matahari:</strong> Terjadi saat Bulan berada tepat di antara Matahari dan Bumi (Matahari – Bulan – Bumi).</li>
        <li><strong>Gerhana Bulan:</strong> Terjadi saat Bumi berada tepat di antara Matahari dan Bulan (Matahari – Bumi – Bulan).</li>
      </ul>
    `,
    svgType: 'eclipse',
    quizzes: [
      {
        id: 'q-ast-2a',
        pertanyaan: 'Pada gerhana matahari total, bagian Bumi terkena bayangan inti Bulan yang paling gelap yang disebut...',
        pilihan: ['Penumbra', 'Umbra', 'Corona', 'Chromosphere'],
        jawabanBenar: 1,
        penjelasan: 'Umbra adalah bayangan inti yang paling gelap; wilayah Bumi yang dilintasi umbra mengalami gerhana matahari total.',
        poin: 25,
      },
      {
        id: 'q-ast-2b',
        pertanyaan: 'Fase Bulan manakah yang menyebabkan terjadinya pasang air laut tertinggi (Pasang Purnama)?',
        pilihan: [
          'Bulan Sabit & Seperempat',
          'Bulan Baru & Bulan Purnama',
          'Bulan Cembung saja',
          'Fase Bulan Kuartal',
        ],
        jawabanBenar: 1,
        penjelasan: 'Saat Bulan Baru dan Bulan Purnama, gaya tarik gravitasi Matahari dan Bulan berada dalam satu garis lurus sehingga menghasilkan pasang maksimum.',
        poin: 20,
      },
    ],
  },
  {
    id: 'ast-3',
    kategori: 'astronomi',
    judul: 'Evolusi Bintang & Lubang Hitam',
    tingkatKesulitan: 'Lanjutan',
    deskripsi: 'Siklus hidup bintang dari Nebula hingga peristiwa Supernova.',
    konten: `
      <p>Bintang lahir dari keruntuhan gravitasi awan gas dan debu antarbintang yang disebut <strong>Nebula</strong>. Energi bintang dipancarkan oleh reaksi <strong>Fusi Nuklir</strong> yang menggabungkan inti hidrogen menjadi helium pada suhu jutaan Kelvin.</p>
      <div class="formula-box">4 <sup>1</sup>H → <sup>4</sup>He + 2e<sup>+</sup> + 2ν<sub>e</sub> + Energi</div>
      <p>Bintang bermassa sangat besar mengakhiri hidupnya dalam ledakan dahsyat <strong>Supernova</strong>, meninggalkan inti padat berupa Bintang Neutron atau <strong>Lubang Hitam (Black Hole)</strong>.</p>
    `,
    svgType: 'star',
    quizzes: [
      {
        id: 'q-ast-3a',
        pertanyaan: 'Reaksi nuklir apakah yang memancarkan energi dahsyat pada inti Matahari dan bintang-bintang?',
        pilihan: [
          'Fisi Nuklir (Pembelahan)',
          'Fusi Nuklir (Penggabungan inti Hidrogen)',
          'Pembakaran Oksigen',
          'Peluruhan Radioaktif Alpha',
        ],
        jawabanBenar: 1,
        penjelasan: 'Fusi Nuklir menggabungkan inti Hidrogen menjadi inti Helium sambil melepaskan energi panas dan radiasi cahaya yang sangat besar.',
        poin: 25,
      },
    ],
  },
];

export const TOTAL_QUIZ_COUNT = LESSONS.reduce((sum, lesson) => sum + lesson.quizzes.length, 0);

export const DEMO_LEADERBOARD = [
  { name: 'Ayu Kartika', level: 5, xp: 480, totalPoin: 380, title: 'Master Fisika' },
  { name: 'Budi Santoso', level: 4, xp: 350, totalPoin: 290, title: 'Penjelajah Galaksi' },
  { name: 'Citra Dewi', level: 3, xp: 280, totalPoin: 220, title: 'Pakar Kimia' },
  { name: 'Doni Pratama', level: 3, xp: 210, totalPoin: 175, title: 'Pengamat Biologi' },
  { name: 'Eka Wijaya', level: 2, xp: 140, totalPoin: 110, title: 'Siswa Rajin' },
];

export const ACHIEVEMENTS = [
  {
    id: 'b-first-quiz',
    nama: 'Langkah Pertama',
    deskripsi: 'Selesaikan 1 kuis sains pertama Anda dengan tepat.',
    icon: 'footprints',
    syarat: 'Selesaikan 1 kuis',
  },
  {
    id: 'b-physics-master',
    nama: 'Ahli Fisika',
    deskripsi: 'Selesaikan seluruh 3 modul pembelajaran Fisika.',
    icon: 'atom',
    syarat: '3/3 modul Fisika',
  },
  {
    id: 'b-chem-master',
    nama: 'Alkemis Kimia',
    deskripsi: 'Selesaikan seluruh 3 modul pembelajaran Kimia.',
    icon: 'flask',
    syarat: '3/3 modul Kimia',
  },
  {
    id: 'b-bio-master',
    nama: 'Bio Explorer',
    deskripsi: 'Selesaikan seluruh 3 modul pembelajaran Biologi.',
    icon: 'dna',
    syarat: '3/3 modul Biologi',
  },
  {
    id: 'b-astro-master',
    nama: 'Penjelajah Antariksa',
    deskripsi: 'Selesaikan seluruh 3 modul pembelajaran Astronomi.',
    icon: 'planet',
    syarat: '3/3 modul Astronomi',
  },
  {
    id: 'b-score-100',
    nama: 'Cendekia Sains',
    deskripsi: 'Kumpulkan minimal 200 poin dari kuis dan tantangan.',
    icon: 'crown',
    syarat: 'Minimal 200 PTS',
  },
];

export const PREMIUM_PLAN = {
  id: 'premium_achievements',
  name: 'ScienceQuest Premium',
  priceIdr: 1,
  priceLabel: 'Rp 1',
  subtitle: 'Paket Uji Coba · Akses Penuh Tab Pencapaian',
  features: [
    'Membuka akses penuh ke tab Lencana Pencapaian Sains (6 lencana)',
    'Pantau progres dan syarat kelulusan setiap kategori sains',
    'Status keanggotaan Premium & riwayat QRIS tersimpan permanen di Firebase',
  ],
};

export const DAILY_CHALLENGES = [
  'Uji pengaruh percepatan gravitasi Bulan dan Bumi pada Lab Simulasi, lalu selesaikan 1 kuis Fisika.',
  'Pelajari reaksi fotosintesis atau struktur sel di modul Biologi dan raih poin tambahan hari ini.',
  'Eksperimen dengan tegangan baterai dan resistor di Lab Rangkaian Listrik Seri untuk mengamati Hukum Ohm.',
  'Bandingkan periode revolusi planet dalam dan luar pada Simulasi Orbit Tata Surya.',
];

export const SOLAR_PLANETS = [
  { id: 'merkurius', name: 'Merkurius', radiusPx: 38, speed: 4.15, color: '#94a3b8', size: 4, distanceAu: '0.39 AU', period: '88 Hari', gravity: '3.7 m/s²' },
  { id: 'venus', name: 'Venus', radiusPx: 58, speed: 1.62, color: '#fde047', size: 6, distanceAu: '0.72 AU', period: '225 Hari', gravity: '8.9 m/s²' },
  { id: 'bumi', name: 'Bumi', radiusPx: 82, speed: 1.0, color: '#38bdf8', size: 6.5, distanceAu: '1.00 AU', period: '365 Hari', gravity: '9.8 m/s²' },
  { id: 'mars', name: 'Mars', radiusPx: 106, speed: 0.53, color: '#f87171', size: 5, distanceAu: '1.52 AU', period: '687 Hari', gravity: '3.7 m/s²' },
  { id: 'yupiter', name: 'Yupiter', radiusPx: 142, speed: 0.24, color: '#fdba74', size: 11, distanceAu: '5.20 AU', period: '11.9 Tahun', gravity: '24.8 m/s²' },
  { id: 'saturnus', name: 'Saturnus', radiusPx: 178, speed: 0.14, color: '#fcd34d', size: 9, hasRing: true, distanceAu: '9.58 AU', period: '29.5 Tahun', gravity: '10.4 m/s²' },
];

export const SPEC_SECTIONS = [
  {
    title: '1. Arsitektur Produksi (Vite + Vanilla JS + HTML5 + CSS3)',
    body: `
      <p>Aplikasi ditransformasikan dari prototipe monolitik satu berkas HTML menjadi arsitektur modular berbasis <strong>ES Modules</strong> yang dibundel oleh Vite tanpa ketergantungan framework eksternal atau CDN.</p>
      <ul>
        <li><code>src/state/store.js</code> — Manajemen state terpusat dengan pola pub/sub dan persistensi <code>localStorage</code>.</li>
        <li><code>src/data/scienceData.js</code> — Basis data terstruktur berisi 4 kategori, 12 modul, 20 soal kuis, dan 6 lencana pencapaian.</li>
        <li><code>src/simulations/*.js</code> — Mesin simulasi HTML5 Canvas terpisah untuk Gravitasi, Tata Surya, dan Hukum Ohm.</li>
        <li><code>src/styles/tokens.css &amp; main.css</code> — Sistem desain CSS3 modular dengan variabel tema, tata letak responsif, dan dukungan aksesibilitas.</li>
      </ul>
    `,
  },
  {
    title: '2. Perbaikan Bug & Peningkatan dari Prototipe',
    body: `
      <table class="spec-table">
        <thead>
          <tr><th>Area</th><th>Temuan di Prototipe</th><th>Solusi Production-Ready</th></tr>
        </thead>
        <tbody>
          <tr><td>Kuis Multi-Soal</td><td>Hanya merender <code>quizzes[0]</code> sehingga 8 soal kedua tidak pernah bisa diakses (maks 12/20).</td><td>Quiz Runner bertahap lengkap (Soal 1..N) dengan navigasi soal &amp; pelacakan skor penuh 20/20.</td></tr>
          <tr><td>Notasi Matematika</td><td>Sintaks mentah <code>$...$</code> dan <code>\\frac</code> tampil apa adanya di layar.</td><td>Konversi ke markup semantik HTML5 (<code>&lt;sup&gt;</code>, <code>&lt;sub&gt;</code>, <code>.formula-box</code>) yang bersih.</td></tr>
          <tr><td>Simulasi Gravitasi</td><td>Tinggi jatuh pada slider tidak memetakan lintasan fisik maupun radius dinamis benda.</td><td>Kinematika akurat <span class="math-inline">y = ½gt²</span> terkalibrasi pada penggaris meter Canvas &amp; telemetri langsung.</td></tr>
          <tr><td>Diagram Materi</td><td>9 dari 12 modul hanya menampilkan teks fallback generik.</td><td>12 diagram ilmiah SVG khusus untuk seluruh topik Fisika, Kimia, Biologi, dan Astronomi.</td></tr>
          <tr><td>Dialog &amp; Aset</td><td>Memakai <code>window.confirm()</code> &amp; CDN eksternal (Tailwind, Phosphor, Confetti).</td><td>Modal konfirmasi aksesibel, ikon SVG internal, Canvas confetti lokal, dan edit nama profil.</td></tr>
        </tbody>
      </table>
    `,
  },
  {
    title: '3. Mekanisme Gamifikasi & Anti-Exploit',
    body: `
      <ul>
        <li><strong>Poin &amp; XP Tunggal per Kuis:</strong> Setiap ID kuis hanya memberikan poin dan XP pada jawaban benar pertama kali (tercatat dalam <code>kuisSelesai</code>).</li>
        <li><strong>Penyelesaian Modul:</strong> Modul ditandai selesai otomatis setelah seluruh soal kuis pada modul tersebut terjawab benar.</li>
        <li><strong>Leveling Progresif:</strong> Setiap kelipatan 100 XP menaikkan level pelajar dan memperbarui gelar ilmuwan secara otomatis.</li>
      </ul>
    `,
  },
];
