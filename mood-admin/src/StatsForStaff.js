import React, { useEffect, useState } from 'react';
import { variables } from './Variables';

const formatTo1DecimalPlace = (value) => {
  if (isNaN(value)) {
    return '--';
  }
  return parseFloat(value).toFixed(1);
};

const StatsForStaff = ({ studentId }) => {
  const [stats, setStats] = useState({
    today: {
      mood: 0.0,
      exercise: 0.0,
      sleep: 0.0,
      socialisation: 0.0,
      productivity: 0.0,
    },
    averages: {
      mood: 0.0,
      exercise: 0.0,
      sleep: 0.0,
      socialisation: 0.0,
      productivity: 0.0,
    },
    trends: {
      mood: 0.0,
      exercise: 0.0,
      sleep: 0.0,
      socialisation: 0.0,
      productivity: 0.0,
    },
  });

  useEffect(() => {
    if (studentId) {
      fetchStats(studentId);
    }
  }, [studentId]);

  const fetchStats = async (userId) => {
    try {
      const response = await fetch(`${variables.API_URL}stats/${userId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getTodayIcon = (value) => {
    if (value === null || value === '--') {
      return null;
    } else if (value >= 3) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>;
    } else if (value > 0) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>;
    } else {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>;
    }
  };

  const getTrendIcon = (value) => {
    if (value === null) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-grey-500"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>;
    } else if (value > 0) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>;
    } else if (value < 0) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;
    } else {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-grey-500"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>;
    }
  };

  return (
<div>      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-800">Student Stats</h4>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="font-semibold text-center text-gray-800">Today</div>
        <div className="font-semibold text-center text-gray-800">Avg (7 Days)</div>
        {['mood', 'exercise', 'sleep', 'socialisation', 'productivity'].map((key) => (
          <React.Fragment key={key}>
            <div className="text-center text-gray-700">
              <p className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
              <p className="flex items-center justify-center">
                {formatTo1DecimalPlace(stats.today[key] ?? '-')}/5 {getTodayIcon(formatTo1DecimalPlace(stats.today[key] ?? 0))}
              </p>
            </div>
            <div className="text-center text-gray-700">
              <p className="flex items-center justify-center">
                {formatTo1DecimalPlace(stats.averages[key] ?? 0)}/5 {getTrendIcon(stats.trends[key] ?? 0)}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div></div>


  );
};

export default StatsForStaff;
