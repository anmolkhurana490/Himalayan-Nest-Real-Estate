// Properties List View - Browse and search properties
import SearchFilterBar from '@/features/properties/components/SearchFilterBar'
import usePropertyServerViewModel from '../viewmodel/propertyServerViewModel';
import PropertyCard from '@/features/properties/components/PropertyCard';
import { searchPropertySchema } from '../validation';
import { validateWithSchema } from '@/utils/validator';
import Pagination from '../components/Pagination';
import APP_CONFIG from '@/config/app.config';

const PropertiesListView = async ({ searchParams }) => {
    const { getProperties } = usePropertyServerViewModel();

    // const searchParams = useSearchParams();
    const filters = await searchParams;

    const loadProperties = async (searchFilters = {}) => {
        const filters = {};
        Object.entries(searchFilters).forEach(([key, value]) => {
            if (value && value.toString().trim()) {
                filters[key] = value;
            }
        });

        const errors = validateWithSchema(searchPropertySchema, filters);
        if (errors && errors.length > 0) {
            const errorMessage = errors.map((e) => e.message).join('\\n');
            // toast.error(errorMessage);
            return {};
        }

        const options = {
            limit: parseInt(filters.limit) || APP_CONFIG.DEFAULT_PAGE_SIZE,
            page: parseInt(filters.page) || 1
        }

        let result = await getProperties(searchFilters || filters, options);

        if (result && result.success) {
            let propertiesData = result.properties || result.data || [];
            const pageValues = { limit: options.limit, currPage: options.page, totalPages: result.totalPages };

            return { properties: propertiesData, paginationValues: pageValues };
        } else {
            const errorMessage = result?.message || 'Failed to load properties';
            // toast.error(errorMessage);
            return {};
        }
    };

    const { properties, paginationValues } = await loadProperties(filters || {});

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Properties</h1>
                    <SearchFilterBar searchParams={filters || {}} />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
                {properties.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>

            {properties.length > 0 && <Pagination values={paginationValues} />}
        </div>
    );
};

export default PropertiesListView;