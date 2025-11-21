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

type Lang = 'tr' | 'en' | 'ar';

const i18n = {
  tr: {
    searchPlaceholder: 'Tarif ara...',
    ingredients: 'Malzemeler',
    instructions: 'Yapılışı',
    back: '← Geri',
    noInstructions: 'Bu tarif için yapılış bilgisi mevcut değil. Kaynak: ',
    itemSuffix: ' malzeme',
    notes: {
      title: 'Notlar',
      add: 'Ekle',
      save: 'Kaydet',
      update: 'Güncelle',
      delete: 'Sil',
      cancel: 'Vazgeç',
      noteTitlePh: 'Not başlığı',
      noteBodyPh: 'Not içeriği',
      empty: 'Henüz not yok',
      done: 'Tamamlandı',
      undone: 'Aktif',
    },
  },
  en: {
    searchPlaceholder: 'Search recipes...',
    ingredients: 'Ingredients',
    instructions: 'Instructions',
    back: '← Back',
    noInstructions: 'No instructions available for this recipe. Source: ',
    itemSuffix: ' ingredients',
    notes: {
      title: 'Notes',
      add: 'Add',
      save: 'Save',
      update: 'Update',
      delete: 'Delete',
      cancel: 'Cancel',
      noteTitlePh: 'Note title',
      noteBodyPh: 'Note content',
      empty: 'No notes yet',
      done: 'Done',
      undone: 'Active',
    },
  },
  ar: {
    searchPlaceholder: 'ابحث عن وصفات...',
    ingredients: 'المكونات',
    instructions: 'طريقة التحضير',
    back: '← رجوع',
    noInstructions: 'لا توجد تعليمات لهذه الوصفة. المصدر: ',
    itemSuffix: ' مكونات',
    notes: {
      title: 'ملاحظات',
      add: 'إضافة',
      save: 'حفظ',
      update: 'تحديث',
      delete: 'حذف',
      cancel: 'إلغاء',
      noteTitlePh: 'عنوان الملاحظة',
      noteBodyPh: 'نص الملاحظة',
      empty: 'لا توجد ملاحظات بعد',
      done: 'مكتمل',
      undone: 'قيد العمل',
    },
  },
};

