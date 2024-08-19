import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';

const StaffResources = () => {
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [newResource, setNewResource] = useState({ name: '', link: '', topic: '' });
    const [resourceTopics, setResourceTopics] = useState([]);
    const [editResourceId, setEditResourceId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchResources();
        fetchResourceTopics();
    }, []);

    const fetchResources = () => {
        fetch(`${variables.API_URL}staff-resources`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setResources(data.resources);
                setFilteredResources(data.resources);
            })
            .catch(error => console.error('Error fetching resources:', error));
    };

    const fetchResourceTopics = () => {
        fetch(`${variables.API_URL}resource-topics`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => setResourceTopics(data.resourceTopics))
            .catch(error => console.error('Error fetching resource topics:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewResource(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddResource = async () => {
        try {
            const response = await fetch(`${variables.API_URL}staff-resources`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    resource_name: newResource.name,
                    resource_link: newResource.link,
                    resource_topic_id: newResource.topic
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }

            fetchResources();
            setNewResource({ name: '', link: '', topic: '' });
        } catch (error) {
            console.error('Error adding resource:', error);
            setError('Failed to add resource.');
        }
    };

    const handleEditResource = (resource) => {
        setNewResource({ name: resource.resource_name, link: resource.resource_link, topic: resource.resource_topic_id });
        setEditResourceId(resource.resource_id);
    };

    const handleUpdateResource = async () => {
        try {
            const response = await fetch(`${variables.API_URL}staff-resources/${editResourceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    resource_name: newResource.name,
                    resource_link: newResource.link,
                    resource_topic_id: newResource.topic
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }

            fetchResources();
            setNewResource({ name: '', link: '', topic: '' });
            setEditResourceId(null);
        } catch (error) {
            console.error('Error updating resource:', error);
            setError('Failed to update resource.');
        }
    };

    const handleDeleteResource = async (resourceId) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;

        try {
            const response = await fetch(`${variables.API_URL}staff-resources/${resourceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }

            fetchResources();
        } catch (error) {
            console.error('Error deleting resource:', error);
            setError('Failed to delete resource.');
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredResources(
            resources.filter(resource =>
                resource.resource_name.toLowerCase().includes(query) ||
                resource.resource_topic_name.toLowerCase().includes(query)
            )
        );
    };

    return (
        <div className="max-w-7xl mx-auto mt-12 p-6 bg-white rounded-lg">
            <h3 className="text-center text-2xl font-semibold mb-6 text-gray-800">Manage Resources</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                <input
                    type="text"
                    name="name"
                    value={newResource.name}
                    onChange={handleInputChange}
                    placeholder="Resource Name"
                    className="mb-2 p-2 border rounded w-full"
                />
                <input
                    type="text"
                    name="link"
                    value={newResource.link}
                    onChange={handleInputChange}
                    placeholder="Resource Link"
                    className="mb-2 p-2 border rounded w-full"
                />
                <select
                    name="topic"
                    value={newResource.topic}
                    onChange={handleInputChange}
                    className="mb-2 p-2 border rounded w-full"
                >
                    <option value="">Select Topic</option>
                    {resourceTopics.map(topic => (
                        <option key={topic.resource_topic_id} value={topic.resource_topic_id}>
                            {topic.resource_topic_name}
                        </option>
                    ))}
                </select>
                <div className="flex justify-end">
                    <button
                        onClick={editResourceId ? handleUpdateResource : handleAddResource}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 transition"
                    >
                        {editResourceId ? 'Update Resource' : 'Add Resource'}
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search Resources"
                    className="p-2 border rounded w-full"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left border-b">Resource Name</th>
                            <th className="px-4 py-2 text-left border-b">Upload Date</th>
                            <th className="px-4 py-2 text-left border-b">Topic</th>
                            <th className="px-4 py-2 text-left border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResources.map((resource, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-left border-b">
                                    <a href={resource.resource_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {resource.resource_name}
                                    </a>
                                </td>
                                <td className="px-4 py-2 text-left border-b text-sm text-gray-500">
                                    {new Date(resource.resource_added_date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 text-left border-b text-sm text-gray-700">
                                    {resource.resource_topic_name}
                                </td>
                                <td className="px-4 py-2 text-left border-b">
                                    <button onClick={() => handleEditResource(resource)} className="text-yellow-500 hover:text-yellow-700 mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                    <button onClick={() => handleDeleteResource(resource.resource_id)} className="text-red-500 hover:text-red-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffResources;
