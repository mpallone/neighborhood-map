# Neighborhood Map
A map of NYC coffee shops. Coffee shops are filterable based on a forgiving, case-insensitive, keyword search. If any word in the search matches the coffee shop, then that coffee shop will be included.

### Running the App
Either point your browser to `https://mpallone.github.io/neighborhood-map/`, or drag index.html into a new browser tab.

### "Compiling" the App
This app uses Gulp to create distribution files.

Initial setup steps:
* `npm install --global gulp-cli # If you need to install the gulp command`
* `npm install --save-dev gulp`
* `npm install gulp-clean-css --save-dev`
* `npm install --save-dev gulp-minify`

After setup, simply type `gulp` at the root directory of the project (the same level as the index.html file). This will do an initial processing of the JS and CSS files in the `src` directory, and put the resulting files in the `dist` directory. Then, the gulp will continue to run, watching files in the project for changes. If a file changes, this process will repeat itself.

### Thanks!
This app used the free versions of the New York Times API and the Google Maps API. Thanks!

