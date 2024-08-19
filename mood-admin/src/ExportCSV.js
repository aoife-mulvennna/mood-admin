import React from 'react';
import { variables } from './Variables';

const ExportCSVButton = () => {
    const downloadCSV = () => {
        const token = sessionStorage.getItem('token'); // Assuming your token is stored in sessionStorage

        fetch(`${variables.API_URL}export-dailytrack-csv`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error('Failed to download CSV');
                }
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const currentDateTime = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
                a.download = `DailyTrack_${currentDateTime}.csv`;

                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(error => {
                console.error('Error downloading CSV:', error);
            });
    };


    return (
        <button
            onClick={downloadCSV}
            className="bg-gray-500 text-white px-4 py-2 flex hover:bg-gray-600"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg> Download CSV
        </button>
    );
};

export default ExportCSVButton;
