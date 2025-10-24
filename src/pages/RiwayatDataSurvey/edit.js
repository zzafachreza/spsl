import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {colors, fonts} from '../../utils';
import {MyHeader} from '../../components';
import {WebView} from 'react-native-webview';
import {webURL} from '../../utils/localStorage';
import {useToast} from 'react-native-toast-notifications';
export default function DetailDataSurvey({navigation, route}) {
  const item = route.params.item;
  const toast = useToast();
  console.log(item);

  return (
    <View style={styles.container}>
      <MyHeader title="Detail Data Survey" />

      <WebView
        onMessage={event => {
          if (event.nativeEvent.data === 'success') {
            toast.show('Data berhasil disimpan !', {
              type: 'success',
            });

            navigation.goBack();
          } else if (event.nativeEvent.data === 'success_edit') {
            toast.show('Data berhasil diedit !', {
              type: 'success',
            });
            navigation.pop(2);
          } else if (event.nativeEvent.data === 'duplikasi') {
            toast.show('Data nomor ktp tidak boleh sama !', {
              type: 'error',
            });
            navigation.goBack();
          }
        }}
        source={{
          uri: webURL + 'transaksi/edit2/' + item.id_transaksi,
        }}
      />
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
  headerSection: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
  },
  surveyTitle: {
    fontSize: 20,
    fontFamily: fonts.secondary[700],
    color: 'white',
    marginBottom: 8,
  },
  surveyDate: {
    fontSize: 14,
    fontFamily: fonts.secondary[400],
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  surveyTimestamp: {
    fontSize: 12,
    fontFamily: fonts.secondary[400],
    color: 'rgba(255,255,255,0.7)',
  },
  section: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.secondary[700],
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 10,
  },
  subSectionTitle: {
    fontSize: 16,
    fontFamily: fonts.secondary[600],
    color: '#495057',
    marginTop: 15,
    marginBottom: 15,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  detailItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  lastItem: {
    marginBottom: 0,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: fonts.secondary[600],
    color: '#495057',
    width: 140,
    marginRight: 15,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: fonts.secondary[400],
    color: '#212529',
    flex: 1,
    textAlign: 'right',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  photoLabel: {
    fontSize: 12,
    fontFamily: fonts.secondary[600],
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center',
  },
  photoImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  actionSection: {
    paddingVertical: 20,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: fonts.secondary[700],
    color: 'white',
  },
  bottomSpace: {
    height: 30,
  },
});
