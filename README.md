# Mangadex Hover Info

This is a small chrome extension that enables preview 
information in the follows section of the website
https://mangadex.org/ .

## Requirement

* Node.js https://nodejs.org/

## Build

1. Run the `yarn` command to install all the dependencies.

    ```bash
       $ yarn
    ```
    
1. Retrieve the tags id and names from a snapshot of the search page (needs login). [Link to page](https://mangadex.org/search).

    ```bash
       $ yarn tags {pathToFile}
    ```    
    
1. Build the project by calling `yarn build`

    ```bash
       $ yarn build
    ```

The built artifacts are available at `projectRoot/build`

Icons used in this repo have been designed by `Freepik` from Flaticon.
