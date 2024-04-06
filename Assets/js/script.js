const baseUrl =  "https://api.openweathermap.org/data/2.5/"
const apiKey= "017f971b237adb47b2cb9f536e739bd6"


//global array to store search history
// Initialize search history array with data from localStorage or an empty array if it doesn't exist
var searchHistory = localStorage.getItem('searchHistory');
if (searchHistory) {
    searchHistory = JSON.parse(searchHistory);
} else {
    searchHistory = [];
    $(".search-history-button").each(function(index) {
        if (index < $(".search-history-button").length - 1) {
            searchHistory.push("Button");
        }
    });
}


//=============================================================================
function getCurrentWeather(cityNAME){
const option=`weather?q=${cityNAME}&appid=${apiKey}&units=metric`

const combinedUrl = baseUrl+ option

return $.get(combinedUrl)
}

// ==========================================================================
function  getDayWeather(cityNAME){
    const option = `forecast?q=${cityNAME}&appid=${apiKey}&units=metric`
    const combinedUrl = baseUrl + option

    return $.get(combinedUrl)
}
//=================================================================
function outputCurrentWeather(recievedData){
const city = $('.city-name')
const date = $('.date')
const temp= $('.temp')
const wind= $('.wind')
const humidity = $('.humidity')


city.text(`City Name: ${recievedData.name}`)
date.text(`Date: ${dayjs().format('MM/DD/YYYY')}`)
temp.text(`Temp: ${recievedData.main.temp}`)
wind.text(`Wind: ${recievedData.wind.speed}`)
humidity.text(`Humidity: ${recievedData.main.humidity}`)



// console.log(recievedData)
// console.log(recievedData.wind)
// console.log(recievedData.main.temp)
}




function outputDaysWeather(recievedData){
const targetSection = $('#fiveDays')
targetSection.empty()
    // FOR LOOP => acces the list array 
//input date on each grid box
//input temp
// input wind
//input humidity
console.log(recievedData)

recievedData.list.forEach(function(fiveDayGridData){
const date = dayjs(fiveDayGridData.dt_txt).format('MM/DD/YYYY')

    //the data has hour values for each day, so i target hour 12 to target next day
   if(fiveDayGridData.dt_txt.includes('12')){
    targetSection.append(`
    <div class="bg-gray-800 rounded-lg p-4 text-white">
        <p>${date}</p>
        <div class="flex justify-center flex-col mb-2">
          <img class="scale-75" src="https://openweathermap.org/img/wn/${fiveDayGridData.weather[0].icon}@2x.png"
        </div>
        <div >
          <p>Temp: ${fiveDayGridData.main.temp}</p>
          <p>Wind: ${fiveDayGridData.wind.speed}</p>
          <p>Humidity: ${fiveDayGridData.main.humidity}</p>
        </div>
    
    
    
    `)
   }
})

}


//==========================================================================================
// this function triggers when search button is clicked
// purpose: get the value out of input box => store it into history and trigger city weather functions
function searchButton(eventObject){

  // target the input value inside #search-input 
var inputValue = $('#search-input').val()
console.log(inputValue)

// send the value to the UPDATESEARCHHISTORY 
updateSearchHistory(inputValue)

}

//=========================================================================

// function updateSearch history
function updateSearchHistory(searchTerm){
  


  //check if search history buttons full
  // if not full add the new search term to the next available button
  // if full move existing search history values down by index Then overwrite the top box

  if(searchHistory.length < $(".search-history-button").length){
//if not full  since .length always gonna be the next index its easy to do
$(".search-history-button").eq(searchHistory.length).text(searchTerm)
// add to local storage
searchHistory.push(searchTerm)

  }else{
//if full
// loop thru reverse order, start from second to last element
      for(var i = searchHistory.length -1; i>0; i--){
        // first update/move its index  
        console.log(i+'before: ' +searchHistory[i])
        searchHistory[i] = searchHistory[i - 1];
        console.log(i+'after: ' +searchHistory[i])
        // second update/move its context
        $(".search-history-button").eq(i).text(searchHistory[i])
        

      }
//overwrite the top button content with the new search
$(".search-history-button").first().text(searchTerm)
      // remove the last element from the array
      searchHistory[0] = searchTerm;
  }

  // Update localstorage wit h the updated search history
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

}
//=====================================================================







$(document).ready(function(){

    // Update the search history buttons with the loaded search history
    for (var i = 0; i < searchHistory.length; i++) {
      $('.search-history-button').eq(i).text(searchHistory[i])
  }
  


})



$('#search-button').on('click', searchButton)






//current weather
getCurrentWeather('London').then(outputCurrentWeather)

// 5 day
getDayWeather('London').then(outputDaysWeather)

