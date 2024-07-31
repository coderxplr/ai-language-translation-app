In case you wanna use api the you can use below curl.

curl --location 'https://api.openai.com/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer Your_API_KEY ' \
--header 'Cookie: __cf_bm=W7IBPAe31lqRP6yy9iT2FcOSixPtmN_tYO9DWBVstJY-1721456349-1.0.1.1-EEqThaqVn2XWrITLksLksS5W3WFjWr_w6K1_hQSVMI2kszyzQ8zHaGO9grmuA4tiGavyVbAAUxD00RkvgUS8oA; _cfuvid=qR8Zuol77_1UW6z3SeFsYIHc9LTeY5Yl9iEdZn0ZTww-1721453794189-0.0.1.1-604800000' \
--data '{
    "model": "gpt-3.5-turbo",
    "messages": [
        {"role": "system", "content": "You are a translator."},
        {"role": "user", "content": "Translate this into Urdu: Your text here"}
    ],
    "temperature": 0.3,
    "max_tokens": 100,
    "top_p": 1.0,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0
}'