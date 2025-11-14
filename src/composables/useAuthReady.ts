import { useAuth } from "@moreillon/vue-oidc";
import { ref, watch } from "vue";
const authReady = ref(false);
export function useAuthReady() {
    const { access_token } = useAuth();
    watch(
        access_token,
        (token) => {
            if (token) authReady.value = true;
        },
        { immediate: true }
    );
    return { authReady };
}