import React from 'react';
import Fade from 'react-reveal/Fade'; 

//use the template found online to change the style
class Form extends React.Component{

    constructor(props) {
        super(props)

        this.state = {
            query: ''
        }
    }

    handleQueryChange = (event) => {
        this.setState({
            query: event.target.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault(); 
        sendInput(`${this.state.query}`);
        this.props.onSubmission();
    }

    render() {
        return (
            <Fade>
                <div className="form">
                    <h1>Find out what reddit thinks about:</h1>
                    <form onSubmit={this.handleSubmit}>
                        <input 
                            type="text" required
                            value={this.state.query}
                            placeholder="Aliexpress"
                            onChange={this.handleQueryChange}
                        />
                        <button type="submit">Go!</button>
                    </form>
                </div>
            </Fade>
        )
    }
}

// posts user to the server
async function sendInput(input) {
    const response = await fetch('/request', {
      method: "POST",
      headers: {'Content-Type': 'text/plain'},
      body: input
    }); 
    return await response;
  }

export default Form