import axios from "axios";
import { watch } from "vue";
import { useAuth } from "@moreillon/vue-oidc";
import { useAuthReady } from "@/composables/useAuthReady";

export function setupAxiosAuth() {
    const { access_token } = useAuth();
    const { authReady } = useAuthReady();

    function waitForAuth(): Promise<void> {
        if (authReady.value) return Promise.resolve();

        return new Promise((resolve) => {
            const stop = watch(
                authReady,
                (ready) => {
                    if (ready) {
                        stop();
                        resolve();
                    }
                },
                { immediate: true }
            );
        });
    }

    axios.interceptors.request.use(
        async (config: any) => {
            await waitForAuth();

            const token = access_token.value;
            if (token) {
                // Axios v1 header API
                if (typeof config.headers?.set === "function") {
                    config.headers.set("Authorization", `Bearer ${token}`);
                } else {
                    config.headers = {
                        ...config.headers,
                        Authorization: `Bearer ${token}`,
                    };
                }
            }

            return config;
        },
        (error) => Promise.reject(error)
    );
}
