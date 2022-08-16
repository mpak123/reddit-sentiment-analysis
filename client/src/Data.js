import React from 'react';
import Fade from 'react-reveal/Fade'; 
import Grid from '@mui/material/Grid';  
import Item from './Item.js' 

// basic idea here, scroll to reveal each component of the data. The last component should be a bunch of cards revealing the most common words.
class Data extends React.Component{
    constructor(props) {
        super(props);
    }

    // here, implement the fade in for each component during the scroll. For the words, fade in the component with the grid of cards
    render() {
        return (
            <div class="container">
                <section class="one">
                    <Fade>
                        <Bool bool={this.props.data.bool}/>
                    </Fade>
                </section> 
                <section class="two">
                    <Fade>
                        <Grid container spacing={4} justify="center">
                            <Grid item xs={4}>
                                <Item item={this.props.data.analysis[0]} id={1}/>
                            </Grid>
                            <Grid item xs={4}>
                                <Item item={this.props.data.analysis[1]} id={2}/>
                            </Grid>
                            <Grid item xs={4}>
                                <Item item={this.props.data.analysis[2]} id={3}/>
                            </Grid>
                        </Grid>
                    </Fade>
                </section>
                <section class="three">
                    <Fade>
                        <h1 className="header">Check out the most common words below</h1>
                    </Fade>
                </section>
                <section class="four">
                    <Fade>
                        <Grid container spacing={4} justify="center">
                            {this.props.data.words.map((item) => (
                                <Grid item xs={4}>
                                    <Item item={item[0]} id={0} number={item[1]}/>
                                </Grid>
                            ))}
                        </Grid>
                    </Fade>
                </section>
            </div>
        );
    }
}

function Bool(props) {
    if (props.bool){
        return <h1>Sentiment is generally positive</h1>
    } else {
        return <h1>Sentiment is generally negative</h1>
    }
}

export default Data