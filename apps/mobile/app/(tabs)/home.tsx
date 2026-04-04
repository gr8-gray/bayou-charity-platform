import { View, Text, ScrollView } from 'react-native';

// TODO Phase 2: Migrate home section content from web
export default function HomeTab() {
  return (
    <ScrollView className="flex-1 bg-[#0d2b3e]">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-[#eef6fb] text-3xl font-bold mb-2">Bayou Charity</Text>
        <Text className="text-[#eef6fb]/80 text-base text-center">
          Home tab — Phase 2 migration pending.
        </Text>
      </View>
    </ScrollView>
  );
}
