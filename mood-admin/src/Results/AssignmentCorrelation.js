import React, { useEffect, useState } from 'react';
import { variables } from '../Variables';

const AssignmentCorrelation = () => {
    const [correlations, setCorrelations] = useState([]);

    useEffect(() => {
        console.log('AssignmentCorrelation component mounted');
        const fetchData = async () => {
            try {
                const response = await fetch(`${variables.API_URL}assignment-correlation`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch assignment correlation');
                }
    
                const data = await response.json();
                console.log('Fetched data:', data); // Debugging line to check the data
                setCorrelations(data.correlations || []);
            } catch (error) {
                console.error('Error fetching assignment correlation:', error);
            }
        };
    
        fetchData();
    }, []);
    

    if (correlations.length === 0) {
        return null;
    }

    return (
        <div className="p-4 bg-red-100 border border-red-400 rounded-md my-4">
            <h3 className="text-red-800 font-semibold">High Stress Alerts</h3>
            {correlations.length === 0 ? (
                <p>No correlations found.</p>
            ) : (
                correlations.map((correlation, index) => (
                    <div key={index} className="mb-4">
                        <p>
                            <strong>{correlation.academic_year_name} {correlation.course_name} students</strong> are reporting high stress levels.
                        </p>
                        <p>They have the following assignments due soon:</p>
                        <ul className="list-disc list-inside">
                            {correlation.assignments.map((assignment, index) => (
                                <li key={index}>
                                    {assignment.assignment_name} is due in {assignment.days_until_due} days.
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default AssignmentCorrelation;
