import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalogService';
import { useDebounce } from '@/hooks/useDebounce';
import Card from '@/components/ProgramCard/Card';

function SearchView() {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);

    const { data: searchResults, isLoading, isError } = useQuery({
        queryKey: ['search', debouncedQuery],
        queryFn: () => catalogService.searchPrograms(debouncedQuery),
        enabled: debouncedQuery.trim().length > 0, // Solo buscar si hay texto
    });

    // Muestra el resultado solo en console.log de momento
    useEffect(() => {
        if (searchResults) {
            console.log('Resultados de Búsqueda:', searchResults);
        }
    }, [searchResults]);

    return (
        <div className='max-w-[70vw] mx-auto pt-16'>
            <input
                type="text"
                placeholder='Ingresa tu búsqueda...'
                className='w-full bg-[#2C404B] px-9 py-4 text-[#B9B9B9] text-[30px] font-medium focus:outline-none focus:ring-0 mb-10'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {isLoading && <p className="animate-pulse text-xl font-title">Buscando...</p>}
            <div className="text-white grid grid-cols-4 gap-4">

                {searchResults?.data.map((program) => (
                    <Card key={program.id} program={program} />
                ))}
                {isLoading && <p className="animate-pulse text-xl font-title">Buscando...</p>}
                {isError && <p className="text-red-500 text-xl font-title">Error al buscar</p>}
            </div>
        </div>
    )
}

export default SearchView