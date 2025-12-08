
export function useCustomHeader() {
    const storageKey = "customTableHeaders";

    const ensureVisibleField = (arr: any[]) =>
        (arr || []).map((h) => ({ ...h, visible: h.visible ?? true }));

    const restoreHeaders = (headers: { value: string; text: string; width?: string; visible?: boolean }[]) => {
        const stored = localStorage.getItem(storageKey);
        let newHeaders = headers;
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return ensureVisibleField(parsed);
                }
            } catch (e) {
                console.error("Failed to parse stored headers", e);
                return headers
            }
        }
        return ensureVisibleField(newHeaders || []);
    };

    return {
        restoreHeaders
    }
}