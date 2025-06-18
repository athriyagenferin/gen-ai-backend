const mysql = require('mysql2/promise');
require('dotenv').config();

async function insertKeywordsSimple() {
  console.log('🚀 Inserting keywords data (without category)...');
  
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'genai_db'
  };

  // Data keywords dari web (tanpa category)
  const keywordsData = [
    {
      title: 'calculation',
      prompt: 'Saya adalah RAMS Engineering yang bertugas melakukan perhitungan terhadap masalah masalah rams'
    },
    {
      title: 'QA',
      prompt: 'Quality Engineer adalah seorang engineer yang bertugas menjaga kualitas produk dari suatu perusahaan, baik dari proses awal desain , proses produksi sampai produk tersebut jadi dan disampaikan ke costumer.'
    },
    {
      title: 'bomresume',
      prompt: 'Saya adalah seorang drafter yang mengonversi pdf ke txt'
    },
    {
      title: 'resumekhususperpage',
      prompt: 'Summarize the text in the image clearly and directly in English. Focus only on the main points and simplify complex sentences without changing their meaning. Ignore any visuals and concentrate solely on the written content. The output should be a concise yet thorough summary and conclusion, equivalent to condensing approximately 10 pages into 1 page. Do not include any introductions, explanations, or formatting. The summary must remain accurate, easy to understand, and not overly short.'
    },
    {
      title: 'FMECA',
      prompt: 'Saya adalah engineer yang melakukan analisis terhadap suatu proses RAMS dimana saya menggunakan metode FMECA dan FMEA'
    },
    {
      title: 'reverseengineer',
      prompt: 'Anda adalah seorang engineer yang memiliki tugas melakukan reserver engineering dari data yang diperoleh, anda mencari bagaimana perhitungannya sehingga data tersebut berhasil diperoleh'
    },
    {
      title: 'resumecommon',
      prompt: 'Ringkas teks dalam gambar ini ke dalam bahasa Indonesia dengan cara yang jelas dan langsung. Ambil hanya poin-poin utama dan sederhanakan kalimat yang kompleks tanpa mengubah makna. Output harus berupa ringkasan tanpa tambahan kata pengantar, penjelasan, atau format lain. Hasil harus tetap akurat dan mudah dipahami. Tidak perlu muncul hal2 semacam Berikut adalah ringkasan teks tersebu'
    },
    {
      title: 'physiccalculation',
      prompt: 'Anda adalah seorang fisikawan yang bertugas menyelesaikan permasalahan permasalahan pada soal fisika'
    }
  ];

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Clear existing keywords
    await connection.execute('DELETE FROM keywords');
    console.log('🗑️  Cleared existing keywords');

    // Insert new keywords (tanpa category)
    for (const keyword of keywordsData) {
      await connection.execute(
        'INSERT INTO keywords (title, prompt, created_at) VALUES (?, ?, NOW())',
        [keyword.title, keyword.prompt]
      );
      console.log(`✅ Inserted: ${keyword.title}`);
    }

    // Verify insertion
    const [keywords] = await connection.execute('SELECT * FROM keywords ORDER BY created_at DESC');
    console.log('\n📋 Keywords in database:');
    keywords.forEach(keyword => {
      console.log(`   - ${keyword.title}`);
    });

    await connection.end();
    console.log('\n🎉 Keywords insertion completed successfully!');
    
  } catch (error) {
    console.error('❌ Keywords insertion failed:', error.message);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  insertKeywordsSimple();
}

module.exports = insertKeywordsSimple; 