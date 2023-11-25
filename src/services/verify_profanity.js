const fs = require('fs');

// Function to read the CSV and return data or throw error.
function readcsv(filepath){
    try {
        data = fs.readFileSync(filepath, 'utf8');
        return(data);
    } 
    catch (err) {
        console.error(err);
    }
}

function verify_foul(description){
    const table_data=readcsv("bag.csv").split("\r\n")
    const input=description.split(" ")
    const foul = new Set();
    for (let i=0;i<input.length;i++){
        if(table_data.includes(input[i])){
            foul.add(input[i]);
        }
    }
    return [...foul]
}
console.log(verify_foul("your ass is very nice"))
