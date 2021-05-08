# security_and_authentication

V3
Using bcrypt package to add 10 salt rounds and encrypt the password field. Created a random salt field in the DB. 
When a new user is created, adding a hashed password to the password field. When logging in, comparing the password field to the bcrypted attempt password.
