
export const numberWithCommas = (x: number) => {
    const s = (x ?? 0).toString();
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const isPlaceholder = (value?: string) =>
    !value || value.includes("PLACEHOLDER");