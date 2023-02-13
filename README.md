# SampleAPI1
This is a really basic API that uses mongodb to deploy to Cyclic
1. Download files from this repo into a folder
2. Run npm install
3. Go to the config folder and create a file named .env
4. Add line to the .env file:
<br/> DB_STRING={Mongodb connection string which includes collection name}
5. Execute for development: npm run dev
5. Execute for production: npm start
6. Test with postman or browser locally: http://localhost:3000/questions
6. Test after deploying to Cyclic using: {Cyclic address here}/questions

