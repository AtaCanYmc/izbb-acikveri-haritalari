import {useCallback, useEffect, useRef, useState} from "react";

export const useLocationPermission = () => {
    const [locationStatus, setLocationStatus] = useState<PermissionState>('prompt');
    const [showLocationWarning, setShowLocationWarning] = useState(true);
    const isMountedRef = useRef(true);

    const handleStatusChange = useCallback((state: PermissionState) => {
        if (!isMountedRef.current) {
            return;
        }
        setLocationStatus(state);
        setShowLocationWarning(state !== 'granted');
    }, []);

    const requestGeolocation = useCallback(() => {
        if (!('geolocation' in navigator) || !navigator.geolocation) {
            handleStatusChange('denied');
            return;
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
        requestGeolocation();
    }, [requestGeolocation]);

    useEffect(() => {
        isMountedRef.current = true;
        let permissionStatus: PermissionStatus | null = null;
        let onPermissionChange: (() => void) | null = null;

        const initPermission = async () => {
            if (navigator.permissions?.query) {
                try {
                    permissionStatus = await navigator.permissions.query({name: 'geolocation'});
                    if (!isMountedRef.current) {
                        return;
                    }
                    handleStatusChange(permissionStatus.state);
                    onPermissionChange = () => {
                        if (permissionStatus) {
                            handleStatusChange(permissionStatus.state);
                        }
                    };
                    permissionStatus.addEventListener('change', onPermissionChange);
                    return;
                } catch {
                    // Safari fallback below
                }
            }

            requestGeolocation();
        };

        void initPermission();

        return () => {
            isMountedRef.current = false;
            if (permissionStatus && onPermissionChange) {
                permissionStatus.removeEventListener('change', onPermissionChange);
            }
        };
    }, [handleStatusChange, requestGeolocation]);

    return {
        locationStatus,
        showLocationWarning,
        setShowLocationWarning,
        handleRetryLocationPermission,
    };
};
