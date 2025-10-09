import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { colors, fonts } from '../../utils'
import { MyHeader } from '../../components'
import { launchImageLibrary } from 'react-native-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function InputDataSurvey({navigation}) {
  // State untuk form data
  const [formData, setFormData] = useState({
    // Identitas Penghuni
    nama: '',
    jenisKelamin: '',
    nomorKTP: '',
    nomorKK: '',
    jumlahKK: '',
    alamat: '',
    umur: '',
    pendidikan: '',
    pekerjaanSektor: '',
    penghasilan: '',
    statusKepemilikanRumah: '',
    asetRumahLain: '',
    statusKepemilikanTanah: '',
    asetTanahLain: '',
    sumberPenerangan: '',
    bantuanPerumahan: '',
    jenisKawasan: '',
    fungsiRTRW: '',
    
    // Kondisi Fisik Rumah - Aspek Ketahanan Konstruksi
    fondasi: '',
    sloof: '',
    kolom: '',
    ringBalok: '',
    rangkaAtap: '',
    jendela: '',
    ventilasi: '',
    plafon: '',
    materialLantai: '',
    kondisiLantai: '',
    materialDinding: '',
    kondisiDinding: '',
    materialPenutupAtap: '',
    kondisiPenutupAtap: '',
    
    // Aspek Akses Air Minum
    sumberAirMinum: '',
    jarakPembuanganTinja: '',
    
    // Aspek Akses Sanitasi
    fasilitasBAB: '',
    jenisJamban: '',
    tpaTinja: '',
    
    // Aspek Luas Lantai Per Kapita
    luasRumah: '',
    luasTanah: '',
    jumlahPenghuni: '',
    rasioLuas: '',
    
    // Kondisi Lingkungan
    kondisiVisualRumah: '',
    kawasanKumuh: '',
    jenisBencana: '',
    p3ke: '',
    dtks: '',
    musibahKebakaran: '',
    jenisRumah: '',
    jalanLingkungan: '',
    kondisiJalan: '',
    drainase: '',
    jenisDrainase: '',
    kondisiBanjirRumah: '',
    kondisiBanjirJalan: '',
    
    // Koordinat
    latitude: '',
    longitude: '',
    kodeFoto: ''
  });

  // State untuk foto
  const [photos, setPhotos] = useState({
    tampakDepan: null,
    tampakSamping: null,
    rangkaAtap: null,
    ringBalok: null,
    sloof: null,
    fondasi: null,
    jendela: null,
    ventilasi: null,
    plafon: null,
    lantai: null,
    dinding: null,
    atap: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectPhoto = (photoType) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets[0]) {
        setPhotos(prev => ({
          ...prev,
          [photoType]: response.assets[0]
        }));
      }
    });
  };

  const renderTextInput = (label, field, placeholder = '') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
    </View>
  );

  const renderRadioGroup = (label, field, options) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.radioContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.radioOption}
            onPress={() => handleInputChange(field, option)}
          >
            <View style={[
              styles.radioCircle,
              formData[field] === option && styles.radioSelected
            ]} />
            <Text style={styles.radioText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPhotoUpload = (label, photoType) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.photoButton}
        onPress={() => selectPhoto(photoType)}
      >
        {photos[photoType] ? (
          <Image source={{uri: photos[photoType].uri}} style={styles.photoPreview} />
        ) : (
          <>
            <Text style={styles.photoButtonText}>📷 Upload Foto</Text>
            <Text style={styles.photoButtonSubtext}>Ketuk untuk memilih foto</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  const handleSubmit = async () => {
    // Validasi form
    if (!formData.nama || !formData.nomorKTP || !formData.nomorKK) {
      Alert.alert('Error', 'Mohon isi data wajib (Nama, No. KTP, No. KK)');
      return;
    }

    try {
      // Generate unique ID untuk setiap survey
      const surveyId = `survey_${Date.now()}`;
      
      // Data yang akan disimpan
      const surveyData = {
        id: surveyId,
        formData: formData,
        photos: photos,
        timestamp: new Date().toISOString(),
        dateCreated: new Date().toLocaleDateString('id-ID')
      };

      // Ambil data survey yang sudah ada
      const existingSurveys = await AsyncStorage.getItem('surveyData');
      let surveysArray = [];
      
      if (existingSurveys) {
        surveysArray = JSON.parse(existingSurveys);
      }

      // Tambahkan survey baru
      surveysArray.push(surveyData);

      // Simpan kembali ke AsyncStorage
      await AsyncStorage.setItem('surveyData', JSON.stringify(surveysArray));

      // Tampilkan pesan sukses
      Alert.alert('Berhasil!', 'Data survey berhasil disimpan ke penyimpanan lokal!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);

    } catch (error) {
      console.error('Error saving survey data:', error);
      Alert.alert('Error', 'Gagal menyimpan data survey. Silakan coba lagi.');
    }
  };

  return (
    <View style={styles.container}>
      <MyHeader title="Input Survey"/>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* I. IDENTITAS PENGHUNI RUMAH */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I. IDENTITAS PENGHUNI RUMAH</Text>
          
          {renderTextInput('1. Nama *', 'nama', 'Masukkan nama lengkap sesuai KTP')}
          
          {renderRadioGroup('Jenis Kelamin', 'jenisKelamin', [
            'L',
            'P'
          ])}
          
          {renderTextInput('2. Nomor KTP', 'nomorKTP', 'Masukkan nomor KTP')}
          {renderTextInput('3. Nomor Kartu Keluarga', 'nomorKK', 'Masukkan nomor KK')}
          {renderTextInput('4. Jumlah KK dalam satu rumah', 'jumlahKK', 'Jumlah KK')}
          {renderTextInput('5. Alamat **', 'alamat', 'Jalan, nomor rumah, RT/RW')}
          {renderTextInput('6. Umur (tahun)', 'umur', 'Umur dalam tahun')}
          
          {renderRadioGroup('7. Pendidikan Terakhir', 'pendidikan', [
            'Tidak punya ijazah',
            'SD/ sederajat',
            'SMP/ sederajat', 
            'SMA/ sederajat',
            'D1/ D2/ D3',
            'D4/ S1'
          ])}
          
          {renderRadioGroup('8. Sektor Pekerjaan', 'pekerjaanSektor', [
            'PNS',
            'BUMN/ D',
            'TNI/ Polri',
            'Karyawan',
            'Wirausaha',
            'Petani',
            'Buruh Harian',
            'Nelayan',
            'Lansia/ IRT',
            'Pramuwisma',
            'Tukang/ Montir',
            'Ojek/ Sopir',
            'Tidak Bekerja',
            'Pensiunan',
            'Honorer',
            'Lainnya'
          ])}
          
          {renderRadioGroup('9. Besar penghasilan/ pengeluaran per bulan', 'penghasilan', [
            '0 – 1,2 juta',
            '1,3 – 1,8 juta',
            '1,9 – 2,1 juta',
            '2,2 – 2,6 juta',
            '2,7 – 3,1 juta',
            '3,2 – 3,6 juta',
            '3,7 – 4,2 juta',
            '>4,2 juta'
          ])}
          
          {renderRadioGroup('10. Status Kepemilikan Rumah', 'statusKepemilikanRumah', [
            'Milik Sendiri',
            'Kontrak/ sewa',
            'Bukan milik sendiri'
          ])}
          
          {renderRadioGroup('11. Aset Rumah di tempat lain', 'asetRumahLain', [
            'Ada',
            'Tidak ada'
          ])}
          
          {renderRadioGroup('12. Status Kepemilikan Tanah', 'statusKepemilikanTanah', [
            'Milik Sendiri',
            'Bukan milik sendiri',
            'Tanah negara'
          ])}
          
          {renderRadioGroup('13. Aset Tanah di tempat lain', 'asetTanahLain', [
            'Ada',
            'Tidak ada'
          ])}
          
          {renderRadioGroup('14. Sumber Penerangan', 'sumberPenerangan', [
            'Listrik PLN dengan meteran',
            'Listrik PLN tanpa meteran',
            'Listrik non PLN',
            'Bukan listrik'
          ])}
          
          {renderRadioGroup('15. Bantuan perumahan', 'bantuanPerumahan', [
            'Belum pernah',
            'Ya, <10 tahun',
            'Ya, >10 tahun'
          ])}
          
          {renderTextInput('16. Jenis kawasan ***', 'jenisKawasan', 'Isi jika ada data')}
          {renderTextInput('17. Fungsi (RTRW kab/kota)', 'fungsiRTRW', 'Fungsi wilayah')}
        </View>

        {/* II. KONDISI FISIK RUMAH */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II. KONDISI FISIK RUMAH</Text>
          <Text style={styles.subSectionTitle}>II.1. ASPEK KETAHANAN KONSTRUKSI</Text>
          
          {renderRadioGroup('1. Fondasi', 'fondasi', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak'
          ])}
          
          {renderRadioGroup('2. Sloof', 'sloof', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak'
          ])}
          
          {renderRadioGroup('3. Kolom', 'kolom', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak'
          ])}
          
          {renderRadioGroup('4. Ring Balok', 'ringBalok', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak'
          ])}
          
          {renderRadioGroup('5. Rangka Atap', 'rangkaAtap', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak'
          ])}
          
          {renderRadioGroup('6. Jendela', 'jendela', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak'
          ])}
          
          {renderRadioGroup('7. Ventilasi', 'ventilasi', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak'
          ])}
          
          {renderRadioGroup('8. Plafon', 'plafon', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak'
          ])}
          
          {renderRadioGroup('9. Material Lantai', 'materialLantai', [
            'Tanah',
            'Bambu',
            'Kayu',
            'Ubin/ tegel',
            'Keramik',
            'Marmer/ granit'
          ])}
          
          {renderRadioGroup('10. Kondisi lantai', 'kondisiLantai', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak'
          ])}
          
          {renderRadioGroup('11. Material dinding', 'materialDinding', [
            'Bambu',
            'Rumbia',
            'Kayu',
            'Anyaman Bambu',
            'Plesteran anyaman bambu',
            'Tembok'
          ])}
          
          {renderRadioGroup('12. Kondisi dinding', 'kondisiDinding', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak'
          ])}
          
          {renderRadioGroup('13. Material penutup atap', 'materialPenutupAtap', [
            'Jerami',
            'Ijuk',
            'Daun-daunan',
            'Rumbia',
            'Asbes',
            'Seng',
            'Sirap',
            'Genteng'
          ])}
          
          {renderRadioGroup('14. Kondisi penutup atap', 'kondisiPenutupAtap', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak'
          ])}
          
          <Text style={styles.subSectionTitle}>II.2. ASPEK AKSES AIR MINUM</Text>
          
          {renderRadioGroup('15. Sumber air minum', 'sumberAirMinum', [
            'Air hujan',
            'Mata air',
            'Sumur/ Sumur Bor',
            'Leding/ perpipaan',
            'Air kemasan/ isi ulang',
            'Lainnya (sungai, danau dst)'
          ])}
          
          {renderRadioGroup('16. Jarak ke pembuangan tinja (dari sumur)', 'jarakPembuanganTinja', [
            '<10 m',
            '>10 m'
          ])}
          
          <Text style={styles.subSectionTitle}>II.3. ASPEK AKSES SANITASI</Text>
          
          {renderRadioGroup('17. Fasilitas BAB', 'fasilitasBAB', [
            'Tidak ada fasilitas',
            'Milik bersama/ komunal',
            'Milik sendiri'
          ])}
          
          {renderRadioGroup('18. Jenis jamban/ kloset', 'jenisJamban', [
            'Camplung/ cubluk',
            'Plengsengan',
            'Leher angsa'
          ])}
          
          {renderRadioGroup('19. TPA tinja', 'tpaTinja', [
            'Pantai/ tanah lapang/ kebun',
            'Kolam/ sawah/ sungai/ danau/ laut',
            'Lubang tanah',
            'Tangki septik',
            'IPAL'
          ])}
          
          <Text style={styles.subSectionTitle}>II.4. ASPEK LUAS LANTAI PER KAPITA</Text>
          
          {renderTextInput('20. Luas rumah (rumah induk) m²', 'luasRumah', 'Luas dalam m²')}
          {renderTextInput('21. Luas tanah m²', 'luasTanah', 'Luas dalam m²')}
          {renderTextInput('22. Jumlah penghuni (orang)', 'jumlahPenghuni', 'Jumlah penghuni')}
          
          {renderRadioGroup('23. Rasio luas bangunan rumah (m²) terhadap jumlah penghuni (orang)', 'rasioLuas', [
            '<7,2 m²/ orang',
            '7,2 m² – 8 m²/ orang',
            '8 - 9 m²/ org',
            '>9 m²/ orang'
          ])}
        </View>

        {/* III. KONDISI LINGKUNGAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>III. KONDISI LINGKUNGAN</Text>
          <Text style={styles.subSectionTitle}>III.1. KONDISI KHUSUS</Text>
          
          {renderRadioGroup('1. Kondisi visual rumah', 'kondisiVisualRumah', [
            'RLH',
            'RTLH'
          ])}
          
          {renderTextInput('2. Kawasan kumuh ***', 'kawasanKumuh', 'Isi jika ada data')}
          {renderTextInput('3. Jenis bencana ***', 'jenisBencana', 'Isi jika ada data')}
          {renderTextInput('4. P3KE (Desil)', 'p3ke', 'Data P3KE')}
          {renderTextInput('5. DTKS ***', 'dtks', 'Isi jika ada data')}
          
          {renderRadioGroup('6. Musibah kebakaran', 'musibahKebakaran', [
            'Ya',
            'Tidak'
          ])}
          
          {renderRadioGroup('7. Jenis rumah', 'jenisRumah', [
            'Non panggung',
            'Panggung'
          ])}
          
          <Text style={styles.subSectionTitle}>III.2. PSU DEPAN RUMAH</Text>
          
          {renderRadioGroup('8. Jalan lingkungan', 'jalanLingkungan', [
            'Ada',
            'Tidak ada'
          ])}
          
          {renderRadioGroup('9. Kondisi jalan', 'kondisiJalan', [
            'Tanah',
            'Cor beton',
            'Aspal'
          ])}
          
          {renderRadioGroup('10. Drainase', 'drainase', [
            'Ada',
            'Tidak ada'
          ])}
          
          {renderTextInput('11. Jenis drainase', 'jenisDrainase', 'Jenis drainase')}
          
          {renderTextInput('12. Kondisi banjir setahun terakhir - Rumah (dari atas lantai)', 'kondisiBanjirRumah', 'Kondisi banjir rumah')}
          {renderTextInput('12. Kondisi banjir setahun terakhir - Jalan', 'kondisiBanjirJalan', 'Kondisi banjir jalan')}
        </View>

        {/* KOORDINAT & FOTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>KOORDINAT & DOKUMENTASI</Text>
          
          {renderTextInput('Latitude', 'latitude', 'Contoh: 2.20887507S')}
          {renderTextInput('Longitude', 'longitude', 'Contoh: 113.92528864E')}
          {renderTextInput('Kode Foto', 'kodeFoto', 'Kode foto')}
          
          <Text style={styles.subSectionTitle}>FOTO-FOTO RUMAH</Text>
          
          {renderPhotoUpload('Foto Tampak Depan/Perspektif Kiri', 'tampakDepan')}
          {renderPhotoUpload('Foto Tampak Samping/Perspektif Kanan', 'tampakSamping')}
          {renderPhotoUpload('Foto Rangka Atap', 'rangkaAtap')}
          {renderPhotoUpload('Foto Ring Balok', 'ringBalok')}
          {renderPhotoUpload('Foto Sloof', 'sloof')}
          {renderPhotoUpload('Foto Fondasi', 'fondasi')}
          {renderPhotoUpload('Foto Jendela', 'jendela')}
          {renderPhotoUpload('Foto Ventilasi', 'ventilasi')}
          {renderPhotoUpload('Foto Plafon', 'plafon')}
          {renderPhotoUpload('Foto Lantai', 'lantai')}
          {renderPhotoUpload('Foto Dinding', 'dinding')}
          {renderPhotoUpload('Foto Atap', 'atap')}
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>SIMPAN DATA SURVEY</Text>
        </TouchableOpacity>
        
        <View style={{height: 50}} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.secondary[700],
    color: colors.primary,
    marginBottom: 15,
    textAlign: 'center'
  },
  subSectionTitle: {
    fontSize: 16,
    fontFamily: fonts.secondary[600],
    color: '#333',
    marginBottom: 15,
    marginTop: 10
  },
  inputContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.secondary[600],
    color: '#333',
    marginBottom: 8
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: fonts.secondary[400],
    backgroundColor: 'white'
  },
  radioContainer: {
    flexDirection: 'column'
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    marginBottom: 8
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 10,
    backgroundColor: 'white'
  },
  radioSelected: {
    backgroundColor: colors.primary
  },
  radioText: {
    fontSize: 14,
    fontFamily: fonts.secondary[400],
    color: '#333',
    flex: 1
  },
  photoButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 30,
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  },
  photoButtonText: {
    fontSize: 16,
    fontFamily: fonts.secondary[600],
    color: colors.primary,
    marginBottom: 5
  },
  photoButtonSubtext: {
    fontSize: 12,
    fontFamily: fonts.secondary[400],
    color: '#666'
  },
  photoPreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover'
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: fonts.secondary[700],
    color: 'white'
  }
});