const sampleRecipesByLang: Record<Lang, Recipe[]> = {
  tr: [
    { title: 'Mercimek Çorbası', ingredients: ['1 su bardağı kırmızı mercimek', '1 adet soğan', '1 adet havuç', '2 yemek kaşığı zeytinyağı', '1 tatlı kaşığı tuz', '1 çay kaşığı karabiber', '1.5 litre su'], instructions: ['Mercimekleri yıkayın ve süzün.', 'Soğan ve havucu küp küp doğrayın.', 'Zeytinyağını tencereye alın, soğan ve havucu ekleyip kavurun.', 'Mercimekleri ekleyin, 1-2 dakika daha kavurun.', 'Suyu ekleyin, kaynatın ve mercimekler yumuşayana kadar pişirin.', 'Blender ile çorba haline getirin.', 'Tuz ve karabiber ekleyip servis edin.'] },
    { title: 'Köfte', ingredients: ['500 gr kıyma', '1 adet soğan', '2 diş sarımsak', '1 yumurta', '2 yemek kaşığı galeta unu', 'Tuz, karabiber, kimyon'], instructions: ['Soğanı rendeleyin ve suyunu sıkın.', 'Tüm malzemeleri karıştırın.', 'Köfte şekli verin.', 'Tavada veya ızgarada pişirin.'] },
    { title: 'Pilav', ingredients: ['2 su bardağı pirinç', '3 su bardağı su', '2 yemek kaşığı tereyağı', '1 çay kaşığı tuz'], instructions: ['Pirinci yıkayın ve süzün.', 'Tereyağını eritin, pirinci ekleyip kavurun.', 'Suyu ve tuzu ekleyin.', 'Kısık ateşte suyunu çekene kadar pişirin.', '10 dakika dinlendirin.'] },
    { title: 'Menemen', ingredients: ['4 adet yumurta', '2 adet domates', '2 adet biber', '1 adet soğan', '2 yemek kaşığı zeytinyağı', 'Tuz, karabiber'], instructions: ['Domates, biber ve soğanı küp küp doğrayın.', 'Zeytinyağını tavaya alın, soğanı ekleyip kavurun.', 'Biberi ekleyin, 2 dakika daha kavurun.', 'Domatesi ekleyin, suyunu çekene kadar pişirin.', 'Yumurtaları kırın, tuz ve karabiber ekleyin.', 'Yumurtalar pişene kadar karıştırın.'] },
    { title: 'Baklava', ingredients: ['1 kg yufka', '500 gr ceviz', '500 gr tereyağı', '3 su bardağı şeker', '2 su bardağı su', '1 çay bardağı limon suyu'], instructions: ['Cevizi iri çekin.', 'Yufkaları açın, aralarına ceviz serpin.', 'Tereyağı ile yağlayın.', 'Fırında altın rengi olana kadar pişirin.', 'Şerbeti hazırlayın ve sıcak baklavaya dökün.'] },
  ],
  en: [
    { title: 'Lentil Soup', ingredients: ['1 cup red lentils', '1 onion', '1 carrot', '2 tbsp olive oil', '1 tsp salt', '1 tsp black pepper', '1.5 liters water'], instructions: ['Rinse and drain the lentils.', 'Dice the onion and carrot.', 'Heat olive oil, add onion and carrot, sauté.', 'Add lentils and sauté 1–2 minutes.', 'Add water, boil and cook until lentils soften.', 'Blend into soup.', 'Season with salt and pepper and serve.'] },
    { title: 'Meatballs', ingredients: ['500 g ground beef', '1 onion', '2 garlic cloves', '1 egg', '2 tbsp breadcrumbs', 'Salt, pepper, cumin'], instructions: ['Grate the onion and squeeze out the juice.', 'Mix all ingredients.', 'Shape into meatballs.', 'Cook in pan or grill.'] },
    { title: 'Rice Pilaf', ingredients: ['2 cups rice', '3 cups water', '2 tbsp butter', '1 tsp salt'], instructions: ['Rinse and drain rice.', 'Melt butter, add rice and sauté.', 'Add water and salt.', 'Cook on low heat until water is absorbed.', 'Rest for 10 minutes.'] },
    { title: 'Menemen', ingredients: ['4 eggs', '2 tomatoes', '2 peppers', '1 onion', '2 tbsp olive oil', 'Salt, pepper'], instructions: ['Dice tomatoes, peppers and onion.', 'Heat olive oil, sauté onion.', 'Add peppers and sauté 2 minutes.', 'Add tomatoes and cook until reduced.', 'Crack eggs, season, and stir until set.'] },
    { title: 'Baklava', ingredients: ['1 kg phyllo', '500 g walnuts', '500 g butter', '3 cups sugar', '2 cups water', '1 small cup lemon juice'], instructions: ['Coarsely grind walnuts.', 'Layer phyllo with walnuts.', 'Brush with butter.', 'Bake until golden.', 'Prepare syrup and pour over hot baklava.'] },
  ],
  ar: [
    { title: 'شوربة العدس', ingredients: ['كوب عدس أحمر', 'بصلة', 'جزرة', 'ملعقتان زيت زيتون', 'ملعقة صغيرة ملح', 'ملعقة صغيرة فلفل أسود', '1.5 لتر ماء'], instructions: ['اغسل العدس وصفيه.', 'قطّع البصل والجزر.', 'سخّن الزيت وأضف البصل والجزر وقلّبهما.', 'أضف العدس وقلّب لمدة 1–2 دقيقة.', 'أضف الماء واتركه يغلي حتى يلين العدس.', 'اخلط ليصبح شوربة.', 'تبّل بالملح والفلفل وقدّم.'] },
    { title: 'كفتة', ingredients: ['500غ لحم مفروم', 'بصلة', 'فصّان ثوم', 'بيضة', 'ملعقتان بقسماط', 'ملح وفلفل وكمّون'], instructions: ['ابشر البصلة واعصرها.', 'اخلط جميع المكونات.', 'شكّل الكفتة.', 'اطبخ في المقلاة أو على الشواية.'] },
    { title: 'الأرز المفلفل', ingredients: ['كوبان أرز', '3 أكواب ماء', 'ملعقتان زبدة', 'ملعقة صغيرة ملح'], instructions: ['اغسل الأرز وصفّه.', 'أذب الزبدة وأضف الأرز وقلّبه.', 'أضف الماء والملح.', 'اطبخ على نار هادئة حتى يمتص الماء.', 'اتركه ليستريح 10 دقائق.'] },
    { title: 'منمن', ingredients: ['4 بيضات', '2 طماطم', '2 فلفل', 'بصلة', 'ملعقتان زيت زيتون', 'ملح وفلفل'], instructions: ['قطّع الطماطم والفلفل والبصل.', 'سخّن الزيت وقلّب البصل.', 'أضف الفلفل وقلّب لمدة دقيقتين.', 'أضف الطماطم واطبخ حتى تتبخر السوائل.', 'اكسر البيض وتبّل وحرّك حتى ينضج.'] },
    { title: 'بقلاوة', ingredients: ['1 كغ رقائق (فيلو)', '500غ جوز', '500غ زبدة', '3 أكواب سكر', '2 كوب ماء', 'عصير ليمون'], instructions: ['اطحن الجوز خشناً.', 'رصّ الرقاقات مع الجوز.', 'ادهن بالزبدة.', 'اخبز حتى يصبح ذهبياً.', 'حضّر القطر واسكبه فوق البقلاوة الساخنة.'] },
  ],
};

export default function YemekTarifleri({ onClose, title, language = 'tr' }: { onClose: () => void; title?: string; language?: Lang }) {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipesByLang[language]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // İlk yüklemede popüler tarifleri getir
    if (searchQuery.length === 0) {
      setRecipes(sampleRecipesByLang[language]);
    }
  }, [language]);


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
        <Text style={styles.headerTitle}>{title ?? 'Yemek Tarifleri'}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {!selectedRecipe ? (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={i18n[language].searchPlaceholder}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (text.length >= 2) {
                  searchRecipes();
                } else if (text.length === 0) {
                  setRecipes(sampleRecipesByLang[language]);
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
                  {recipe.ingredients.length}
                  {i18n[language].itemSuffix}
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
              <Text style={styles.backButtonText}>{i18n[language].back}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n[language].ingredients}</Text>
            {selectedRecipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n[language].instructions}</Text>
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
                {i18n[language].noInstructions}
                {selectedRecipe.source || (language === 'en' ? 'Unknown' : language === 'ar' ? 'غير معروف' : 'Bilinmiyor')}
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
  notesToggleContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  notesButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 25,
  },
  notesButtonText: {
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
  notesInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  notesTextArea: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    minHeight: 80,
  },
  notesActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 12,
    marginBottom: 10,
  },
  notesPrimaryButton: {
    backgroundColor: '#03A9F4',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
  },
  notesPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesSecondaryButton: {
    backgroundColor: '#B0BEC5',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  notesSecondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  noteTitleDone: {
    textDecorationLine: 'line-through',
    color: '#78909C',
  },
  noteMeta: {
    fontSize: 12,
    color: '#777',
  },
  noteBody: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 10,
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteActionButton: {
    backgroundColor: '#03A9F4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginRight: 10,
  },
  noteActionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noteDeleteButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  noteDeleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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

