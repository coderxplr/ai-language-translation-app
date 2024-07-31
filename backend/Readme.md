api curl 

curl --location 'localhost:5000/api/translate' \
--header 'Content-Type: application/json' \
--data '{
     "message":"Hey there",
     "language":"Urdu",
     "model":"gpt-3.5-turbo-instruct"
}'