## About the project:

This is a web api created using Python and SQLite and utilizes FastAPI for the endpoints.
The Web interface is just html and forms.

Note that this is a monolithic setup (I pray that is the right way to describe this), I hope that this is acceptable considering
that this entire class has been focused on seperate containers for frontend
and backend.

## Docker Setup

Download the project, unzip if it is zipped.

`cd Midterm_assignment`

Then, make sure that you have docker destop running, and use the following command in your terminal

`docker-compose up --build`

Visit: [http://localhost:5000](http://localhost:5000)

To shut down the project, simply use the following:

`docker-compose down`

## Testing the API

Use the web interface to test GET/POST/DELETE.

Final note, I chose to use Python, SQLite, and FastAPI as this is the stack that Samuel Echols and I used in CMPS 4200 for our AI project.
