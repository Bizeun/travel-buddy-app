import{ThemedText} from "@/components/ThemedText";
import{ThemedView} from "@/components/ThemedView";
import{Button, StyleSheet} from "react-native";
import { supabase } from '@/lib/supaClient';
import{Alert} from "react-native";
import{useAuth} from "@/context/AuthContext";

export default function ProfileScreen() {
    const {user} = useAuth();
    const handleLogout = async() => {
        const{error} = await supabase.auth.signOut();
        if(error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Profile</ThemedText>
            {user && (
                <ThemedText>
                    Welcome,{user.email}
                </ThemedText>
            )}
            <Button title="Logout" onPress={handleLogout} />
        </ThemedView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});


