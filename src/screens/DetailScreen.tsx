import { useEffect, useState } from 'react';
import { Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { RootStackParam } from '../navigation/AppNavigator';
import { BirdInfo } from '../types/Bird';

export default function DetailScreen() {
  const [birdInfo, setBirdInfo] = useState<BirdInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useRoute<RouteProp<RootStackParam>>().params;

  useEffect(() => {
    const loadBird = async () => {
      try {
        const data = (await axios.get<BirdInfo>(`${params?.bird._links.self}`)).data;
        setBirdInfo(data);
      } catch (error) {
        console.error('Error al cargar ave');
      } finally {
        setLoading(false);
      }
    };

    loadBird();
  }, [params]);

  if (loading || !params?.bird) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Image source={{ uri: params?.bird.images.full }} style={styles.image} />

      <Text style={styles.title}>
        {birdInfo?.name.spanish} / {birdInfo?.name.english}
      </Text>

      <Text style={styles.section}>IUCN: {birdInfo?.iucn.title}</Text>
      <Text style={styles.text}>{birdInfo?.iucn.description}</Text>


      <Text style={styles.section}>Ubicación:</Text>
      <Text style={styles.text}>{birdInfo?.map.title}</Text>

      <Text style={styles.section}>Tipo de especie:</Text>
      <Text style={styles.text}>{birdInfo?.species}</Text>

      <Text style={styles.section}>Hábitat:</Text>
      <Text style={styles.text}>{birdInfo?.habitat}</Text>

      <Text style={styles.section}>¿Sabías qué?:</Text>
      <Text style={styles.text}>{birdInfo?.didyouknow}</Text>

      <Text style={styles.section}>Medidas:</Text>
      <Text style={styles.text}>{birdInfo?.size}</Text>

      <Text style={styles.section}>Mapa de ubicación:</Text>
      <WebView
        originWhitelist={['*']}
        source={{ uri: `${birdInfo?.map.image}` }}
        style={styles.svg}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'justify',
    fontStyle: 'italic',
    fontWeight: 'normal',
  },
  svg: {
    height: 250,
    width: '100%',
    marginTop: 10,
    marginBottom: 20
  },
});
