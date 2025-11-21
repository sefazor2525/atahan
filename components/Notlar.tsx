import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Lang = 'tr' | 'en' | 'ar';

type NoteItem = { id: string; title: string; body: string; done: boolean; updatedAt: number };

export default function Notlar({ onClose, title, language = 'tr' }: { onClose: () => void; title?: string; language?: Lang }) {
  const i18n = {
    tr: {
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
    en: {
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
    ar: {
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
  } as const;

  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const loadNotes = async () => {
      const raw = await AsyncStorage.getItem('notes');
      if (raw) {
        try {
          const parsed: NoteItem[] = JSON.parse(raw);
          setNotes(parsed);
        } catch {}
      }
    };
    loadNotes();
  }, []);

  const persistNotes = async (list: NoteItem[]) => {
    setNotes(list);
    await AsyncStorage.setItem('notes', JSON.stringify(list));
  };

  const addOrUpdateNote = async () => {
    if (noteTitle.trim().length === 0 && noteBody.trim().length === 0) return;
    if (editingId) {
      const updated = notes.map(n => n.id === editingId ? { ...n, title: noteTitle, body: noteBody, updatedAt: Date.now() } : n);
      await persistNotes(updated);
      setEditingId(null);
    } else {
      const newItem: NoteItem = { id: Date.now().toString(), title: noteTitle, body: noteBody, done: false, updatedAt: Date.now() };
      await persistNotes([newItem, ...notes]);
    }
    setNoteTitle('');
    setNoteBody('');
  };

  const deleteNote = async (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    await persistNotes(updated);
  };

  const toggleDone = async (id: string) => {
    const updated = notes.map(n => n.id === id ? { ...n, done: !n.done, updatedAt: Date.now() } : n);
    await persistNotes(updated);
  };

  const startEdit = (note: NoteItem) => {
    setEditingId(note.id);
    setNoteTitle(note.title);
    setNoteBody(note.body);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title ?? i18n[language].title}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n[language].title}</Text>
          <TextInput
            style={styles.input}
            placeholder={i18n[language].noteTitlePh}
            value={noteTitle}
            onChangeText={setNoteTitle}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.textArea}
            placeholder={i18n[language].noteBodyPh}
            value={noteBody}
            onChangeText={setNoteBody}
            placeholderTextColor="#999"
            multiline
          />
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={addOrUpdateNote}>
              <Text style={styles.primaryButtonText}>{editingId ? i18n[language].update : i18n[language].add}</Text>
            </TouchableOpacity>
            {editingId && (
              <TouchableOpacity style={styles.secondaryButton} onPress={() => { setEditingId(null); setNoteTitle(''); setNoteBody(''); }}>
                <Text style={styles.secondaryButtonText}>{i18n[language].cancel}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {notes.length === 0 ? (
          <Text style={styles.emptyText}>{i18n[language].empty}</Text>
        ) : (
          notes.map((n) => (
            <View key={n.id} style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <Text style={[styles.noteTitle, n.done ? styles.noteTitleDone : null]}>{n.title || i18n[language].title}</Text>
                <Text style={styles.noteMeta}>{new Date(n.updatedAt).toLocaleString()}</Text>
              </View>
              {n.body ? <Text style={styles.noteBody}>{n.body}</Text> : null}
              <View style={styles.noteActions}>
                <TouchableOpacity style={styles.noteActionButton} onPress={() => toggleDone(n.id)}>
                  <Text style={styles.noteActionButtonText}>{n.done ? i18n[language].done : i18n[language].undone}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.noteActionButton} onPress={() => startEdit(n)}>
                  <Text style={styles.noteActionButtonText}>{i18n[language].update}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.noteDeleteButton} onPress={() => deleteNote(n.id)}>
                  <Text style={styles.noteDeleteButtonText}>{i18n[language].delete}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
    backgroundColor: '#607D8B',
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
  content: {
    flex: 1,
    padding: 20,
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
    color: '#607D8B',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: '#607D8B',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#B0BEC5',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  secondaryButtonText: {
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
    marginTop: 8,
  },
  noteActionButton: {
    backgroundColor: '#607D8B',
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
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});