import React, { Component } from 'react';
import { variables } from './Variables.js';

export class Logger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            moods: [],
            mood_id: 0,
            mood_name: ""
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

    logClick(moodName) {
        fetch(variables.API_URL + 'mood', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // mood_name: this.state.mood_name
                mood_name: moodName
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList()
            })
            .catch((error) => {
                alert('Failed');
                console.error('Error:', error);
            });

    }
    render() {
        return (
            <div>
                <div>How do you feel today?</div>
                <button type="button" className="btn btn-primary m-2" onClick={() => this.logClick('Happy')}>
                    Happy
                </button>
                <button type="button" className="btn btn-primary m-2" onClick={() => this.logClick('Sad')}>
                    Sad
                </button>
                {/* <div>What are your energy levels like?</div>
                <button type="button" className="btn btn-primary m-2" >
                    Low Energy
                </button>
                <button type="button" className="btn btn-primary m-2" >
                    Energised
                </button> */}
            </div>
            
        )
    }
}