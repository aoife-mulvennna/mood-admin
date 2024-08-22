import React, { useEffect, useState } from 'react';
import { variables } from '../Variables';

const ConcerningCohorts = () => {
    const [isConcerning, setIsConcerning] = useState(false);
    const [concerningCohorts, setConcerningCohorts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${variables.API_URL}identify-concerning-cohorts`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch concerning cohorts');
                }
                const data = await response.json();
                console.log('Fetched Data:', data);
                setIsConcerning(data.isConcerning);
                setConcerningCohorts(data.concerningCohorts || []);
            } catch (error) {
                console.error('Error fetching concerning cohorts:', error);
            }
        };
        fetchData();
    }, []);

    if (!isConcerning) {
        return null;
    }

    const formatList = (items) => {
        if (!Array.isArray(items)) return ''; // Ensure items is an array
        if (items.length === 1) return items[0];
        if (items.length === 2) return items.join(' and ');
        return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
    };

    return (
        <div className="p-4 bg-yellow-100 border border-yellow-400 my-4">
            <h3 className="text-yellow-800 font-semibold">Concerning Cohorts</h3>
            {concerningCohorts.map((cohort, index) => {
                const concerns = [
                    cohort.avgMood < 3 && "low mood",
                    cohort.avgExercise < 2 && "low exercise",
                    cohort.avgSleep < 2 && "poor sleep",
                    cohort.avgSocialisation < 2 && "low socialisation",
                    cohort.avgProductivity < 2 && "low productivity"
                ].filter(Boolean);

                return (
                    <div key={index} className="mt-4">
                        <p className="font-semibold">{cohort.academicYear} Year {cohort.courseName} </p>
                        <div>
                            {concerns.length > 0 ? (
                                <p>
                                    Experiencing{" "}
                                    {formatList(concerns)}
                                </p>
                            ) : null}
                            {cohort.frequentTags && cohort.frequentTags.length > 0 && (
                                <p>Common tags: {formatList(cohort.frequentTags)}</p>
                            )}
                            {cohort.earliestAssignment && (
                                <p>Upcoming assignment on: {new Date(cohort.earliestAssignment).toLocaleDateString()}</p>
                            )}
                            <p>Number of Students: {cohort.studentCount} (testing)</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ConcerningCohorts;
