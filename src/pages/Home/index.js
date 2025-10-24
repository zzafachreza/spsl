import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts} from '../../utils';
import {getData} from '../../utils/localStorage';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

export default function Home({navigation}) {
  const [user, setUser] = useState({});

  // Mengambil data user yang sedang login
  useEffect(() => {
    getData('user').then(u => {
      console.log(u);
      setUser(u);
    });
  }, []);

  const navigateToInput = () => {
    navigation.navigate('InputDataSurvey'); // Navigasi ke halaman Input
  };

  const navigateToRiwayat = () => {
    navigation.navigate('RiwayatDataSurvey'); // Navigasi ke halaman Riwayat
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.white]}
        style={styles.headerGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Selamat datang,</Text>
            <Text style={styles.greetingText}>
              {user.nama_lengkap || user.username || 'User'}
            </Text>
          </View>
          <FastImage
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        {/* Menu Container */}
        <View style={styles.menuContainer}>
          {/* Menu Input */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={navigateToInput}
            activeOpacity={0.7}>
            <LinearGradient
              colors={[colors.primary, colors.white]}
              style={styles.menuGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <View style={styles.menuContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.menuIcon}>✏️</Text>
                </View>
                <Text style={styles.menuTitle}>Input</Text>
                <Text style={styles.menuSubtitle}>Tambah data baru</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Menu Riwayat */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={navigateToRiwayat}
            activeOpacity={0.7}>
            <LinearGradient
              colors={[colors.primary, colors.white]}
              style={styles.menuGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <View style={styles.menuContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.menuIcon}>📋</Text>
                </View>
                <Text style={styles.menuTitle}>Riwayat</Text>
                <Text style={styles.menuSubtitle}>Lihat data tersimpan</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    paddingBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    top: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  greetingText: {
    fontFamily: fonts.secondary[600],
    fontSize: 20,
    color: 'white',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  menuCard: {
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  menuGradient: {
    borderRadius: 20,
    padding: 25,
  },
  menuContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuIcon: {
    fontSize: 32,
  },
  menuTitle: {
    fontFamily: fonts.primary[700],
    fontSize: 22,
    color: '#31326F',
    marginBottom: 8,
    textAlign: 'center',
  },
  menuSubtitle: {
    fontFamily: fonts.primary[500],
    fontSize: 14,
    color: '#31326F',
    textAlign: 'center',
  },
  additionalContent: {
    paddingHorizontal: 20,
    marginTop: 40,
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: fonts.secondary[600],
    fontSize: 18,
    color: colors.primary,
    marginBottom: 10,
  },
  sectionDescription: {
    fontFamily: fonts.secondary[400],
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
