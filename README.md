# security_and_authentication

V1
Using mongoose-encryption in V1 to encrypt passwords with a secret key-word. 
.env file is kept secret and stores the secred value.

V2
Using MD5 hashing function to hash passwords. No encryption key is needed! 
When checking authentication, comparing two hashes instead of comparing two plain-text passwords. 
