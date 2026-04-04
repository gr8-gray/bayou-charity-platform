import { View, Text, TouchableOpacity } from 'react-native';
import { createClient } from '@bayou/supabase';

// TODO Phase 2: Full OAuth flow (Google + Facebook + Apple)
export default function SignInScreen() {
  const handleGoogleSignIn = async () => {
    const sb = createClient();
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'bayoucharity://auth/callback' },
    });
    if (error) console.error('Sign in error:', error.message);
  };

  return (
    <View className="flex-1 bg-[#0d2b3e] items-center justify-center p-6">
      <Text className="text-[#eef6fb] text-2xl font-bold mb-8">Sign In</Text>
      <TouchableOpacity
        onPress={handleGoogleSignIn}
        className="bg-[#e8923a] rounded-xl px-8 py-4"
      >
        <Text className="text-white font-semibold">Continue with Google</Text>
      </TouchableOpacity>
      <Text className="text-[#4a6070] text-sm mt-6 text-center">
        Facebook and Apple sign-in coming in Phase 2.
      </Text>
    </View>
  );
}
