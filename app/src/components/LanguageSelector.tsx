import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { languages, setStoredLanguage } from '@/src/i18n';
import { SteppeText } from './SteppeText';
import { Colors } from '@/constants/Colors';

interface Props {
  style?: any;
  compact?: boolean;
}

export function LanguageSelector({ style, compact }: Props) {
  const { i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  
  const currentLang = languages.find(l => l.code === i18n.language) || languages[1];

  const selectLanguage = async (code: string) => {
    await setStoredLanguage(code);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={[styles.selector, style]} 
        onPress={() => setModalVisible(true)}
      >
        <SteppeText style={styles.flag}>{currentLang.flag}</SteppeText>
        {!compact && <SteppeText style={styles.langName}>{currentLang.name}</SteppeText>}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modal}>
            <SteppeText style={styles.modalTitle}>Select Language</SteppeText>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langOption,
                  i18n.language === lang.code && styles.langOptionActive
                ]}
                onPress={() => selectLanguage(lang.code)}
              >
                <SteppeText style={styles.langFlag}>{lang.flag}</SteppeText>
                <SteppeText style={[
                  styles.langOptionText,
                  i18n.language === lang.code && styles.langOptionTextActive
                ]}>
                  {lang.name}
                </SteppeText>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  flag: {
    fontSize: 20,
  },
  langName: {
    fontSize: 14,
    color: '#333',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    gap: 12,
  },
  langOptionActive: {
    backgroundColor: Colors.yellow,
  },
  langFlag: {
    fontSize: 24,
  },
  langOptionText: {
    fontSize: 16,
    color: '#333',
  },
  langOptionTextActive: {
    fontWeight: '600',
  },
});