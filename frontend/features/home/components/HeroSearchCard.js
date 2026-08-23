// Property Search Card for Hero Section

"use client";
import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import ROUTES from '@/config/constants/routes';
import { LEGACY_PROPERTY_TYPES, PRICE_RANGES } from "@/config/constants/property";
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const HeroSearchCard = () => {
	const [activeTab, setActiveTab] = useState("buy"); // Toggle between buy/rent
	const [searchData, setSearchData] = useState({
		location: '',
		category: '',
		budget: '',
		keywords: ''
	});
	const [isSearching, setIsSearching] = useState(false);
	const router = useRouter();

	// Handle tab switching between buy and rent
	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};

	// Update search form data
	const handleInputChange = (field, value) => {
		setSearchData(prev => ({
			...prev,
			[field]: value
		}));
	};

	// Process search and navigate to properties page with filters
	const handleSearch = async () => {
		setIsSearching(true);

		try {
			if (searchData.budget < PRICE_RANGES.MIN) {
				throw Error(`Budget can't be less than ${PRICE_RANGES.MIN}`);
			}

			const searchParams = {
				...searchData,
				purpose: activeTab // Add buy/rent preference
			};

			// Build URL query parameters for navigation
			const urlParams = new URLSearchParams();
			Object.entries(searchParams).forEach(([key, value]) => {
				if (value && value !== '') {
					urlParams.append(key, value);
				}
			});

			// Navigate to properties page with search parameters
			router.push(`${ROUTES.PROPERTIES.ROOT}?${urlParams.toString()}`);
		} catch (error) {
			// console.error('Search error:', error.message);
			toast.error(error.message);
		} finally {
			setIsSearching(false);
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-2xl px-4 py-6 sm:p-8 max-w-5xl mx-auto">
			{/* Buy/Rent Tabs */}
			<div className="flex justify-center mb-4 sm:mb-8">
				<div className="bg-gray-100 rounded-xl sm:p-2 flex">
					<button
						className={`px-4 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === "buy"
							? "bg-green-600 text-white shadow-lg"
							: "text-gray-600 hover:text-green-600"
							}`}
						onClick={() => handleTabChange("buy")}
					>
						Buy Property
					</button>
					<button
						className={`px-4 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === "rent"
							? "bg-green-600 text-white shadow-lg"
							: "text-gray-600 hover:text-green-600"
							}`}
						onClick={() => handleTabChange("rent")}
					>
						Rent Property
					</button>
				</div>
			</div>

			{/* Search Form */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">Location</label>
					<input
						type="text"
						placeholder="Enter city or area..."
						value={searchData.location}
						onChange={(e) => handleInputChange('location', e.target.value)}
						className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 max-sm:text-sm"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">Property Type</label>
					<select
						value={searchData.category}
						onChange={(e) => handleInputChange('category', e.target.value)}
						className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 max-sm:text-sm"
					>
						<option value="">All Types</option>
						{LEGACY_PROPERTY_TYPES.map(type => (
							<option key={type.value} value={type.value}>{type.label}</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">
						Budget {activeTab === 'rent' ? '(per month)' : ''}
					</label>
					<input
						type="number"
						placeholder={activeTab === 'rent' ? "Your Monthly Budget (in ₹)" : "Your Budget (in ₹)"}
						value={searchData.budget}
						onChange={(e) => handleInputChange('budget', e.target.value)}
						className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 max-sm:text-sm"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">Keywords</label>
					<input
						type="text"
						placeholder="2BHK, furnished, parking..."
						value={searchData.keywords}
						onChange={(e) => handleInputChange('keywords', e.target.value)}
						className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 max-sm:text-sm"
					/>
				</div>
			</div>

			<div className="text-center">
				<button
					onClick={handleSearch}
					disabled={isSearching}
					className={`bg-green-600 hover:bg-green-700 text-white px-6 sm:px-12 py-2 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
				>
					<Search className="w-7 h-7 inline mr-2" strokeWidth={2.5} />
					{isSearching ? 'Searching...' : 'Search Properties'}
				</button>
			</div>
		</div>
	)
}

export default HeroSearchCard;