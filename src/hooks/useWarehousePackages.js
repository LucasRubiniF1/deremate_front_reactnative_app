import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { fetchPackagesInWarehouse } from '../service/package.service';

export const useWarehousePackages = () => {
    const [packages, setPackages] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [sector, setSector] = useState('');
    const [shelf, setShelf] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await fetchPackagesInWarehouse();
                setPackages(data);
                setFiltered(data);
            } catch (err) {
                Alert.alert('Error', 'No se pudieron cargar los paquetes.');
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    useEffect(() => {
        const filteredList = packages.filter(pkg => {
            const matchCode = !code || pkg.id.toString().includes(code);
            const matchSector = !sector || pkg.packageLocation?.toLowerCase().includes(`sector ${sector}`.toLowerCase());
            const matchShelf = !shelf || pkg.packageLocation?.toLowerCase().includes(`estante ${shelf}`.toLowerCase());
            return matchCode && matchSector && matchShelf;
        });

        setFiltered(filteredList);
    }, [code, sector, shelf, packages]);

    return {
        packages: filtered,
        loading,
        code, setCode,
        sector, setSector,
        shelf, setShelf
    };
};
