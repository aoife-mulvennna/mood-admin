import React, { useEffect, useState } from 'react';
import { variables } from './Variables';

const TagStatistics = ({ tagName }) => {
    const [percentage, setPercentage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTagStatistics = async () => {
            try {
                const response = await fetch(`${variables.API_URL}tag-statistics?tagName=${tagName}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tag statistics');
                }

                const data = await response.json();
                setPercentage(data.percentage);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTagStatistics();
    }, [tagName]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="tag-statistics">
            <p>In the last month, {percentage}% of students have experienced {tagName}.</p>
        </div>
    );
};

const ResultsPage = () => {
    return (
        <div className="results-page">
            <h1>Results</h1>
            <TagStatistics tagName="stress" />
            {/* You can add more <TagStatistics /> components for different tags if needed */}
        </div>
    );
};

export default ResultsPage;
