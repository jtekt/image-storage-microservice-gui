export function useCustomHeader() {
    const defaultStorageKey = "customTableHeaders";

    type Header = { value: string; text: string; width?: string; visible?: boolean };

    const normalize = (h: Header): Header => ({
        ...h,
        visible: h.visible ?? true,
    });

    const restoreHeaders = (incoming: Header[], storageKey = defaultStorageKey): Header[] => {
        const safeIncoming = (incoming ?? []).map(normalize);

        const storedRaw = localStorage.getItem(storageKey);
        if (!storedRaw) return safeIncoming;

        try {
            const stored = JSON.parse(storedRaw) as Header[];
            if (!Array.isArray(stored) || stored.length === 0) return safeIncoming;

            const storedMap = new Map(stored.map((h) => [h.value, h]));

            // Merge: keep incoming list/order, apply stored prefs where present
            return safeIncoming.map((h) => {
                const s = storedMap.get(h.value);
                if (!s) return h;

                return normalize({
                    ...h,
                    visible: s.visible ?? h.visible,
                    width: s.width ?? h.width,
                });
            });
        } catch (e) {
            console.error("Failed to parse stored headers", e);
            return safeIncoming;
        }
    };

    const saveHeaders = (headers: Header[], storageKey = defaultStorageKey) => {
        localStorage.setItem(storageKey, JSON.stringify(headers ?? []));
    };

    return { restoreHeaders, saveHeaders };
}
