import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors, fonts } from '../../utils'
import { MyHeader } from '../../components'

export default function DetailDataSurvey({navigation, route}) {
  const { surveyData } = route.params;
  const { formData, photos, dateCreated, timestamp } = surveyData;

  const renderDetailItem = (label, value, isLast = false) => (
    <View style={[styles.detailItem, isLast && styles.lastItem]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || '-'}</Text>
    </View>
  );

  const renderPhoto = (label, photo) => {
    if (!photo) return null;
    
    return (
      <View style={styles.photoContainer}>
        <Text style={styles.photoLabel}>{label}</Text>
        <Image source={{uri: photo.uri}} style={styles.photoImage} />
      </View>
    );
  };

  const getGenderText = (gender) => {
    if (gender === 'L') return 'Laki-laki';
    if (gender === 'P') return 'Perempuan';
    return gender || '-';
  };

  const getKelayakanText = (value) => {
    return value || 'Tidak diisi';
  };

  return (
    <View style={styles.container}>
      <MyHeader title="Detail Data Survey"/>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Header Info */}
        <View style={styles.headerSection}>
          <Text style={styles.surveyTitle}>Data Survey Lengkap</Text>
          <Text style={styles.surveyDate}>Dibuat: {dateCreated}</Text>
         
        </View>

        {/* I. IDENTITAS PENGHUNI RUMAH */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I. IDENTITAS PENGHUNI RUMAH</Text>
          
          {renderDetailItem('1. Nama', formData.nama)}
          {renderDetailItem('Jenis Kelamin', getGenderText(formData.jenisKelamin))}
          {renderDetailItem('2. Nomor KTP', formData.nomorKTP)}
          {renderDetailItem('3. Nomor Kartu Keluarga', formData.nomorKK)}
          {renderDetailItem('4. Jumlah KK dalam satu rumah', formData.jumlahKK ? `${formData.jumlahKK} KK` : '')}
          {renderDetailItem('5. Alamat', formData.alamat)}
          {renderDetailItem('6. Umur', formData.umur ? `${formData.umur} tahun` : '')}
          {renderDetailItem('7. Pendidikan Terakhir', formData.pendidikan)}
          {renderDetailItem('8. Sektor Pekerjaan', formData.pekerjaanSektor)}
          {renderDetailItem('9. Penghasilan per bulan', formData.penghasilan)}
          {renderDetailItem('10. Status Kepemilikan Rumah', formData.statusKepemilikanRumah)}
          {renderDetailItem('11. Aset Rumah di tempat lain', formData.asetRumahLain)}
          {renderDetailItem('12. Status Kepemilikan Tanah', formData.statusKepemilikanTanah)}
          {renderDetailItem('13. Aset Tanah di tempat lain', formData.asetTanahLain)}
          {renderDetailItem('14. Sumber Penerangan', formData.sumberPenerangan)}
          {renderDetailItem('15. Bantuan perumahan', formData.bantuanPerumahan)}
          {renderDetailItem('16. Jenis kawasan', formData.jenisKawasan)}
          {renderDetailItem('17. Fungsi (RTRW kab/kota)', formData.fungsiRTRW, true)}
        </View>

        {/* II. KONDISI FISIK RUMAH */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II. KONDISI FISIK RUMAH</Text>
          
          <Text style={styles.subSectionTitle}>II.1. ASPEK KETAHANAN KONSTRUKSI</Text>
          {renderDetailItem('1. Fondasi', getKelayakanText(formData.fondasi))}
          {renderDetailItem('2. Sloof', getKelayakanText(formData.sloof))}
          {renderDetailItem('3. Kolom', getKelayakanText(formData.kolom))}
          {renderDetailItem('4. Ring Balok', getKelayakanText(formData.ringBalok))}
          {renderDetailItem('5. Rangka Atap', getKelayakanText(formData.rangkaAtap))}
          {renderDetailItem('6. Jendela', getKelayakanText(formData.jendela))}
          {renderDetailItem('7. Ventilasi', getKelayakanText(formData.ventilasi))}
          {renderDetailItem('8. Plafon', getKelayakanText(formData.plafon))}
          {renderDetailItem('9. Material Lantai', formData.materialLantai)}
          {renderDetailItem('10. Kondisi Lantai', getKelayakanText(formData.kondisiLantai))}
          {renderDetailItem('11. Material Dinding', formData.materialDinding)}
          {renderDetailItem('12. Kondisi Dinding', getKelayakanText(formData.kondisiDinding))}
          {renderDetailItem('13. Material Penutup Atap', formData.materialPenutupAtap)}
          {renderDetailItem('14. Kondisi Penutup Atap', getKelayakanText(formData.kondisiPenutupAtap))}
          
          <Text style={styles.subSectionTitle}>II.2. ASPEK AKSES AIR MINUM</Text>
          {renderDetailItem('15. Sumber air minum', formData.sumberAirMinum)}
          {renderDetailItem('16. Jarak ke pembuangan tinja', formData.jarakPembuanganTinja)}
          
          <Text style={styles.subSectionTitle}>II.3. ASPEK AKSES SANITASI</Text>
          {renderDetailItem('17. Fasilitas BAB', formData.fasilitasBAB)}
          {renderDetailItem('18. Jenis jamban/kloset', formData.jenisJamban)}
          {renderDetailItem('19. TPA tinja', formData.tpaTinja)}
          
          <Text style={styles.subSectionTitle}>II.4. ASPEK LUAS LANTAI PER KAPITA</Text>
          {renderDetailItem('20. Luas rumah', formData.luasRumah ? `${formData.luasRumah} m²` : '')}
          {renderDetailItem('21. Luas tanah', formData.luasTanah ? `${formData.luasTanah} m²` : '')}
          {renderDetailItem('22. Jumlah penghuni', formData.jumlahPenghuni ? `${formData.jumlahPenghuni} orang` : '')}
          {renderDetailItem('23. Rasio luas bangunan', formData.rasioLuas, true)}
        </View>

        {/* III. KONDISI LINGKUNGAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>III. KONDISI LINGKUNGAN</Text>
          
          <Text style={styles.subSectionTitle}>III.1. KONDISI KHUSUS</Text>
          {renderDetailItem('1. Kondisi visual rumah', formData.kondisiVisualRumah)}
          {renderDetailItem('2. Kawasan kumuh', formData.kawasanKumuh)}
          {renderDetailItem('3. Jenis bencana', formData.jenisBencana)}
          {renderDetailItem('4. P3KE (Desil)', formData.p3ke)}
          {renderDetailItem('5. DTKS', formData.dtks)}
          {renderDetailItem('6. Musibah kebakaran', formData.musibahKebakaran)}
          {renderDetailItem('7. Jenis rumah', formData.jenisRumah)}
          
          <Text style={styles.subSectionTitle}>III.2. PSU DEPAN RUMAH</Text>
          {renderDetailItem('8. Jalan lingkungan', formData.jalanLingkungan)}
          {renderDetailItem('9. Kondisi jalan', formData.kondisiJalan)}
          {renderDetailItem('10. Drainase', formData.drainase)}
          {renderDetailItem('11. Jenis drainase', formData.jenisDrainase)}
          {renderDetailItem('12. Kondisi banjir - Rumah', formData.kondisiBanjirRumah)}
          {renderDetailItem('12. Kondisi banjir - Jalan', formData.kondisiBanjirJalan, true)}
        </View>

        {/* KOORDINAT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>KOORDINAT & IDENTIFIKASI</Text>
          
          {renderDetailItem('Latitude', formData.latitude)}
          {renderDetailItem('Longitude', formData.longitude)}
          {renderDetailItem('Kode Foto', formData.kodeFoto, true)}
        </View>

        {/* FOTO-FOTO */}
        {(photos && Object.values(photos).some(photo => photo)) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DOKUMENTASI FOTO</Text>
            
            <View style={styles.photosGrid}>
              {renderPhoto('Tampak Depan/Perspektif Kiri', photos.tampakDepan)}
              {renderPhoto('Tampak Samping/Perspektif Kanan', photos.tampakSamping)}
              {renderPhoto('Rangka Atap', photos.rangkaAtap)}
              {renderPhoto('Ring Balok', photos.ringBalok)}
              {renderPhoto('Sloof', photos.sloof)}
              {renderPhoto('Fondasi', photos.fondasi)}
              {renderPhoto('Jendela', photos.jendela)}
              {renderPhoto('Ventilasi', photos.ventilasi)}
              {renderPhoto('Plafon', photos.plafon)}
              {renderPhoto('Lantai', photos.lantai)}
              {renderPhoto('Dinding', photos.dinding)}
              {renderPhoto('Atap', photos.atap)}
            </View>
          </View>
        )}

        {/* Action Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.editButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpace} />
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
  headerSection: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center'
  },
  surveyTitle: {
    fontSize: 20,
    fontFamily: fonts.secondary[700],
    color: 'white',
    marginBottom: 8
  },
  surveyDate: {
    fontSize: 14,
    fontFamily: fonts.secondary[400],
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4
  },
  surveyTimestamp: {
    fontSize: 12,
    fontFamily: fonts.secondary[400],
    color: 'rgba(255,255,255,0.7)'
  },
  section: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.secondary[700],
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 10
  },
  subSectionTitle: {
    fontSize: 16,
    fontFamily: fonts.secondary[600],
    color: '#495057',
    marginTop: 15,
    marginBottom: 15,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary
  },
  detailItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  lastItem: {
    marginBottom: 0
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: fonts.secondary[600],
    color: '#495057',
    width: 140,
    marginRight: 15
  },
  detailValue: {
    fontSize: 14,
    fontFamily: fonts.secondary[400],
    color: '#212529',
    flex: 1,
    textAlign: 'right'
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  photoContainer: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  photoLabel: {
    fontSize: 12,
    fontFamily: fonts.secondary[600],
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center'
  },
  photoImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover'
  },
  actionSection: {
    paddingVertical: 20
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: fonts.secondary[700],
    color: 'white'
  },
  bottomSpace: {
    height: 30
  }
});