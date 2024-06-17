import React, { Component } from 'react';
import { variables } from './Variables.js';
export class Viewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            moods: [],
            mood_id: 0,
            mood_name: "",
            mood_time: ""
        }
    }
    refreshList() {
        fetch(variables.API_URL + 'mood')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                this.setState({ moods: data });
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    componentDidMount() {
        this.refreshList();
    }
    render() {
        const {
            moods, mood_id, mood_name, mood_time
        } = this.state

        return (
            <div>
                <h3>This is Viewer page</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>
                                Mood Id
                            </th>
                            <th>
                                Mood Name
                            </th>
                            <th>
                                Mood time stamp
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {moods.map(md =>
                            <tr key={md.mood_id}>
                                <td>{md.mood_id}</td>
                                <td>{md.mood_name}</td>
                                <td>{md.mood_time}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}