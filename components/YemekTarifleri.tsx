import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, TextInput } from 'react-native';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  image?: string;
  source?: string;
}

// Fallback için örnek tarifler
const sampleRecipes: Recipe[] = [
  {
    title: 'Mercimek Çorbası',
    ingredients: [
      '1 su bardağı kırmızı mercimek',
      '1 adet soğan',
      '1 adet havuç',
      '2 yemek kaşığı zeytinyağı',
      '1 tatlı kaşığı tuz',
      '1 çay kaşığı karabiber',
      '1.5 litre su',
    ],
    instructions: [
      'Mercimekleri yıkayın ve süzün.',
      'Soğan ve havucu küp küp doğrayın.',
      'Zeytinyağını tencereye alın, soğan ve havucu ekleyip kavurun.',
      'Mercimekleri ekleyin, 1-2 dakika daha kavurun.',
      'Suyu ekleyin, kaynatın ve mercimekler yumuşayana kadar pişirin.',
      'Blender ile çorba haline getirin.',
      'Tuz ve karabiber ekleyip servis edin.',
    ],
  },
  {
    title: 'Köfte',
    ingredients: [
      '500 gr kıyma',
      '1 adet soğan',
      '2 diş sarımsak',
      '1 yumurta',
      '2 yemek kaşığı galeta unu',
      'Tuz, karabiber, kimyon',
    ],
    instructions: [
      'Soğanı rendeleyin ve suyunu sıkın.',
      'Tüm malzemeleri karıştırın.',
      'Köfte şekli verin.',
      'Tavada veya ızgarada pişirin.',
    ],
  },
  {
    title: 'Pilav',
    ingredients: [
      '2 su bardağı pirinç',
      '3 su bardağı su',
      '2 yemek kaşığı tereyağı',
      '1 çay kaşığı tuz',
    ],
    instructions: [
      'Pirinci yıkayın ve süzün.',
      'Tereyağını eritin, pirinci ekleyip kavurun.',
      'Suyu ve tuzu ekleyin.',
      'Kısık ateşte suyunu çekene kadar pişirin.',
      '10 dakika dinlendirin.',
    ],
  },
  {
    title: 'Menemen',
    ingredients: [
      '4 adet yumurta',
      '2 adet domates',
      '2 adet biber',
      '1 adet soğan',
      '2 yemek kaşığı zeytinyağı',
      'Tuz, karabiber',
    ],
    instructions: [
      'Domates, biber ve soğanı küp küp doğrayın.',
      'Zeytinyağını tavaya alın, soğanı ekleyip kavurun.',
      'Biberi ekleyin, 2 dakika daha kavurun.',
      'Domatesi ekleyin, suyunu çekene kadar pişirin.',
      'Yumurtaları kırın, tuz ve karabiber ekleyin.',
      'Yumurtalar pişene kadar karıştırın.',
    ],
  },
  {
    title: 'Baklava',
    ingredients: [
      '1 kg yufka',
      '500 gr ceviz',
      '500 gr tereyağı',
      '3 su bardağı şeker',
      '2 su bardağı su',
      '1 çay bardağı limon suyu',
    ],
    instructions: [
      'Cevizi iri çekin.',
      'Yufkaları açın, aralarına ceviz serpin.',
      'Tereyağı ile yağlayın.',
      'Fırında altın rengi olana kadar pişirin.',
      'Şerbeti hazırlayın ve sıcak baklavaya dökün.',
    ],
  },
];

