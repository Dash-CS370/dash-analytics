import { fetchProjects } from '@/components/pages/dashboards/backendInteractions';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function Auth() {
    const router = useRouter();

    useEffect(() => {
        fetchProjects()
            .then((projects) => {
                console.log('projects:', projects);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return <div>Loading...</div>;
}
