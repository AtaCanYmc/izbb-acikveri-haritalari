import {useCallback, useEffect, useState} from "react";

const POLLING_INTERVAL_MS = 5000;

const readPermissionState = async () => {
    if (navigator.permissions?.query) {
        const result = await navigator.permissions.query({name: 'geolocation'});
        return result.state;
    }

    return 'prompt' as PermissionState;
};

export const useLocationPermission = () => {
    const [locationStatus, setLocationStatus] = useState<PermissionState>('prompt');
    const [showLocationWarning, setShowLocationWarning] = useState(true);

    const handleStatusChange = useCallback((state: PermissionState) => {
        setLocationStatus(state);
        setShowLocationWarning(state !== 'granted');
    }, []);

    const checkLocationPermission = useCallback(async () => {
        try {
            const state = await readPermissionState();
            handleStatusChange(state);
            return;
        } catch {
            // Safari fallback below
        }

        navigator.geolocation.getCurrentPosition(
            () => handleStatusChange('granted'),
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    handleStatusChange('denied');
                }
            },
        );
    }, [handleStatusChange]);

    const handleRetryLocationPermission = useCallback(() => {
        setShowLocationWarning(false);
        void checkLocationPermission();
    }, [checkLocationPermission]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void checkLocationPermission();
        }, 0);

        const intervalId = window.setInterval(() => {
            void checkLocationPermission();
        }, POLLING_INTERVAL_MS);

        return () => {
            window.clearTimeout(timeoutId);
            window.clearInterval(intervalId);
        };
    }, [checkLocationPermission]);

    return {
        locationStatus,
        showLocationWarning,
        setShowLocationWarning,
        handleRetryLocationPermission,
    };
};
