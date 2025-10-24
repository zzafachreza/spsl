import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  StyleSheet,
  Alert,
  Image,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colors, fonts, windowWidth} from '../../utils';
import {MyHeader} from '../../components';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import axios from 'axios';
import {useToast} from 'react-native-toast-notifications';
import MlkitOcr from 'react-native-mlkit-ocr';
import {apiURL, getData} from '../../utils/localStorage';
import TesseractOcr, {
  LANG_ENGLISH,
  LEVEL_WORD,
  LANG_INDONESIAN,
} from 'react-native-tesseract-ocr';
import GetLocation from 'react-native-get-location';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Linking} from 'react-native';

export default function InputDataSurvey({navigation}) {
  // State untuk form data
  const [formData, setFormData] = useState({
    // Identitas Penghuni
    foto_ktp: null,
    nama_lengkap: '',
    jenis_kelamin: '',
    nomor_ktp: '',
    nomor_kk: '',
    jumlah_kk: '',
    alamat: '',
    umur: '',
    pendidikan: '',
    pekerjaan_sektor: '',
    penghasilan: '',
    status_kepemilikan_rumah: '',
    aset_rumah_lain: '',
    status_kepemilikan_tanah: '',
    aset_tanah_lain: '',
    sumber_penerangan: '',
    bantuan_perumahan: '',
    jenis_kawasan: '',
    fungsi_rtrw: '',

    // Kondisi Fisik Rumah - Aspek Ketahanan Konstruksi
    fondasi: '',
    sloof: '',
    kolom: '',
    ring_balok: '',
    rangka_atap: '',
    jendela: '',
    ventilasi: '',
    plafon: '',
    material_lantai: '',
    kondisi_lantai: '',
    material_dinding: '',
    kondisi_dinding: '',
    material_penutup_atap: '',
    kondisi_penutup_atap: '',

    // Aspek Akses Air Minum
    sumber_air_minum: '',
    jarak_pembuangan_tinja: '',

    // Aspek Akses Sanitasi
    fasilitas_bab: '',
    jenis_jamban: '',
    tpa_tnja: '',

    // Aspek Luas Lantai Per Kapita
    luas_rumah: '',
    luas_tanah: '',
    jumlah_penghuni: '',
    rasio_luas: '',

    // Kondisi Lingkungan
    kondisi_visual_rumah: '',
    kawasan_kumuh: '',
    jenis_bencana: '',
    p3ke: '',
    dtks: '',
    musibah_kebakaran: '',
    jenis_rumah: '',
    jalan_lingkungan: '',
    kondisi_jalan: '',
    drainase: '',
    jenis_drainase: '',
    kondisi_banjir_rumah: '',
    kondisi_banjir_jalan: '',

    // Koordinat
    latitude: '',
    longitude: '',
    kode: '',
  });

  // State untuk foto
  const [photos, setPhotos] = useState({
    foto_tampak_depan: null,
    foto_tampak_samping: null,
    foto_rangka_atap: null,
    foto_ring_balok: null,
    foto_sloof: null,
    foto_fondasi: null,
    foto_jendela: null,
    foto_ventilasi: null,
    foto_plafon: null,
    foto_lantai: null,
    foto_dinding: null,
    foto_atap: null,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const result = await request(
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          );

          const allGranted = Object.values(result).every(
            r => r === RESULTS.GRANTED,
          );

          if (allGranted) {
            console.log('📂 Semua izin media diberikan');
            return true;
          } else {
            console.log('🚫 Beberapa izin media ditolak');
            return false;
          }
        } else {
          const result = await request(
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          );
          return result === RESULTS.GRANTED;
        }
      } else {
        const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        return result === RESULTS.GRANTED;
      }
    } catch (error) {
      console.warn('Error meminta izin storage:', error);
      return false;
    }
  };

  const parseKTPData = ocrResult => {
    try {
      // Gabungkan semua text
      const fullText = ocrResult.map(block => block.text).join('\n');
      console.log('📄 Full OCR Text:', fullText);

      let nik = '';
      let nama = '';
      let jenisKelamin = '';

      // Split per baris
      const lines = fullText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line);

      return {
        nik: lines[11],
        nama: lines[12],
      };
    } catch (error) {
      console.error('❌ Error parsing KTP:', error);
      return {
        nik: null,
        nama: null,
      };
    }
  };

  const selectPhoto = async (photoType, ocr) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel || !response.assets) return;

      const imageUri = response.assets[0].uri;

      try {
        const cropped = await ImageCropPicker.openCropper({
          path: imageUri,
          width: 800,
          height: 800,
          cropping: true,
          includeBase64: false, // Tidak perlu base64 untuk OCR
        });

        // Normalize path untuk Android/iOS
        let imagePath = cropped.path;

        // Untuk Android, hilangkan 'file://' prefix jika ada
        if (Platform.OS === 'android') {
          imagePath = imagePath.replace('file://', '');
        }

        console.log('Image path untuk OCR:', imagePath);

        setPhotos(prev => ({
          ...prev,
          [photoType]: {
            uri: cropped.path,
          },
        }));

        if (ocr) {
          console.log('🔍 Starting OCR...');

          const ocrResult = await MlkitOcr.detectFromUri(cropped.path);

          console.log('✅ OCR Complete');
          console.log('Raw OCR Result:', ocrResult);

          if (!ocrResult || ocrResult.length === 0) {
            Alert.alert(
              'Hasil OCR',
              'Tidak ada teks terdeteksi.\n\nTips:\n• Pastikan foto jelas\n• Pencahayaan cukup\n• Teks kontras',
            );
            return;
          }

          // Parse data KTP
          const ktpData = parseKTPData(ocrResult);

          console.log('📋 Parsed KTP Data:', ktpData);

          setFormData({
            ...formData,
            nama_lengkap: ktpData.nama,
            nomor_ktp: ktpData.nik,
          });
        }
      } catch (err) {
        console.error('Error detail:', err);
        Alert.alert('Error', `Gagal melakukan OCR: ${err.message}`);
      }
    });
  };

  const renderTextInput = (
    label,
    field,
    placeholder = '',
    keyboard = 'default',
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        keyboardType={keyboard}
        style={styles.textInput}
        value={formData[field]}
        onChangeText={value => handleInputChange(field, value)}
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
            onPress={() => handleInputChange(field, option)}>
            <View
              style={[
                styles.radioCircle,
                formData[field] === option && styles.radioSelected,
              ]}
            />
            <Text style={styles.radioText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPhotoUpload = (label, photoType, ocr = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.photoButton}
        onPress={() => selectPhoto(photoType, ocr)}>
        {photos[photoType] ? (
          <Image
            source={{uri: photos[photoType].uri}}
            style={styles.photoPreview}
          />
        ) : (
          <>
            <Text style={styles.photoButtonText}>📷 Upload Foto</Text>
            <Text style={styles.photoButtonSubtext}>
              Ketuk untuk memilih foto
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  const toast = useToast();

  const handleSubmit = async () => {
    // Validasi form
    if (!formData.nama_lengkap || !formData.nomor_ktp || !formData.nomor_kk) {
      Alert.alert(
        'Error',
        'Mohon isi data wajib (Nama Lengkap, No. KTP, No. KK)',
      );
      return;
    }

    try {
      // Generate unique ID untuk setiap survey
      const surveyId = `survey_${Date.now()}`;

      // Data yang akan disimpan
      const surveyData = {
        inputan: formData,
        foto: photos,
        petugas: user,
      };

      // Linking.openURL(apiURL);

      axios.post(apiURL + 'insert_transaksi', surveyData).then(res => {
        console.log(res.data);
        toast.show('Data berhasil disimpan !', {
          type: 'success',
        });
        navigation.goBack();
      });

      // // Ambil data survey yang sudah ada
      // const existingSurveys = await AsyncStorage.getItem('surveyData');
      // let surveysArray = [];

      // if (existingSurveys) {
      //   surveysArray = JSON.parse(existingSurveys);
      // }

      // // Tambahkan survey baru
      // surveysArray.push(surveyData);

      // // Simpan kembali ke AsyncStorage
      // await AsyncStorage.setItem('surveyData', JSON.stringify(surveysArray));

      // // Tampilkan pesan sukses
      // Alert.alert(
      //   'Berhasil!',
      //   'Data survey berhasil disimpan ke penyimpanan lokal!',
      //   [
      //     {
      //       text: 'OK',
      //       onPress: () => navigation.goBack(),
      //     },
      //   ],
      // );
    } catch (error) {
      console.error('Error saving survey data:', error);
      Alert.alert('Error', 'Gagal menyimpan data survey. Silakan coba lagi.');
    }
  };

  const [user, setUser] = useState({});
  const getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        console.log(location);
        setFormData({
          ...formData,
          latitude: location.latitude,
          longitude: location.longitude,
        });
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };
  useEffect(() => {
    getData('user').then(u => setUser(u));
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MyHeader title="Input Survey" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* I. IDENTITAS PENGHUNI RUMAH */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I. IDENTITAS PENGHUNI RUMAH</Text>
          {renderPhotoUpload('Foto KTP', 'foto_ktp', true)}
          {renderTextInput(
            '1. Nama Lengkap *',
            'nama_lengkap',
            'Masukkan nama_lengkap lengkap sesuai KTP',
          )}

          {renderRadioGroup('Jenis Kelamin', 'jenis_kelamin', ['L', 'P'])}

          {renderTextInput(
            '2. Nomor KTP',
            'nomor_ktp',
            'Masukkan nomor KTP',
            'number-pad',
          )}
          {renderTextInput(
            '3. Nomor Kartu Keluarga',
            'nomor_kk',
            'Masukkan nomor KK',
            'number-pad',
          )}
          {renderTextInput(
            '4. Jumlah KK dalam satu rumah',
            'jumlah_kk',
            'Jumlah KK',
            'number-pad',
          )}
          {renderTextInput(
            '5. Alamat **',
            'alamat',
            'Jalan, nomor rumah, RT/RW',
          )}
          {renderTextInput(
            '6. Umur (tahun)',
            'umur',
            'Umur dalam tahun',
            'number-pad',
          )}

          {renderRadioGroup('7. Pendidikan Terakhir', 'pendidikan', [
            'Tidak punya ijazah',
            'SD/ sederajat',
            'SMP/ sederajat',
            'SMA/ sederajat',
            'D1/ D2/ D3',
            'D4/ S1',
          ])}

          {renderRadioGroup('8. Sektor Pekerjaan', 'pekerjaan_sektor', [
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
            'Lainnya',
          ])}

          {renderRadioGroup(
            '9. Besar penghasilan/ pengeluaran per bulan',
            'penghasilan',
            [
              '0 – 1,2 juta',
              '1,3 – 1,8 juta',
              '1,9 – 2,1 juta',
              '2,2 – 2,6 juta',
              '2,7 – 3,1 juta',
              '3,2 – 3,6 juta',
              '3,7 – 4,2 juta',
              '>4,2 juta',
            ],
          )}

          {renderRadioGroup(
            '10. Status Kepemilikan Rumah',
            'status_kepemilikan_rumah',
            ['Milik Sendiri', 'Kontrak/ sewa', 'Bukan milik sendiri'],
          )}

          {renderRadioGroup(
            '11. Aset Rumah di tempat lain',
            'aset_rumah_lain',
            ['Ada', 'Tidak ada'],
          )}

          {renderRadioGroup(
            '12. Status Kepemilikan Tanah',
            'status_kepemilikan_tanah',
            ['Milik Sendiri', 'Bukan milik sendiri', 'Tanah negara'],
          )}

          {renderRadioGroup(
            '13. Aset Tanah di tempat lain',
            'aset_tanah_lain',
            ['Ada', 'Tidak ada'],
          )}

          {renderRadioGroup('14. Sumber Penerangan', 'sumber_penerangan', [
            'Listrik PLN dengan meteran',
            'Listrik PLN tanpa meteran',
            'Listrik non PLN',
            'Bukan listrik',
          ])}

          {renderRadioGroup('15. Bantuan perumahan', 'bantuan_perumahan', [
            'Belum pernah',
            'Ya, <10 tahun',
            'Ya, >10 tahun',
          ])}

          {renderTextInput(
            '16. Jenis kawasan ***',
            'jenis_kawasan',
            'Isi jika ada data',
          )}
          {renderTextInput(
            '17. Fungsi (RTRW kab/kota)',
            'fungsi_rtrw',
            'Fungsi wilayah',
          )}
        </View>
        {/* II. KONDISI FISIK RUMAH */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II. KONDISI FISIK RUMAH</Text>
          <Text style={styles.subSectionTitle}>
            II.1. ASPEK KETAHANAN KONSTRUKSI
          </Text>

          {renderRadioGroup('1. Fondasi', 'fondasi', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak',
          ])}

          {renderRadioGroup('2. Sloof', 'sloof', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak',
          ])}

          {renderRadioGroup('3. Kolom', 'kolom', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak',
          ])}

          {renderRadioGroup('4. Ring Balok', 'ring_balok', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak',
          ])}

          {renderRadioGroup('5. Rangka Atap', 'rangka_atap', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak',
          ])}

          {renderRadioGroup('6. Jendela', 'jendela', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak',
          ])}

          {renderRadioGroup('7. Ventilasi', 'ventilasi', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak',
          ])}

          {renderRadioGroup('8. Plafon', 'plafon', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak',
          ])}

          {renderRadioGroup('9. Material Lantai', 'material_lantai', [
            'Tanah',
            'Bambu',
            'Kayu',
            'Ubin/ tegel',
            'Keramik',
            'Marmer/ granit',
          ])}

          {renderRadioGroup('10. Kondisi lantai', 'kondisi_lantai', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak',
          ])}

          {renderRadioGroup('11. Material dinding', 'material_dinding', [
            'Bambu',
            'Rumbia',
            'Kayu',
            'Anyaman Bambu',
            'Plesteran anyaman bambu',
            'Tembok',
          ])}

          {renderRadioGroup('12. Kondisi dinding', 'kondisi_dinding', [
            'Tidak layak',
            'Agak layak',
            'Menuju layak',
            'Kurang layak',
            'Layak',
          ])}

          {renderRadioGroup(
            '13. Material penutup atap',
            'material_penutup_atap',
            [
              'Jerami',
              'Ijuk',
              'Daun-daunan',
              'Rumbia',
              'Asbes',
              'Seng',
              'Sirap',
              'Genteng',
            ],
          )}

          {renderRadioGroup(
            '14. Kondisi penutup atap',
            'kondisi_penutup_atap',
            [
              'Tidak layak',
              'Agak layak',
              'Menuju layak',
              'Kurang layak',
              'Layak',
            ],
          )}

          <Text style={styles.subSectionTitle}>
            II.2. ASPEK AKSES AIR MINUM
          </Text>

          {renderRadioGroup('15. Sumber air minum', 'sumber_air_minum', [
            'Air hujan',
            'Mata air',
            'Sumur/ Sumur Bor',
            'Leding/ perpipaan',
            'Air kemasan/ isi ulang',
            'Lainnya (sungai, danau dst)',
          ])}

          {renderRadioGroup(
            '16. Jarak ke pembuangan tinja (dari sumur)',
            'jarak_pembuangan_tinja',
            ['<10 m', '>10 m'],
          )}

          <Text style={styles.subSectionTitle}>II.3. ASPEK AKSES SANITASI</Text>

          {renderRadioGroup('17. Fasilitas BAB', 'fasilitas_bab', [
            'Tidak ada fasilitas',
            'Milik bersama/ komunal',
            'Milik sendiri',
          ])}

          {renderRadioGroup('18. Jenis jamban/ kloset', 'jenis_jamban', [
            'Camplung/ cubluk',
            'Plengsengan',
            'Leher angsa',
          ])}

          {renderRadioGroup('19. TPA tinja', 'tpa_tnja', [
            'Pantai/ tanah lapang/ kebun',
            'Kolam/ sawah/ sungai/ danau/ laut',
            'Lubang tanah',
            'Tangki septik',
            'IPAL',
          ])}

          <Text style={styles.subSectionTitle}>
            II.4. ASPEK LUAS LANTAI PER KAPITA
          </Text>

          {renderTextInput(
            '20. Luas rumah (rumah induk) m²',
            'luas_rumah',
            'Luas dalam m²',
            'number-pad',
          )}
          {renderTextInput(
            '21. Luas tanah m²',
            'luas_tanah',
            'Luas dalam m²',
            'number-pad',
          )}
          {renderTextInput(
            '22. Jumlah penghuni (orang)',
            'jumlah_penghuni',
            'Jumlah penghuni',
            'number-pad',
          )}

          {renderRadioGroup(
            '23. Rasio luas bangunan rumah (m²) terhadap jumlah penghuni (orang)',
            'rasio_luas',
            [
              '<7,2 m²/ orang',
              '7,2 m² – 8 m²/ orang',
              '8 - 9 m²/ org',
              '>9 m²/ orang',
            ],
          )}
        </View>
        {/* III. KONDISI LINGKUNGAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>III. KONDISI LINGKUNGAN</Text>
          <Text style={styles.subSectionTitle}>III.1. KONDISI KHUSUS</Text>

          {renderRadioGroup('1. Kondisi visual rumah', 'kondisi_visual_rumah', [
            'RLH',
            'RTLH',
          ])}

          {renderTextInput(
            '2. Kawasan kumuh ***',
            'kawasan_kumuh',
            'Isi jika ada data',
          )}
          {renderTextInput(
            '3. Jenis bencana ***',
            'jenis_bencana',
            'Isi jika ada data',
          )}
          {renderTextInput('4. P3KE (Desil)', 'p3ke', 'Data P3KE')}
          {renderTextInput('5. DTKS ***', 'dtks', 'Isi jika ada data')}

          {renderRadioGroup('6. Musibah kebakaran', 'musibah_kebakaran', [
            'Ya',
            'Tidak',
          ])}

          {renderRadioGroup('7. Jenis rumah', 'jenis_rumah', [
            'Non panggung',
            'Panggung',
          ])}

          <Text style={styles.subSectionTitle}>III.2. PSU DEPAN RUMAH</Text>

          {renderRadioGroup('8. Jalan lingkungan', 'jalan_lingkungan', [
            'Ada',
            'Tidak ada',
          ])}

          {renderRadioGroup('9. Kondisi jalan', 'kondisi_jalan', [
            'Tanah',
            'Cor beton',
            'Aspal',
          ])}

          {renderRadioGroup('10. Drainase', 'drainase', ['Ada', 'Tidak ada'])}

          {renderTextInput(
            '11. Jenis drainase',
            'jenis_drainase',
            'Jenis drainase',
          )}

          {renderTextInput(
            '12. Kondisi banjir setahun terakhir - Rumah (dari atas lantai)',
            'kondisi_banjir_rumah',
            'Kondisi banjir rumah',
          )}
          {renderTextInput(
            '12. Kondisi banjir setahun terakhir - Jalan',
            'kondisi_banjir_jalan',
            'Kondisi banjir jalan',
          )}
        </View>
        {/* KOORDINAT & FOTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>KOORDINAT & DOKUMENTASI</Text>
          <Text style={styles.subSectionTitle}>
            Latitude : {formData.latitude}
          </Text>
          <Text style={styles.subSectionTitle}>
            Longitude : {formData.longitude}
          </Text>

          {/* {renderTextInput('Latitude', 'latitude', 'Contoh: 2.20887507S')}
          {renderTextInput('Longitude', 'longitude', 'Contoh: 113.92528864E')}
          {renderTextInput('Kode Foto', 'kode', 'Kode foto')} */}

          <Text style={styles.sectionTitle}>FOTO-FOTO RUMAH</Text>

          {renderPhotoUpload(
            'Foto Tampak Depan/Perspektif Kiri',
            'foto_tampak_depan',
          )}
          {renderPhotoUpload(
            'Foto Tampak Samping/Perspektif Kanan',
            'foto_tampak_samping',
          )}
          {renderPhotoUpload('Foto Rangka Atap', 'foto_rangka_atap')}
          {renderPhotoUpload('Foto Ring Balok', 'foto_ring_balok')}
          {renderPhotoUpload('Foto Sloof', 'foto_sloof')}
          {renderPhotoUpload('Foto Fondasi', 'foto_fondasi')}
          {renderPhotoUpload('Foto Jendela', 'foto_jendela')}
          {renderPhotoUpload('Foto Ventilasi', 'foto_ventilasi')}
          {renderPhotoUpload('Foto Plafon', 'foto_plafon')}
          {renderPhotoUpload('Foto Lantai', 'foto_lantai')}
          {renderPhotoUpload('Foto Dinding', 'foto_dinding')}
          {renderPhotoUpload('Foto Atap', 'foto_atap')}
        </View>
        {/* SUBMIT BUTTON */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>SIMPAN DATA SURVEY</Text>
        </TouchableOpacity>
        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.secondary[700],
    color: colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  subSectionTitle: {
    fontSize: 16,
    fontFamily: fonts.secondary[600],
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.secondary[600],
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: fonts.secondary[400],
    backgroundColor: 'white',
  },
  radioContainer: {
    flexDirection: 'column',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    marginBottom: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 10,
    backgroundColor: 'white',
  },
  radioSelected: {
    backgroundColor: colors.primary,
  },
  radioText: {
    fontSize: 14,
    fontFamily: fonts.secondary[400],
    color: '#333',
    flex: 1,
  },
  photoButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 30,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  photoButtonText: {
    fontSize: 16,
    fontFamily: fonts.secondary[600],
    color: colors.primary,
    marginBottom: 5,
  },
  photoButtonSubtext: {
    fontSize: 12,
    fontFamily: fonts.secondary[400],
    color: '#666',
  },
  photoPreview: {
    width: windowWidth / 1.5,
    height: windowWidth / 2,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: fonts.secondary[700],
    color: 'white',
  },
});
