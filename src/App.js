import React from 'react';
import _ from 'lodash';
import CanvasJSReact from './canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class DownloadPizzaFile extends React.Component {
  constructor(props) {
    super(props);
    this.chartReference = React.createRef();
  }
  componentDidMount() {
	
  }
  downloadPizzaData = () => {
    const options = {
			animationEnabled: true,
			theme: "light2",
			title:{
				text: "Most Frequent Pizza Orders"
			},
			axisX: {
				title: "Pizza Topping Combination",
				reversed: true,
			},
			axisY: {
				title: "Frequency",
				labelFormatter: this.addSymbols
			},
			data: [{
				type: "bar",
				dataPoints: this.mostFrequent
			}]
		}
    const url = "https://cors-anywhere.herokuapp.com/https://www.olo.com/pizzas.json";
    let sortedToppings = []
    let frequencyObj;
    let sortByFrequency;
    let mostFrequent;
    const response = fetch(url, {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(res => res.json())
      .then(response => {
        console.log(response[0].toppings);
        let i = 0
        response.forEach(pizza => {
          sortedToppings[i] = pizza.toppings.sort()
          i++
        });
        frequencyObj = this.mostFrequentPizzaTopping(sortedToppings)
        sortByFrequency = this.sortByObjFrequency(frequencyObj)
        mostFrequent = this.topTwentyCount(sortByFrequency)
        console.log(sortedToppings)
        console.log(frequencyObj)
        console.log(Object.keys(frequencyObj).length)
        console.log(sortByFrequency)
        console.log(mostFrequent)
        
        return (
          <div>
            <CanvasJSChart options = {options}
              /* onRef={ref => this.chart = ref} */
            />
            {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
          </div>
          );
      })
  }

  addSymbols(e){
		var suffixes = ["", "K", "M", "B"];
		var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
		if(order > suffixes.length - 1)
			order = suffixes.length - 1;
		var suffix = suffixes[order];
    return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
  }
  
  mostFrequentPizzaTopping = (arrOfToppings) => {
    let hash = {}
    for (var i = 0; i < arrOfToppings.length; i++) {
      if (!hash[arrOfToppings[i]]) {
        hash[arrOfToppings[i]] = 1
      }
      else {
        hash[arrOfToppings[i]] = hash[arrOfToppings[i]] + 1
      }
    }
    return hash
  }

  sortByObjFrequency = (obj) => {
    obj = _.fromPairs(_.sortBy(_.toPairs(obj), 1).reverse())
    return obj
  }

  sortToppings = (ArrayOfObjects) => {
    let i = 0
    let sorted = []
    ArrayOfObjects.forEach(pizza => {
      sorted[i] = pizza.toppings.sort()
      i++;
    })
    return sorted;
  }

  topTwentyCount = (obj) => {
    let arr = Object.entries(obj)
    let topTwentyArr = arr.slice(0, 20);
    topTwentyArr = topTwentyArr.flat()
    let topTwentyObj = {};
    let topTwentyCollection;
    for (var i = 0, len = topTwentyArr.length; i < len; i += 2) {
      topTwentyObj[topTwentyArr[i]] = (topTwentyArr[i + 1]);
    }
    topTwentyCollection = Object.keys(topTwentyObj).map((key) => {
      return {'y':topTwentyObj[key], 'label':key};
    });
    return topTwentyCollection;
  }

  render() {

    return(
      <div>
        {this.downloadPizzaData()}
      </div>
    )
	
	}
}


export default DownloadPizzaFile;
