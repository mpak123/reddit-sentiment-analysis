import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles'; 

// figure out how to get the information from data into here using props
const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const theme = createTheme({
    typography: {
        fontFamily: "San Francisco"
    }
});

class Item extends React.Component {
    constructor(props) {
        super(props); 
    }

    render () {
        return (
            <Box sx={{ minWidth: 200 }}>
              <Card variant="outlined">
                <React.Fragment>
                    <CardContent>
                        <ThemeProvider theme={theme}>
                            <Typography variant="h5" component="div">
                                <Info item={this.props.item}/>
                            </Typography>
                        </ThemeProvider>
                        <ThemeProvider theme={theme}>
                            <Typography variant="body2">
                                <Caption id={this.props.id} number={this.props.number}/>
                            </Typography>
                        </ThemeProvider>
                    </CardContent>
                </React.Fragment>
              </Card>
            </Box>
        );
    }
}

function Info(props) {
    if (Number(props.item) === props.item && props.item % 1 !== 0){
        return <p>{Number(props.item).toFixed(2)}%</p>
    } else {
        return <p>{props.item}</p> 
    }
}

function Caption(props) {
    if (props.id > 0){
        if (props.id == 1){
            return <p>negative</p>
        } else if (props.id == 2){
            return <p>neutral</p>
        } else {
            return <p>positive</p>
        }
    } else {
        return <p>{props.number} occurences</p>
    }
}

export default Item
