
# MyFlix React App

## What is the purpose of this app?
Using React, it builds the client-side for an app called myFlix based on its existing server-side code (REST API and database).

## Features
### Main view
- Returns ALL movies to the user (each movie item with an image, title, and description)
- Filtering the list of movies with a “search” feature
- Ability to select a movie for more details
- Ability to log out
- Ability to navigate to Profile view

### Single Movie view
- Returns data (description, genre, director, image) about a single movie to the user
- Allows users to add a movie to their list of favorites

### Login view
- Allows users to log in with a username and password

### Signup view
- Allows new users to register (username, password, email, date of birth)
Profile view
- Displays user registration details
- Allows users to update their info (username, password, email, date of birth)
- Displays favorite movies
- Allows users to remove a movie from their list of favorites
- Allows existing users to deregister

## Optional Views & Features:
### Actors view
- Allows users to view information about different actors
Genre view
- Returns data about a genre, with a name and description
- Displays example movies
### Director view
- Returns data about a director (name, bio, birth year, death year)
- Displays example movies from the director
### Single Movie view (optional features)
- Allow users to see which actors star in which movies
- Allow users to view more information about different movies, such as the release date and the movie rating
- Allow users to access different movie information, such as genre description and director bio, without leaving the view (e.g., tooltips)
- Allow users to share a movie
- Display a list of related or similar movies
### Main view (optional features)
- Allow users to sort movies based on different criteria
Profile, Single Movie, and Main views (optional features)
- Allow users to create a “To Watch” list in addition to their “Favorite Movies” list

## Technical Requirements
- The application is a single-page application (SPA)
- The application uses state routing to navigate between views and share URLs
- The application gives users the option to filter movies using a “search” feature
- The application uses Parcel as its build tool
- The application is written using the React library and in ES2015+
- The application uses Bootstrap as a UI library for styling and responsiveness
- The application contains function components
- The application is hosted online
- The application uses React Redux for state management of at least one feature (i.e. filtering movies)


    