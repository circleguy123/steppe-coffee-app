import { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, gql } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { Colors } from "@/constants/Colors";
import { LanguageSelector } from "@/src/components/LanguageSelector";

const BARISTA_LOGIN = gql`
  mutation BaristaLogin($phone: String!, $password: String!) {
    baristaLogin(phone: $phone, password: $password) {
      success
      token
      message
      user {
        id
        name
        phone
        role
      }
    }
  }
`;

export default function BaristaLogin() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [login, { loading }] = useMutation(BARISTA_LOGIN, {
    onCompleted: async (data) => {
      if (data.baristaLogin.success) {
        await AsyncStorage.setItem("barista_token", data.baristaLogin.token);
        await AsyncStorage.setItem("barista_user", JSON.stringify(data.baristaLogin.user));
        router.replace("/(app)/barista/dashboard");
      } else {
        Alert.alert(t('common.error'), data.baristaLogin.message || t('barista.invalidCredentials'));
      }
    },
    onError: (error) => {
      Alert.alert(t('common.error'), error.message);
    },
  });

  const handleLogin = () => {
    if (!phone || !password) {
      Alert.alert(t('common.error'), t('auth.enterPhone'));
      return;
    }
    login({ variables: { phone, password } });
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.languageContainer, { top: insets.top + 10 }]}>
        <LanguageSelector compact />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <SteppeTitle style={styles.title}>{t('barista.staffLogin')}</SteppeTitle>
          <SteppeText style={styles.subtitle}>Steppe Coffee</SteppeText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <SteppeText style={styles.label}>{t('auth.phone')}</SteppeText>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+7 (___) ___-__-__"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <SteppeText style={styles.label}>{t('barista.password')}</SteppeText>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <SteppeText style={styles.buttonText}>
              {loading ? t('common.loading') : t('barista.loginButton')}
            </SteppeText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.backLink}
          onPress={() => router.back()}
        >
          <SteppeText style={styles.backText}>{t('common.back')}</SteppeText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  languageContainer: {
    position: "absolute",
    right: 16,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: Colors.yellow,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  backLink: {
    alignItems: "center",
    marginTop: 24,
  },
  backText: {
    fontSize: 14,
    color: "#666",
  },
});