export default function YemekTarifleri({ onClose }: { onClose: () => void }) {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // İlk yüklemede popüler tarifleri getir
    if (searchQuery.length === 0) {
      fetchPopularRecipes();
    }
  }, []);

  const fetchPopularRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Edamam Recipe API - Ücretsiz tier mevcut
      // API key almak için: https://developer.edamam.com/
      const APP_ID = 'YOUR_APP_ID'; // Edamam'dan alın
      const APP_KEY = 'YOUR_APP_KEY'; // Edamam'dan alın
      
      // Türkçe popüler yemekler için arama
      const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=turkish+food&app_id=${APP_ID}&app_key=${APP_KEY}&to=10&lang=tr`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.hits && data.hits.length > 0) {
        const fetchedRecipes: Recipe[] = data.hits.map((hit: any) => {
          const recipe = hit.recipe;
          return {
            title: recipe.label,
            ingredients: recipe.ingredientLines || [],
            instructions: recipe.instructions ? recipe.instructions.split('\n').filter((i: string) => i.trim()) : [],
            image: recipe.image,
            source: recipe.source,
          };
        });
        setRecipes([...sampleRecipes, ...fetchedRecipes]);
      }
    } catch (err) {
      // API hatası durumunda örnek tarifler kullanılmaya devam eder
      console.error('Tarif API hatası:', err);
      setError('Online tarifler yüklenemedi, örnek tarifler gösteriliyor.');
    } finally {
      setLoading(false);
    }
  };

  const searchRecipes = async () => {
    if (searchQuery.trim().length < 2) {
      setRecipes(sampleRecipes);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const APP_ID = 'YOUR_APP_ID';
      const APP_KEY = 'YOUR_APP_KEY';
      const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(searchQuery)}&app_id=${APP_ID}&app_key=${APP_KEY}&to=20&lang=tr`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.hits && data.hits.length > 0) {
        const fetchedRecipes: Recipe[] = data.hits.map((hit: any) => {
          const recipe = hit.recipe;
          return {
            title: recipe.label,
            ingredients: recipe.ingredientLines || [],
            instructions: recipe.instructions ? recipe.instructions.split('\n').filter((i: string) => i.trim()) : [],
            image: recipe.image,
            source: recipe.source,
          };
        });
        setRecipes(fetchedRecipes);
      } else {
        setRecipes(sampleRecipes.filter(r => 
          r.title.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      }
    } catch (err) {
      // Hata durumunda yerel arama yap
      setRecipes(sampleRecipes.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setError('Online arama yapılamadı, yerel tarifler gösteriliyor.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = searchQuery.length > 0 
    ? recipes 
    : recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yemek Tarifleri</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {!selectedRecipe ? (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tarif ara..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (text.length >= 2) {
                  searchRecipes();
                } else if (text.length === 0) {
                  setRecipes(sampleRecipes);
                }
              }}
              placeholderTextColor="#999"
              onSubmitEditing={searchRecipes}
            />
            {loading && (
              <ActivityIndicator size="small" color="#03A9F4" style={styles.searchLoader} />
            )}
          </View>
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <ScrollView style={styles.recipesList}>
            {filteredRecipes.map((recipe, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recipeCard}
                onPress={() => setSelectedRecipe(recipe)}
              >
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeSubtitle}>
                  {recipe.ingredients.length} malzeme
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        <ScrollView style={styles.recipeDetail}>
          <View style={styles.recipeHeader}>
            <Text style={styles.recipeDetailTitle}>{selectedRecipe.title}</Text>
            <TouchableOpacity
              onPress={() => setSelectedRecipe(null)}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← Geri</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Malzemeler</Text>
            {selectedRecipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yapılışı</Text>
            {selectedRecipe.instructions.length > 0 ? (
              selectedRecipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noInstructionsText}>
                Bu tarif için yapılış bilgisi mevcut değil. Kaynak: {selectedRecipe.source || 'Bilinmiyor'}
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#03A9F4',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  searchLoader: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  errorBox: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
  recipesList: {
    flex: 1,
    padding: 15,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recipeSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  recipeDetail: {
    flex: 1,
    padding: 20,
  },
  recipeHeader: {
    marginBottom: 20,
  },
  recipeDetailTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#03A9F4',
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03A9F4',
    marginBottom: 15,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 20,
    color: '#03A9F4',
    marginRight: 10,
    marginTop: 2,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#03A9F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  noInstructionsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});

