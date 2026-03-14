export const createGoogleMapsUrl = (latitude: number, longitude: number) => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
};

export const createPhoneUrl = (phone: string) => {
    return `tel:${phone.replace(/\s+/g, '')}`;
};

