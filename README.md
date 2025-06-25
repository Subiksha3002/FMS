# FMS
                                FeedBack Management System


---I preserved the code in Docker if it use the following steps ---
first install the docker desktop in your system
then check these files are available in this repo dockerfile, .dockerignore 
then give the commands to build the backend "docker build -t django-dpdzero ."
then to run the backend port "docker run -p 8000:8000 django-dpdzero"


-- For Backend setup using Django Python--
step 1: open vscode terminal create virtual environment python -m venv venv
step 2: Then activate the environment using venv\Scripts\activate
step 3: To run the packages use the command "pip install -r requirements.txt"
step 4: Craete a django project with project name(Expenses) using the command - "django-admin startproject DPDZero"
step 5: Once the project is created change the directy to the project folder here -  "cd DPDZero"
step 6: To check the server is running, give the command - : "python manage.py runserver"
step 7: Then create django app to create RESTAPIs - "python manage.py startapp Feedbacksystem"
step 8: Once the code is done then give the command to load the models and migrate it to the output port - "python manage.py makemigrations", "python manage.py migrate"
step 9: Finally run the server to view the backend output using the command - "python manage.py runserver.

----Front-end using React----
navigate to the path cd react app name
so to create react app install the requirements.txt as I given 
then give the command npm start to the run the react app