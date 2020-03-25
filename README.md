# Coding Challenge

Coding challenge for Framework Science, from https://github.com/sxie2004/Coding-Challenge

## Running the project

Install modules by running `npm install` in the command line.

Run the project with `npm run start`.

## Assumptions
  The user input does not need to be * to mean 'any', as long as the input isn´t a valid number or date (depending on each case) it will be handled as *

  CSV rendering is done with semicolons `;` which was the default setup in the source repo. If needed it can be changed to comma `,` by changing the `toCSV` function in `src/utils.js`

  From

  ```javascript
  export const toCSV = arr => {
    let headers = Object.keys(arr[0]).join(';');
    let lines = arr.map(obj => Object.values(obj).join(';'));
    return [headers, ...lines].join(';\n');
  }
  ```

  To
  ```javascript
  export const toCSV = arr => {
    let headers = Object.keys(arr[0]).join(',');
    let lines = arr.map(obj => Object.values(obj).join(','));
    return [headers, ...lines].join('\n');
  }
  ```


## Tests
For the scope of this challenge, tests are manual.
This [Google Sheet](https://docs.google.com/spreadsheets/d/1-spSJIxfApn8bYwye8hjTIutFmHTZ6xjOymYypKIDkk/edit?usp=sharing) was used to check the expected results.


## Edits
Now ordering and grouping results by accounts.
