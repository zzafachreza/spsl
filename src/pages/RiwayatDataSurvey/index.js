import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colors, fonts} from '../../utils';
import {MyHeader} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiURL, getData} from '../../utils/localStorage';
import axios from 'axios';
import {Linking} from 'react-native';

export default function RiwayatDataSurvey({navigation}) {
  const [surveyList, setSurveyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load data dari AsyncStorage
  const loadSurveyData = async () => {
    getData('user').then(u => {
      console.log('petugas', u);
      axios
        .post(apiURL + 'transaksi', {
          fid_petugas: u.id_petugas,
        })
        .then(res => {
          console.log(res.data);
          setSurveyList(res.data);
          setIsLoading(false);
          setRefreshing(false);
        });
    });
  };

  // Hapus survey
  const deleteSurvey = async surveyId => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus data survey ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            axios
              .post(apiURL + 'delete_transaksi', {
                id: surveyId,
              })
              .then(res => {
                console.log(res.data);
                if (res.data.status == 200) {
                  alert('Data Berhasil dihapus !');
                  loadSurveyData();
                }
              });
          },
        },
      ],
    );
  };

  // Edit survey
  const editSurvey = surveyData => {
    navigation.navigate('EditDataSurvey', {
      editMode: true,
      item: surveyData,
    });
  };

  // Detail survey
  const viewDetail = surveyData => {
    navigation.navigate('DetailDataSurvey', {
      item: surveyData,
    });
  };

  // Refresh data
  const onRefresh = () => {
    setRefreshing(true);
    loadSurveyData();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSurveyData();
    });

    return unsubscribe;
  }, [navigation]);

  // Render item survey
  const renderSurveyItem = (survey, index) => {
    const formData = survey;

    return (
      <View key={survey.id} style={styles.surveyCard}>
        {/* Header Card */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.surveyNumber}>#{formData.kode}</Text>
            <Text style={styles.surveyDate}>{formData.tanggal}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Tersimpan</Text>
          </View>
        </View>

        {/* Data Utama */}
        <View style={styles.cardBody}>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Nama</Text>
            <Text style={styles.dataValue}>{formData.nama_lengkap || '-'}</Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Jenis Kelamin</Text>
            <Text style={styles.dataValue}>
              {formData.jenis_kelamin || '-'}
            </Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>No. KTP</Text>
            <Text style={styles.dataValue}>{formData.nomor_ktp || '-'}</Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>No. KK</Text>
            <Text style={styles.dataValue}>{formData.nomor_kk || '-'}</Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Alamat</Text>
            <Text style={styles.dataValue} numberOfLines={2}>
              {formData.alamat || '-'}
            </Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Umur</Text>
            <Text style={styles.dataValue}>
              {formData.umur ? `${formData.umur} tahun` : '-'}
            </Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Pendidikan</Text>
            <Text style={styles.dataValue}>{formData.pendidikan || '-'}</Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Pekerjaan</Text>
            <Text style={styles.dataValue}>
              {formData.pekerjaan_sektor || '-'}
            </Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Penghasilan</Text>
            <Text style={styles.dataValue}>{formData.penghasilan || '-'}</Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Status Rumah</Text>
            <Text style={styles.dataValue}>
              {formData.status_kepemilikan_rumah || '-'}
            </Text>
          </View>

          {formData.latitude && formData.longitude && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Koordinat</Text>
              <Text style={styles.dataValue}>
                {formData.latitude}, {formData.longitude}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={[styles.actionButton, styles.detailButton]}
            onPress={() => viewDetail(survey)}>
            <Text style={styles.detailButtonText}>Detail</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => editSurvey(survey)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deleteSurvey(survey.id_transaksi)}>
            <Text style={styles.deleteButtonText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MyHeader title="Riwayat Survey" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : surveyList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Belum Ada Data Survey</Text>
          <Text style={styles.emptySubtitle}>
            Data survey yang telah Anda input akan muncul di sini
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('InputDataSurvey')}>
            <Text style={styles.addButtonText}>+ Tambah Survey Baru</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }>
          {surveyList.map((survey, index) => renderSurveyItem(survey, index))}

          <View style={styles.bottomSpace} />
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.secondary[400],
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: fonts.secondary[600],
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: fonts.secondary[400],
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.secondary[600],
  },
  headerInfo: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    fontFamily: fonts.secondary[600],
    color: colors.primary,
    textAlign: 'center',
  },
  surveyCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginTop: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  headerLeft: {
    flex: 1,
  },
  surveyNumber: {
    fontSize: 18,
    fontFamily: fonts.secondary[700],
    color: colors.primary,
    marginBottom: 4,
  },
  surveyDate: {
    fontSize: 12,
    fontFamily: fonts.secondary[400],
    color: '#666',
  },
  statusBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: fonts.secondary[600],
    color: '#2d5016',
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  dataLabel: {
    fontSize: 12,
    fontFamily: fonts.primary[600],
    color: '#333',
    width: 100,
    marginRight: 10,
  },
  dataValue: {
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  detailButton: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  editButton: {
    backgroundColor: '#fff3e0',
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#f44336',
  },
  detailButtonText: {
    fontSize: 14,
    fontFamily: fonts.primary[600],
    color: '#2196f3',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: fonts.primary[600],
    color: '#ff9800',
  },
  deleteButtonText: {
    fontSize: 14,
    fontFamily: fonts.primary[600],
    color: '#f44336',
  },
  bottomSpace: {
    height: 30,
  },
});
